
const loginForm = document.getElementById("loginForm");

const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");

const submitButton = document.getElementById("submitButton");
const switchButton = document.getElementById("switchButton");

const switchText = document.getElementById("switchText");
const formMessage = document.getElementById("formMessage");

const nameInput = document.getElementById("name");

// Azure-backend
const API_URL = "https://weatherapp-backend-2026-cqg6bdc8g7h2cagq.swedencentral-01.azurewebsites.net/api/users";

let isRegistering = false;

// Skift mellem login og registrering
switchButton.addEventListener("click", function () {
    isRegistering = !isRegistering;

    formMessage.textContent = "";
    nameInput.value = "";

    if (isRegistering) {
        formTitle.textContent = "Opret bruger";
        formSubtitle.textContent = "Opret din personlige VejrApp-profil.";
        submitButton.textContent = "Opret bruger";
        switchText.textContent = "Har du allerede en bruger?";
        switchButton.textContent = "Tilbage til login";
    } else {
        formTitle.textContent = "Velkommen!";
        formSubtitle.textContent = "Dit simple vejr- og tøjtjek.";
        submitButton.textContent = "Log ind";
        switchText.textContent = "Har du ikke en bruger endnu?";
        switchButton.textContent = "Opret bruger";
    }
});

// Login og registrering
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();

    if (name.length < 4 || name.length > 12) {
        formMessage.textContent =
            "Dit navn skal være mellem 4 og 12 tegn.";
        return;
    }

    submitButton.disabled = true;
    formMessage.textContent = "Vent venligst...";

    try {
        let response;

        if (isRegistering) {
            // Opret ny bruger i Azure SQL
            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: name
                })
            });
        } else {
            // Find eksisterende bruger
            response = await fetch(
                `${API_URL}/${encodeURIComponent(name)}`
            );
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Noget gik galt.");
        }

        // Gem brugeroplysninger
        const user = data.user || data;

        localStorage.setItem("username", user.username || user.Username || name);

        if (user.id || user.Id) {
            localStorage.setItem("userId", user.id || user.Id);
        }

        formMessage.textContent = isRegistering
            ? "Brugeren er oprettet!"
            : "Du er logget ind!";

        // Send brugeren til forsiden
        window.location.href = "index.html";

    } catch (error) {
        console.error("Loginfejl:", error);

        formMessage.textContent =
            error.message || "Kunne ikke forbinde til serveren.";
    } finally {
        submitButton.disabled = false;
    }
});

