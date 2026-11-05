export function skiftBaggrund(temp, vejr) {
  let billede;

  if (temp <= 3 || vejr === "Snow") {
    billede = "baggrund_vinter.png";
  } else if (vejr === "Rain" || vejr === "Drizzle" || vejr === "Thunderstorm") {
    billede = "baggrund_regn.png";
  } else if (vejr === "Clouds") {
    billede = "baggrund_gråtvejr.png";
  } else if (vejr === "Clear" && temp >= 15) {
    billede = "baggrund_dagsolskin.png";
  } else {
    billede = "baggrund_efterår.png";
  }

  // Viser hvilket billede der bliver valgt
  console.log("Valgt baggrund:", billede);

  // Ændrer baggrundsbilledet
  document.body.style.backgroundImage = `url("/frontend/images/${billede}")`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
}
