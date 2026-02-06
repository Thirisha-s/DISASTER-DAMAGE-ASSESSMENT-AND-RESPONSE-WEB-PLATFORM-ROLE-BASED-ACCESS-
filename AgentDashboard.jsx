import React, { useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  FeatureGroup,
  useMapEvents,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "../App.css"; 

export default function AgentDashboard() {
  const mapRef = useRef();
  const drawnLayerRef = useRef(null);

  
  const [overlay, setOverlay] = useState("osm");
  const [clickMode, setClickMode] = useState(false);
  const [clickedCoords, setClickedCoords] = useState(null);
  const [dateBefore, setDateBefore] = useState("");
  const [dateAfter, setDateAfter] = useState("");
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comments, setComments] = useState("");
  const [notifications, setNotifications] = useState([]);

  const [completedAreas] = useState([
    {
      id: 1,
      coordinates: [
        [37.78, -122.42],
        [37.78, -122.41],
        [37.77, -122.41],
        [37.77, -122.42],
      ],
      severity: "minor",
    },
    {
      id: 2,
      coordinates: [
        [37.76, -122.44],
        [37.76, -122.43],
        [37.75, -122.43],
        [37.75, -122.44],
      ],
      severity: "destroyed",
    },
    {
      id: 3,
      coordinates: [
        [37.79, -122.45],
        [37.79, -122.44],
        [37.78, -122.44],
        [37.78, -122.45],
      ],
      severity: "major",
    },
    {
      id: 4,
      coordinates: [
        [37.78, -122.47],
        [37.78, -122.46],
        [37.77, -122.46],
        [37.77, -122.47],
      ],
      severity: "none",
    },
  ]);

  const getColor = (severity) => {
    switch (severity) {
      case "minor":
        return "yellow";
      case "major":
        return "orange";
      case "destroyed":
        return "red";
      default:
        return "green";
    }
  };

  const getAction = (severity) => {
    switch (severity) {
      case "minor":
        return "Assess onsite";
      case "major":
        return "Prioritize aid";
      case "destroyed":
        return "Immediate evacuation";
      default:
        return "No action needed";
    }
  };

  function ClickCoordinates({ enabled, onClick }) {
    useMapEvents({
      click(e) {
        if (enabled) {
          onClick([e.latlng.lat, e.latlng.lng]);
        }
      },
    });
    return null;
  }

  const handleSubmitRequest = () => {
    if (!drawnLayerRef.current) {
      alert("Please draw an area on the map.");
      return;
    }
    if (!dateBefore || !dateAfter) {
      alert("Please select both dates.");
      return;
    } 
     const newRequest = {
    id: requests.length ? requests[0].id + 1 : 124, // generate ID (latest+1)
    status: "Pending",
    areaCoordinates: drawnLayerRef.current,
    dateBefore,
    dateAfter,
  };

  // Add new request to top of list
  setRequests([newRequest, ...requests]);

  // Add a notification
  setNotifications([
    `New request #${newRequest.id} submitted and awaiting analysis`,
    ...notifications,
  ]);

  // Reset dates and drawn area
  setDateBefore("");
  setDateAfter("");
  drawnLayerRef.current = null;

  alert(`Request #${newRequest.id} submitted successfully!`);



    const requestPayload = {
      areaCoordinates: drawnLayerRef.current,
      dateBefore,
      dateAfter,
    };

    console.log("Submitting request:", requestPayload);
   
  };

  const handleCommentSubmit = () => {
    alert(`Comment submitted for request #${selectedRequest}: ${comments}`);
    setComments("");
  };

  const tileUrls = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    heatmap: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
    
      <div style={{ flex: 2 }}>
        <MapContainer
          center={[37.7749, -122.4194]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer url={tileUrls[overlay]} />

         
          {completedAreas.map((area) => (
            <Polygon
              key={area.id}
              positions={area.coordinates}
              pathOptions={{ color: getColor(area.severity), fillOpacity: 0.6 }}
            >
              <Popup>
                <strong>Severity:</strong> {area.severity}
                <br />
                <strong>Action:</strong> {getAction(area.severity)}
              </Popup>
            </Polygon>
          ))}

         
          <FeatureGroup>
            <EditControl
              position="topright"
              draw={{
                polygon: true,
                rectangle: true,
                circle: false,
                marker: false,
                polyline: false,
                circlemarker: false,
              }}
              edit={{ remove: true }}
              onCreated={(e) => {
                const layer = e.layer;
                const geojson = layer.toGeoJSON();
                drawnLayerRef.current = geojson.geometry.coordinates[0].map(
                  (c) => [c[1], c[0]]
                );
                console.log("Drawn area:", drawnLayerRef.current);
              }}
            />
          </FeatureGroup>

          <ClickCoordinates enabled={clickMode} onClick={setClickedCoords} />
        </MapContainer>
      </div>

   
      <div
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#f7f7f7",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2>Relief Agent Dashboard</h2>

      
        <div style={{ marginBottom: "15px" }}>
          <strong>Map Overlay:</strong>{" "}
          <select
            value={overlay}
            onChange={(e) => setOverlay(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="osm">OpenStreetMap</option>
            <option value="satellite">Satellite</option>
            <option value="heatmap">Damage Heatmap</option>
          </select>
        </div>

      
        <div style={{ marginBottom: "15px" }}>
          <button
            onClick={() => {
              setClickMode(!clickMode);
              setClickedCoords(null);
            }}
          >
            {clickMode ? "Disable" : "Enable"} Click to Get Coordinates
          </button>
          {clickedCoords && (
            <div style={{ marginTop: 8 }}>
              Selected Coordinates: {clickedCoords[0].toFixed(5)},{" "}
              {clickedCoords[1].toFixed(5)}
            </div>
          )}
        </div>

        {/* Date Inputs */}
        <div style={{ marginBottom: "10px" }}>
          <label>Date Before</label>
          <input
            type="date"
            value={dateBefore}
            onChange={(e) => setDateBefore(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Date After</label>
          <input
            type="date"
            value={dateAfter}
            onChange={(e) => setDateAfter(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <button onClick={handleSubmitRequest} style={{ marginBottom: "20px" }}>
          Submit Request
        </button>

      
        <h3>Requests</h3>
        <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
          {requests.map((req) => (
            <li
              key={req.id}
              style={{
                cursor: "pointer",
                padding: "5px 0",
                color: selectedRequest === req.id ? "blue" : "black",
              }}
              onClick={() => setSelectedRequest(req.id)}
            >
              #{req.id} - {req.status}
            </li>
          ))}
        </ul>

        
        {selectedRequest && (
          <>
            <h3>Analysis Results for #{selectedRequest}</h3>
            <div
              style={{
                padding: "10px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                marginBottom: "10px",
                maxHeight: "100px",
                overflowY: "auto",
              }}
            >
              <p>
                Analysis shows varying severity levels within this region.
                Prioritize major and destroyed areas for aid and evacuation.
              </p>
            </div>

            <textarea
              placeholder="Add comment..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              style={{ width: "100%", marginBottom: 10 }}
            />
            <button onClick={handleCommentSubmit}>Submit Comment</button>
          </>
        )}

        
        <h3 style={{ marginTop: "20px" }}>Notifications</h3>
        <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
          {notifications.map((note, idx) => (
            <li key={idx} style={{ fontSize: 12, color: "#555" }}>
              {note}
            </li>
          ))}
        </ul>

       
       
        <div>
          <button
            onClick={() => alert("Download report functionality coming soon!")}
            style={{ marginRight: 10 }}
          >
            Download Report
          </button>
          <button onClick={() => alert("FAQ coming soon!")}>
            Instructions / FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
