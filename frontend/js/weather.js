import { getClothingRecommendation, vælgBamse } from "./clothing.js";

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
      fetch(`${url}/forecast?${params}&cnt=1`),
    ]);

    if (currentRes.status === 404) {
      statusEl.textContent = "Byen blev ikke fundet.";
      return;
    }
    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error(
        `Request failed: ${currentRes.status} / ${forecastRes.status}`,
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
  document.querySelector("#humidity").textContent =
    `${current.main.humidity} %`;
  document.querySelector("#rain-risk").textContent = `${rainChance} %`;

  const recommendation = getClothingRecommendation({
    temp,
    main,
    windKmh,
    rainChance,
  });
  document.querySelector("#clothing-text").textContent =
    recommendation.join(", ");

  // Opdaterer bamsens billede efter temperatur og vejret
  const bamseBillede = vælgBamse(temp, main);

  document.querySelector("#bear-image").src = bamseBillede;

  weatherEl.hidden = false;
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

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const city = document.querySelector("#city-input").value.trim();
  if (city) {
    getWeather(`q=${encodeURIComponent(city)}`);
  }
});

getWeatherFromLocation();
