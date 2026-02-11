import { FALLBACK_METAL_PRICES_USD_PER_GRAM } from "../models/zakatModel";

const GRAMS_PER_TROY_OUNCE = 31.1034768;

function parseMetalsLiveSpot(payload) {
  if (!Array.isArray(payload)) return null;
  const flat = payload.reduce((acc, row) => ({ ...acc, ...row }), {});
  const goldPerOunce = Number(flat.gold);
  const silverPerOunce = Number(flat.silver);
  if (!Number.isFinite(goldPerOunce) || !Number.isFinite(silverPerOunce)) {
    return null;
  }

  return {
    goldPerGram: goldPerOunce / GRAMS_PER_TROY_OUNCE,
    silverPerGram: silverPerOunce / GRAMS_PER_TROY_OUNCE,
    source: "metals.live",
    fallback: false,
  };
}

export async function fetchMetalPrices() {
  try {
    const response = await fetch("https://api.metals.live/v1/spot");
    if (!response.ok) {
      throw new Error(`Metal API failed with ${response.status}`);
    }
    const payload = await response.json();
    const parsed = parseMetalsLiveSpot(payload);
    if (!parsed) {
      throw new Error("Unable to parse metal spot response.");
    }
    return {
      ...parsed,
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
