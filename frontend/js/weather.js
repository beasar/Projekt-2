import { getClothingRecommendation } from "./clothing.js";

const key = "fb005a8552253eeee41503852feb5117";
const url = "https://api.openweathermap.org/data/2.5";

const statusEl = document.querySelector("#status");
const weatherEl = document.querySelector("#weather");

function getIcon(main, temp, iconCode) {
  const isNight = iconCode.endsWith("n");

  switch (main) {
    case "Clear":
      return isNight ? "🌙" : "☀️";
    case "Clouds":
      return temp < 10 ? "☁️" : "⛅";
    case "Rain":
    case "Drizzle":
      return "🌧️";
    case "Thunderstorm":
      return "⛈️";
    case "Snow":
      return "❄️";
    case "Mist":
    case "Fog":
    case "Haze":
      return "🌫️";
    default:
      return "🌡️";
  }
}

async function getWeather(query) {
    statusEl.textContent = "Henter vejret...";
    const params = `${query}&units=metric&lang=da&appid=${key}`;

    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${url}/weather?${params}`),
            fetch(`${url}/forecast?${params}&cnt=8`)
        ]);

        if (currentRes.status === 404) {
            statusEl.textContent = "Byen blev ikke fundet.";
            return;
        }

        if (!currentRes.ok || !forecastRes.ok) {
            throw new Error(
                `Request failed: ${currentRes.status} / ${forecastRes.status}`
            );
        }

        const current = await currentRes.json();
        const forecast = await forecastRes.json();

        renderWeather(current, forecast);
        statusEl.textContent = "";

    } catch (error) {
        console.error(error);
        statusEl.textContent = "Kunne ikke hente vejret.";
    }
}

function renderWeather(current, forecast) {
    const temp = current.main.temp;
    const { main, description, icon } = current.weather[0];
    const windKmh = Math.round(current.wind.speed * 3.6);
    const rainChance = Math.round(forecast.list[0].pop * 100);

    document.querySelector("#city").textContent = current.name;
    document.querySelector("#icon").textContent = getIcon(main, temp, icon);
    document.querySelector("#temp").textContent = `${Math.round(temp)} °C`;
    document.querySelector("#description").textContent = description;
    document.querySelector("#wind").textContent = `${windKmh} km/t`;
    document.querySelector("#humidity").textContent = `${current.main.humidity} %`;
    document.querySelector("#rain-risk").textContent = `${rainChance} %`;

    const recommendation = getClothingRecommendation({
        temp,
        main,
        windKmh,
        rainChance
    });

    document.querySelector("#clothing-text").textContent = recommendation.join(", ");

    const offset = forecast.city.timezone;
    const slots = getTodaySlots(current, forecast);

    renderTitle(current, offset);
    renderForecast(slots, offset);

    weatherEl.hidden = false;
}

function renderForecast(slots, offset) {
    const listEl = document.querySelector("#forecast-list");
    listEl.innerHTML = "";

    slots.forEach((slot) => {
        const local = toLocal(slot.dt, offset);
        const { main, icon } = slot.weather[0];
        const temp = slot.main.temp;

        const li = document.createElement("li");
        li.className = "forecast-item";

        li.innerHTML = `
            <span class="forecast-time">${formatHour(local)}</span>
            <span class="forecast-icon">${getIcon(main, temp, icon)}</span>
            <span class="forecast-temp">${Math.round(temp)} °C</span>
            <span class="forecast-rain">💧 ${Math.round(slot.pop * 100)} %</span>
        `;

        listEl.append(li);
    });
}

function getWeatherFromLocation() {
  if (!("geolocation" in navigator)) {
    statusEl.textContent =
      "Din browser understøtter ikke lokation. Indtast en by.";
    return;
  }

  statusEl.textContent = "Henter din lokation...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getWeather(`lat=${latitude}&lon=${longitude}`);
    },
    () => {
      statusEl.textContent = "Lokation er ikke tilgængelig. Indtast en by.";
    },
    { timeout: 10000 },
  );
}

function toLocal(timestamp, offset) {
    return new Date((timestamp + offset) * 1000);
}

function dateKey(date) {
    return date.toISOString().slice(0, 10);
}

function formatHour(date) {
    return `${String(date.getUTCHours()).padStart(2, "0")}:00`;
}

function getTodaySlots(current, forecast) {
    const offset = forecast.city.timezone;
    const today = dateKey(toLocal(current.dt, offset));

    const slots = forecast.list.filter(
        (slot) => dateKey(toLocal(slot.dt, offset)) === today
    );

    return slots.length > 0 ? slots : forecast.list.slice(0, 4);
}

function formatTime(date) {
    const h = String(date.getUTCHours()).padStart(2, "0");
    const m = String(date.getUTCMinutes()).padStart(2, "0");
    return `${h}:${m}`;
}

function renderTitle(current, offset) {
    const now = toLocal(current.dt, offset);

    let weekday = now.toLocaleDateString("da-DK", {
        weekday: "long",
        timeZone: "UTC",
    });

    weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

    document.querySelector("#day-range").textContent =
        `${weekday} ${formatTime(now)}`;
}

// Søg efter en by
document.querySelector("#search-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const city = document.querySelector("#city-input").value.trim();

    if (city) {
        getWeather(`q=${encodeURIComponent(city)}`);
    }
});

// Hent vejret ved hjælp af brugerens lokation
getWeatherFromLocation();


// ===================================
// LOGIN OG LOGOUT
// ===================================

const username = localStorage.getItem("username");

const welcomeUsername = document.getElementById("welcome-username");
const loginLink = document.getElementById("login-link");
const loginStatus = document.getElementById("login-status");
const logoutButton = document.getElementById("logout-button");

if (username) {
    welcomeUsername.textContent = username;

    loginLink.hidden = true;
    loginStatus.hidden = false;
    logoutButton.hidden = false;

    loginStatus.textContent = "Du er logget ind";
} else {
    welcomeUsername.textContent = "VejrApp";

    loginLink.hidden = false;
    loginStatus.hidden = true;
    logoutButton.hidden = true;
}

// Logout-popup
const logoutModal = document.getElementById("logout-modal");
const cancelLogout = document.getElementById("cancel-logout");
const confirmLogout = document.getElementById("confirm-logout");

logoutButton.addEventListener("click", () => {
    logoutModal.hidden = false;
});

cancelLogout.addEventListener("click", () => {
    logoutModal.hidden = true;
});

confirmLogout.addEventListener("click", () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    window.location.href = "index.html";
});
