'use client';
import { useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip as MapTooltip } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

// US State center coordinates (trim or expand as needed)

export default function CustomerLocationMap({ rawData = [], filters, stateCoordinates }) {
  // Filter + aggregate map data
  const locationData = useMemo(() => {
    const filtered = (rawData || []).filter(row => {
      let age = Number(row.Age), gender = row.Gender || "Unknown", location = row.Location || "Unknown";
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
  }, [rawData, filters]);

  // Auto-zoom adjustment
  const mapRef = useRef();
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        const currZoom = mapRef.current.getZoom();
        mapRef.current.setZoom(currZoom - 1);
      }, 200); // Short delay after render
    }
  }, []);

  const maxCount = Math.max(...locationData.map(d => d.count), 1);

  return (
    <div>
      <h3 className="font-semibold text-xl mb-4">Customer Location Distribution</h3>
      <MapContainer
        ref={mapRef}
        center={[43.8283, -98.5795]}
        zoom={3}
        style={{ height: "360px", width: "100%", borderRadius: "8px" }}
        whenCreated={instance => { mapRef.current = instance; }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
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
  );
}
