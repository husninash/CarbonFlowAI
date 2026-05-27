import { MapPin, AlertTriangle, Cpu, Globe, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

const trafficZones = [
  { id: 1, name: 'Jl. MH. Thamrin (Aeon Mall)', level: 'high', vehicles: 847, lat: -6.5714, lng: 106.8812 },
  { id: 2, name: 'Jl. Sentul Boulevard', level: 'medium', vehicles: 432, lat: -6.5645, lng: 106.8725 },
  { id: 3, name: 'Taman Budaya Sentul City', level: 'low', vehicles: 156, lat: -6.5861, lng: 106.8943 },
  { id: 4, name: 'Jl. Jungleland Boulevard', level: 'high', vehicles: 923, lat: -6.5818, lng: 106.9135 },
  { id: 5, name: 'Jl. Siliwangi (Golf Club)', level: 'medium', vehicles: 534, lat: -6.5925, lng: 106.8920 },
];

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
            const color = zone.level === 'high' ? '#ef4444' : zone.level === 'medium' ? '#eab308' : '#00ff88';
            const radius = zone.level === 'high' ? 20 : zone.level === 'medium' ? 15 : 10;
            
            return (
              <CircleMarker
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={radius}
                pathOptions={{ 
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.6,
                  weight: 2
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-leaflet-tooltip">
                  <div className="p-1">
                    <div className="text-sm font-semibold text-gray-900 mb-1">{zone.name}</div>
                    <div className="text-xs text-gray-700">Vehicles: <span className="font-semibold">{zone.vehicles}</span></div>
                    <div className="text-xs text-gray-700">Status: <span className="font-semibold" style={{ color }}>{zone.level.toUpperCase()}</span></div>
                  </div>
                </Tooltip>
              </CircleMarker>
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
