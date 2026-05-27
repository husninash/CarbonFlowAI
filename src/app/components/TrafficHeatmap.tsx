import { MapPin, AlertTriangle, Cpu, Globe, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline, useMap, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';

const trafficZones = [
  { id: 1, name: 'Camera 01 (CV Main)', location: 'Jl. MH. Thamrin (Aeon Mall)', level: 'high', vehicles: 847, lat: -6.5714, lng: 106.8812, status: 'online' },
  { id: 2, name: 'Camera 02', location: 'Jl. Sentul Boulevard', level: 'medium', vehicles: 432, lat: -6.5645, lng: 106.8725, status: 'online' },
  { id: 3, name: 'Camera 03', location: 'Jl. Jungleland Boulevard', level: 'high', vehicles: 678, lat: -6.5818, lng: 106.9135, status: 'online' },
  { id: 4, name: 'Camera 04', location: 'Jl. Siliwangi (Golf Club)', level: 'medium', vehicles: 534, lat: -6.5925, lng: 106.8920, status: 'offline' },
  { id: 5, name: 'Camera 05', location: 'Bundaran Sentul', level: 'low', vehicles: 345, lat: -6.5861, lng: 106.8943, status: 'online' },
];

// Custom sleek Camera pin icon for high-end aesthetic
const cameraIcon = (level: string, status: string) => {
  const isOnline = status === 'online';
  const colorClass = !isOnline 
    ? 'bg-slate-400 dark:bg-slate-600 shadow-slate-500/30' 
    : level === 'high' 
      ? 'bg-red-500 shadow-red-500/50' 
      : level === 'medium' 
        ? 'bg-yellow-500 shadow-yellow-500/50' 
        : 'bg-[#00ff88] shadow-[#00ff88]/50';
  
  return L.divIcon({
    html: `<div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0f] text-white shadow-lg ${colorClass} transition-all hover:scale-110">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
      ${isOnline ? `<span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-[#0a0a0f] ${level === 'high' ? 'bg-red-300 animate-ping' : level === 'medium' ? 'bg-yellow-300 animate-pulse' : 'bg-green-300 animate-ping'}"></span>` : ''}
    </div>`,
    className: 'custom-camera-icon-wrapper',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// High-fidelity simulated roads of main avenues in Sentul City
const simulatedRoads = [
  {
    name: "Jl. MH. Thamrin Sentul",
    level: "high",
    color: "#ef4444",
    path: [
      [-6.5714, 106.8812] as [number, number],
      [-6.5645, 106.8725] as [number, number],
      [-6.5540, 106.8622] as [number, number]
    ]
  },
  {
    name: "Jl. Sentul Boulevard",
    level: "medium",
    color: "#eab308",
    path: [
      [-6.5645, 106.8725] as [number, number],
      [-6.5772, 106.8837] as [number, number],
      [-6.5861, 106.8943] as [number, number]
    ]
  },
  {
    name: "Jl. Jungleland Boulevard",
    level: "high",
    color: "#ef4444",
    path: [
      [-6.5772, 106.8837] as [number, number],
      [-6.5818, 106.9135] as [number, number],
      [-6.5850, 106.9200] as [number, number]
    ]
  },
  {
    name: "Jl. Siliwangi",
    level: "medium",
    color: "#eab308",
    path: [
      [-6.5861, 106.8943] as [number, number],
      [-6.5925, 106.8920] as [number, number],
      [-6.6000, 106.8900] as [number, number]
    ]
  }
];

// Component to dynamically pan and zoom the map
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export function TrafficHeatmap({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const defaultCenter: [number, number] = [-6.5772, 106.8837]; // Sentul City center
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(14);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const tomtomKey = import.meta.env.VITE_TOMTOM_API_KEY;
  const hasTomTomKey = tomtomKey && tomtomKey !== 'YOUR_TOMTOM_API_KEY';

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords: [number, number] = [latitude, longitude];
        setUserLocation(newCoords);
        setMapCenter(newCoords);
        setMapZoom(15);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location: ", error);
        setIsLocating(false);
        alert("Unable to retrieve your location. Please check browser permissions.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl p-6 flex flex-col h-full transition-colors duration-300">
      <style>{`
        .custom-camera-icon-wrapper {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-Time Traffic Heatmap</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Live congestion monitoring across city zones</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88]" />
              <span className="text-slate-500 dark:text-gray-400">Low</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-slate-500 dark:text-gray-400">Medium</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-500 dark:text-gray-400">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Connection Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 bg-slate-50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-[#1a1a24] p-3 rounded-lg transition-colors duration-300">
        <div className="flex items-center gap-2">
          {hasTomTomKey ? (
            <Globe className="w-4 h-4 text-[#00ff88] animate-pulse" />
          ) : (
            <Cpu className="w-4 h-4 text-[#00d9ff]" />
          )}
          <span className="text-xs font-semibold text-slate-900 dark:text-white">
            {hasTomTomKey ? 'Live TomTom Real-Time Traffic Layer Active' : 'High-Fidelity Traffic Simulation'}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-gray-400">
          {hasTomTomKey ? 'Live API data stream' : 'Add VITE_TOMTOM_API_KEY in .env for live road lines'}
        </span>
      </div>

      <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-slate-200 dark:border-[#1a1a24] z-0 transition-colors duration-300">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', backgroundColor: theme === 'dark' ? '#0a0a0f' : '#f1f5f9' }}
        >
          {/* Dynamic map styling based on theme */}
          <TileLayer
            url={theme === 'dark' 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {/* Dynamically fly to coordinates */}
          <ChangeView center={mapCenter} zoom={mapZoom} />

          {/* User Geolocation Pulse Markers */}
          {userLocation && (
            <>
              {/* Outer pulsing ring */}
              <CircleMarker
                center={userLocation}
                radius={16}
                pathOptions={{
                  color: '#00d9ff',
                  fillColor: '#00d9ff',
                  fillOpacity: 0.15,
                  weight: 1,
                  className: 'animate-pulse'
                }}
              />
              {/* Core location circle */}
              <CircleMarker
                center={userLocation}
                radius={7}
                pathOptions={{
                  color: '#ffffff',
                  fillColor: '#00d9ff',
                  fillOpacity: 0.9,
                  weight: 2
                }}
              >
                <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent className="font-bold">
                  <div className="px-1 text-[10px] text-slate-900 font-bold">You Are Here</div>
                </Tooltip>
              </CircleMarker>
            </>
          )}
          
          {hasTomTomKey ? (
            <TileLayer
              url={`https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.png?key=${tomtomKey}`}
              attribution='&copy; <a href="https://developer.tomtom.com/">TomTom Traffic</a>'
              opacity={0.7}
            />
          ) : (
            simulatedRoads.map((road, index) => (
              <div key={index}>
                {/* Glow layer behind road for premium sci-fi aesthetic */}
                <Polyline
                  positions={road.path}
                  pathOptions={{
                    color: road.color,
                    weight: 10,
                    opacity: theme === 'dark' ? 0.2 : 0.1,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />
                {/* Main active road indicator line */}
                <Polyline
                  positions={road.path}
                  pathOptions={{
                    color: road.color,
                    weight: 4,
                    opacity: 0.85,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                >
                  <Tooltip direction="top" opacity={0.9} sticky>
                    <div className="p-1">
                      <div className="text-xs font-bold text-gray-900">{road.name}</div>
                      <div className="text-[10px] text-gray-700 mt-0.5">
                        Status: <span className="font-semibold" style={{ color: road.color }}>{road.level.toUpperCase()}</span>
                      </div>
                    </div>
                  </Tooltip>
                </Polyline>
              </div>
            ))
          )}
          
          {trafficZones.map((zone) => {
            const color = !zone.status || zone.status === 'offline' 
              ? '#94a3b8' 
              : zone.level === 'high' 
                ? '#ef4444' 
                : zone.level === 'medium' 
                  ? '#eab308' 
                  : '#00ff88';
            
            return (
              <Marker
                key={zone.id}
                position={[zone.lat, zone.lng]}
                icon={cameraIcon(zone.level, zone.status || 'online')}
              >
                <Tooltip direction="top" offset={[0, -15]} opacity={1} className="custom-leaflet-tooltip font-sans">
                  <div className="p-1">
                    <div className="text-sm font-semibold text-gray-900 mb-1">{zone.name}</div>
                    <div className="text-xs text-gray-700">Location: <span className="font-semibold">{zone.location}</span></div>
                    {zone.status === 'online' ? (
                      <>
                        <div className="text-xs text-gray-700">Vehicles: <span className="font-semibold">{zone.vehicles}</span></div>
                        <div className="text-xs text-gray-700">Traffic: <span className="font-semibold" style={{ color }}>{zone.level.toUpperCase()}</span></div>
                      </>
                    ) : (
                      <div className="text-xs text-red-500 font-bold mt-1">DEVICE OFFLINE</div>
                    )}
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Locate Me Floating Button overlay */}
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          className="absolute bottom-4 right-4 z-[400] p-3 bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-[#1a1a24] hover:bg-slate-100 dark:hover:bg-white/5 rounded-full shadow-lg text-slate-700 dark:text-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:scale-100"
          title="Locate My Position"
        >
          <Crosshair className={`w-5 h-5 text-[#00d9ff] ${isLocating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-50 dark:bg-[#0a0a0f] rounded-lg p-3 border border-slate-200 dark:border-[#1a1a24] transition-colors duration-300">
          <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">High Congestion</div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">2 Zones</div>
        </div>
        <div className="bg-slate-50 dark:bg-[#0a0a0f] rounded-lg p-3 border border-slate-200 dark:border-[#1a1a24] transition-colors duration-300">
          <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">Medium Traffic</div>
          <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">2 Zones</div>
        </div>
        <div className="bg-slate-50 dark:bg-[#0a0a0f] rounded-lg p-3 border border-slate-200 dark:border-[#1a1a24] transition-colors duration-300">
          <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">Low Traffic</div>
          <div className="text-xl font-bold text-[#00ff88]">1 Zone</div>
        </div>
      </div>
    </div>
  );
}
