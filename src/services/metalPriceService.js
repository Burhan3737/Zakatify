import { FALLBACK_METAL_PRICES_USD_PER_GRAM } from "../models/zakatModel";

const GRAMS_PER_TROY_OUNCE = 31.1034768;

function parseGoldApiResponse(payload) {
  if (!payload || typeof payload !== "object") return null;
  const price = Number(payload.price);
  if (!Number.isFinite(price)) return null;
  return price;
}

export async function fetchMetalPrices() {
  try {
    const [goldResponse, silverResponse] = await Promise.all([
      fetch("https://api.gold-api.com/price/XAU"),
      fetch("https://api.gold-api.com/price/XAG"),
    ]);

    if (!goldResponse.ok) {
      throw new Error(`Gold API failed with ${goldResponse.status}`);
    }
    if (!silverResponse.ok) {
      throw new Error(`Silver API failed with ${silverResponse.status}`);
    }

    const goldPayload = await goldResponse.json();
    const silverPayload = await silverResponse.json();

    const goldPerOunce = parseGoldApiResponse(goldPayload);
    const silverPerOunce = parseGoldApiResponse(silverPayload);

    if (goldPerOunce === null || silverPerOunce === null) {
      throw new Error("Unable to parse metal price response.");
    }

    return {
      goldPerGram: goldPerOunce / GRAMS_PER_TROY_OUNCE,
      silverPerGram: silverPerOunce / GRAMS_PER_TROY_OUNCE,
      source: "gold-api.com",
      fallback: false,
      updatedAt: new Date().toISOString(),
    };
  } catch (_error) {
    return {
      goldPerGram: FALLBACK_METAL_PRICES_USD_PER_GRAM.gold,
      silverPerGram: FALLBACK_METAL_PRICES_USD_PER_GRAM.silver,
      source: "fallback-static",
      fallback: true,
      updatedAt: new Date().toISOString(),
    };
  }
}
