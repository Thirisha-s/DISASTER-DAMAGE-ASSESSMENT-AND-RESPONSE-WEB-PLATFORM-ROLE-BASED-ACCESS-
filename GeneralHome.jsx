// src/pages/GeneralHome.jsx

import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet-draw";




export default function GeneralHome() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestText, setRequestText] = useState("");
  const [areaGeoJSON, setAreaGeoJSON] = useState(null);
  const [dateBefore, setDateBefore] = useState("");
  const [dateAfter, setDateAfter] = useState("");

  // Initialize Leaflet map + Draw controls
  useEffect(() => {
  if (document.getElementById("map")._leaflet_id) {
    return;
  }

  const map = L.map("map").setView([17.385044, 78.486671], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const severityColors = {
    "No Damage": "#2ecc71",
    "Minor": "#f1c40f",
    "Major": "#e67e22",
    "Destroyed": "#e74c3c",
  };

  const damageData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { severity: "No Damage", description: "No visible damage" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [78.45, 17.42],
              [78.48, 17.42],
              [78.48, 17.44],
              [78.45, 17.44],
              [78.45, 17.42],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { severity: "Minor", description: "Some minor cracks observed" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [78.44, 17.4],
              [78.46, 17.4],
              [78.46, 17.42],
              [78.44, 17.42],
              [78.44, 17.4],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { severity: "Major", description: "Buildings severely damaged" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [78.46, 17.4],
              [78.49, 17.4],
              [78.49, 17.42],
              [78.46, 17.42],
              [78.46, 17.4],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { severity: "Destroyed", description: "Area completely destroyed" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [78.47, 17.38],
              [78.5, 17.38],
              [78.5, 17.4],
              [78.47, 17.4],
              [78.47, 17.38],
            ],
          ],
        },
      },
    ],
  };

  const geoStyle = (feature) => ({
    fillColor: severityColors[feature.properties.severity] || "gray",
    weight: 2,
    color: "black",
    fillOpacity: 0.6,
  });

  const onEachFeature = (feature, layer) => {
    if (feature.properties?.description) {
      layer.bindPopup(
        `<strong>${feature.properties.severity}</strong><br/>${feature.properties.description}`
      );
    }
  };

  // ✅ Add polygons to the map
  L.geoJSON(damageData, {
    style: geoStyle,
    onEachFeature: onEachFeature,
  }).addTo(map);

  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  const drawControl = new L.Control.Draw({
    draw: {
      polygon: true,
      rectangle: true,
      marker: false,
      polyline: false,
      circle: false,
      circlemarker: false,
    },
    edit: { featureGroup: drawnItems },
  });

  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, (event) => {
    const layer = event.layer;
    drawnItems.clearLayers();
    drawnItems.addLayer(layer);

    // Save drawn area as GeoJSON
    setAreaGeoJSON(layer.toGeoJSON());
  });
}, []);


  // Handle form submit
  const handleSubmit = (e) => {
  e.preventDefault();

  if (!areaGeoJSON) {
    alert("⚠ Please draw an area on the map before submitting.");
    return;
  }

  if (!dateBefore || !dateAfter) {
    alert("⚠ Please select both start and end dates.");
    return;
  }

  // Just show success alert, no API call
  alert("✅ Request submitted successfully!");

  // Clear form fields
  setName("");
  setEmail("");
  setRequestText("");
  setAreaGeoJSON(null);
  setDateBefore("");
  setDateAfter("");
};


  return (
    <div>
      {/* Map Section */}
      <div id="map" style={{ height: "400px", marginBottom: "20px" }}></div>

      {/* Safety Instructions */}
      <div className="p-3 mb-3 bg-light rounded">
        <h3>Safety Instructions / FAQ</h3>
        <ul>
          <li>Stay clear of major damage zones.</li>
          <li>Follow evacuation routes as directed by authorities.</li>
          <li>Submit any request for help using the form below.</li>
          <li>In case of earthquake: Drop, Cover &amp; Hold On.</li>
        </ul>
      </div>

      {/* Request Form */}
      <div className="p-3 border rounded">
        <h3>Submit Request</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            className="form-control mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            className="form-control mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Your Request"
            className="form-control mb-2"
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
          ></textarea>

          {/* Date Pickers */}
          <label>Start Date</label>
          <input
            type="date"
            className="form-control mb-2"
            value={dateBefore}
            onChange={(e) => setDateBefore(e.target.value)}
          />

          <label>End Date</label>
          <input
            type="date"
            className="form-control mb-2"
            value={dateAfter}
            onChange={(e) => setDateAfter(e.target.value)}
          />

          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
