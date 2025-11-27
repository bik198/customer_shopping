'use client';
import { useMemo, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip as MapTooltip
} from "react-leaflet";
import 'leaflet/dist/leaflet.css';

const INITIAL_CENTER = [43.8283, -98.5795];
const INITIAL_ZOOM = 3;

export default function CustomerLocationMap({ rawData = [], filters, stateCoordinates }) {
  const locationData = useMemo(() => {
    const filtered = (rawData || []).filter(row => {
      let age = Number(row.Age),
        gender = row.Gender || "Unknown",
        location = row.Location || "Unknown";
      return (
        (filters.region === "All" || location === filters.region) &&
        (filters.gender === "All" || gender === filters.gender) &&
        !isNaN(age) && age >= filters.age[0] && age <= filters.age[1]
      );
    });
    const locationCounts = {};
    filtered.forEach(d => {
      const location = d.Location?.trim();
      if (location && stateCoordinates[location]) {
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      }
    });
    return Object.entries(locationCounts).map(([location, count]) => ({
      location,
      count,
      coords: stateCoordinates[location]
    }));
  }, [rawData, filters, stateCoordinates]);

  const mapRef = useRef();

  // optional auto-zoom tweak
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        const currZoom = mapRef.current.getZoom();
        mapRef.current.setZoom(currZoom - 1);
      }, 200);
    }
  }, []);

  const maxCount = Math.max(...locationData.map(d => d.count), 1);

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setView(INITIAL_CENTER, INITIAL_ZOOM);
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-xl mb-4">Customer Location Distribution</h3>

      <div className="relative" style={{ height: "360px" }}>
        {/* recenter button */}
        <button
          onClick={handleRecenter}
          className="absolute z-[1000] right-3 top-3 bg-white/90 text-sm px-3 py-1 rounded shadow cursor-pointer hover:bg-blue-50"
        >
          Recenter
        </button>

        <MapContainer
          ref={mapRef}
          center={INITIAL_CENTER}
          zoom={INITIAL_ZOOM}
          style={{ height: "100%", width: "100%", borderRadius: "8px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {locationData.map((data, idx) => {
            const radius = 5 + (data.count / maxCount) * 20;
            return (
              <CircleMarker
                key={idx}
                center={data.coords}
                radius={radius}
                fillColor="#6366f1"
                color="#fff"
                weight={2}
                opacity={0.8}
                fillOpacity={0.6}
              >
                <Popup>
                  <div>
                    <strong>{data.location}</strong><br />
                    Customers: {data.count}
                  </div>
                </Popup>
                <MapTooltip>{data.location}: {data.count}</MapTooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
