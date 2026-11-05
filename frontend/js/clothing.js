// clothing.js
export function getClothingRecommendation({ temp, main, windKmh, rainChance }) {
  // Din gruppemedlem bygger logikken her
  const items = [];

  if (temp < 5) items.push("Vinterjakke", "Hue", "Handsker");
  else if (temp < 15) items.push("Jakke");
  else items.push("T-shirt");

  if (rainChance > 50) items.push("Regnjakke eller paraply");

  return items;
}

// bamsebillede ud fra temperatur og vejr
export function vælgBamse(temperatur, vejrtype) {
  // Hvis det regner
  if (
    vejrtype === "Rain" ||
    vejrtype === "Drizzle" ||
    vejrtype === "Thunderstorm"
  ) {
    return "images/bamse_regn.png";
  }

  // Hvis temperaturen er under 5 grader
  if (temperatur < 5) {
    return "images/bamse_vinter.png";
  }

  // Hvis temperaturen er mellem 5 og 10 grader
  if (temperatur < 11) {
    return "images/bamse_vindjakke.png";
  }

  // Hvis temperaturen er mellem 11 og 15 grader
  if (temperatur < 16) {
    return "images/bamse_hoodie_jeans.png";
  }

  // Hvis temperaturen er mellem 16 og 20 grader
  if (temperatur < 21) {
    return "images/bamse_shorts-tshirt.png";
  }

  // Hvis temperaturen er 21 grader eller derover
  return "images/bamse_sommer.png";
}
