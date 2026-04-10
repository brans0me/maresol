// api/pricelabs.js
// Vercel Serverless Function: fetches pricing data from PriceLabs Customer API
//
// SETUP:
// 1. Add environment variable in Vercel Dashboard → Settings → Environment Variables:
//    PRICELABS_API_KEY = F1KIqhFJUXIaSNzzTDMZAKvb2Hlib76XlyhCFgPc
//
// USAGE from frontend:
//    fetch('/api/pricelabs?listing_id=673116337746529551')
//    Returns: { prices: { "2026-04-15": { price: 225, min_stay: 2 }, ... } }

const ALLOWED_LISTINGS = {
  "673116337746529551": "treetop",   // Light-Filled Tree-Top Getaway
  "675418095311402651": "mcm",       // MCM Studio with Patio
};

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (req.method === "OPTIONS") return res.status(200).end();

  var listing_id = req.query.listing_id;

  if (!listing_id || !ALLOWED_LISTINGS[listing_id]) {
    return res.status(400).json({ error: "Invalid listing_id. Allowed: " + Object.keys(ALLOWED_LISTINGS).join(", ") });
  }

  var apiKey = process.env.PRICELABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "PriceLabs API key not configured" });
  }

  try {
    // Fetch pricing data from PriceLabs Customer API
    var response = await fetch(
      "https://api.pricelabs.co/v1/listing_prices?listing_id=" + listing_id,
      {
        headers: {
          "X-API-Key": apiKey,
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      var errorText = await response.text();
      console.error("PriceLabs API error:", response.status, errorText);
      return res.status(502).json({ error: "PriceLabs API returned " + response.status });
    }

    var data = await response.json();

    // Cache for 2 hours — PriceLabs updates prices once or twice daily
    res.setHeader("Cache-Control", "s-maxage=7200, stale-while-revalidate=14400");
    return res.status(200).json(data);

  } catch (error) {
    console.error("PriceLabs fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch pricing data" });
  }
}
