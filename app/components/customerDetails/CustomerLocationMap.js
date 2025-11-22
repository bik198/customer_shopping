'use client';
import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip as MapTooltip } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

// State coordinates (center points)
const stateCoordinates = {
  "Alabama": [32.806671, -86.791130],
  "Alaska": [61.370716, -152.404419],
  "Arizona": [33.729759, -111.431221],
  "Arkansas": [34.969704, -92.373123],
  "California": [36.116203, -119.681564],
  "Colorado": [39.059811, -105.311104],
  "Connecticut": [41.597782, -72.755371],
  "Delaware": [39.318523, -75.507141],
  "Florida": [27.766279, -81.686783],
  "Georgia": [33.040619, -83.643074],
  "Hawaii": [21.094318, -157.498337],
  "Idaho": [44.240459, -114.478828],
  "Illinois": [40.349457, -88.986137],
  "Indiana": [39.849426, -86.258278],
  "Iowa": [42.011539, -93.210526],
  "Kansas": [38.526600, -96.726486],
  "Kentucky": [37.668140, -84.670067],
  "Louisiana": [31.169546, -91.867805],
  "Maine": [44.693947, -69.381927],
  "Maryland": [39.063946, -76.802101],
  "Massachusetts": [42.230171, -71.530106],
  "Michigan": [43.326618, -84.536095],
  "Minnesota": [45.694454, -93.900192],
  "Mississippi": [32.741646, -89.678696],
  "Missouri": [38.456085, -92.288368],
  "Montana": [46.921925, -110.454353],
  "Nebraska": [41.125370, -98.268082],
  "Nevada": [38.313515, -117.055374],
  "New Hampshire": [43.452492, -71.563896],
  "New Jersey": [40.298904, -74.521011],
  "New Mexico": [34.840515, -106.248482],
  "New York": [42.165726, -74.948051],
  "North Carolina": [35.630066, -79.806419],
  "North Dakota": [47.528912, -99.784012],
  "Ohio": [40.388783, -82.764915],
  "Oklahoma": [35.565342, -96.928917],
  "Oregon": [44.572021, -122.070938],
  "Pennsylvania": [40.590752, -77.209755],
  "Rhode Island": [41.680893, -71.511780],
  "South Carolina": [33.856892, -80.945007],
  "South Dakota": [44.299782, -99.438828],
  "Tennessee": [35.747845, -86.692345],
  "Texas": [31.054487, -97.563461],
  "Utah": [40.150032, -111.862434],
  "Vermont": [44.045876, -72.710686],
  "Virginia": [37.769337, -78.169968],
  "Washington": [47.400902, -121.490494],
  "West Virginia": [38.491226, -80.954453],
  "Wisconsin": [44.268543, -89.616508],
  "Wyoming": [42.755966, -107.302490]
};

export default function CustomerLocationMap({ rawData, filters }) {
  const locationData = useMemo(() => {
    const filtered = rawData.filter(row => {
      let age = Number(row.Age);
      let gender = row.Gender || "Unknown";
      let location = row.Location || "Unknown";
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

  const maxCount = Math.max(...locationData.map(d => d.count), 1);

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="font-semibold text-xl mb-4">Customer Location Distribution</h3>
      <MapContainer 
        center={[39.8283, -98.5795]} 
        zoom={4} 
        style={{ height: "450px", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locationData.map((data, idx) => {
          const radius = 5 + (data.count / maxCount) * 20; // Scale by count
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
