
const loginForm = document.getElementById("loginForm");

const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");

const submitButton = document.getElementById("submitButton");
const switchButton = document.getElementById("switchButton");

const switchText = document.getElementById("switchText");
const formMessage = document.getElementById("formMessage");

const nameInput = document.getElementById("name");

let isRegistering = false;

// Skift mellem login og registrering
switchButton.addEventListener("click", function () {

    isRegistering = !isRegistering;

    formMessage.textContent = "";
    nameInput.value = "";

    if (isRegistering) {

        formTitle.textContent = "Opret bruger";

        formSubtitle.textContent =
            "Opret din personlige VejrApp-profil.";

        submitButton.textContent = "Opret bruger";

        switchText.textContent =
            "Har du allerede en bruger?";

        switchButton.textContent =
            "Tilbage til login";

    } else {

        formTitle.textContent = "Velkommen!";

        formSubtitle.textContent =
            "Dit simple vejr- og tøjtjek.";

        submitButton.textContent = "Log ind";

        switchText.textContent =
            "Har du ikke en bruger endnu?";

        switchButton.textContent =
            "Opret bruger";
    }
});

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = nameInput.value.trim();

    if (name.length < 4) {
        formMessage.textContent =
            "Dit navn skal indeholde mindst 4 tegn.";
        return;
    }

    if (name.length > 12) {
        formMessage.textContent =
            "Dit navn må ikke være længere end 12 tegn.";
        return;
    }

    // Midlertidig besked indtil backend er tilsluttet
    formMessage.textContent = isRegistering
        ? "Registreringsformularen fungerer! Backend mangler."
        : "Loginformularen fungerer! Backend mangler.";

    console.log({
        name: name,
        action: isRegistering ? "register" : "login"
    });

});
