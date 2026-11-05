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