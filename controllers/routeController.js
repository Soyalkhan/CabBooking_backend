// controllers/routeController.js
import axios from "axios";

const DISTANCE_MATRIX = "https://maps.googleapis.com/maps/api/distancematrix/json";
const DIRECTIONS_API   = "https://maps.googleapis.com/maps/api/directions/json";

export const calculateRoute = async (req, res) => {
  const { from, to } = req.body;
  if (!from || !to) {
    return res.status(400).json({ msg: "Both `from` and `to` are required." });
  }

  try {
    // 1) Distance Matrix → distance & duration
    const dm = await axios.get(DISTANCE_MATRIX, {
      params: { origins: from, destinations: to, key: process.env.GOOGLE_API_KEY },
    });
    const elem = dm.data.rows[0].elements[0];
    if (elem.status !== "OK") {
      throw new Error(elem.status);
    }
    const distanceText = elem.distance.text;
    const durationText = elem.duration.text;

    // 2) Directions API → to see if the route uses any toll roads
    const dir = await axios.get(DIRECTIONS_API, {
      params: { origin: from, destination: to, key: process.env.GOOGLE_API_KEY },
    });
    const route = dir.data.routes[0];
    // NOTE: Google’s Directions API doesn’t return cost—only whether a step is a toll road.
    // We’ll count how many steps are tolls, as a proxy:
    let tollSegments = 0;
    for (const leg of route.legs) {
      for (const step of leg.steps) {
        if (step.tollway || (step.html_instructions||"").toLowerCase().includes("toll")) {
          tollSegments++;
        }
      }
    }

    // 3) Return everything
    return res.json({
      distance: distanceText,
      duration: durationText,
      tollSegments,
      // if you have your own per‐toll rate: totalToll = tollSegments * RATE
    });
  } catch (err) {
    console.error("Route error:", err.message);
    return res.status(500).json({ msg: "Error calculating route" });
  }
};

