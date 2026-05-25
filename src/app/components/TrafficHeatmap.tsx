import { MapPin, AlertTriangle, Cpu, Globe } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const trafficZones = [
  { id: 1, name: 'Sudirman Business District', level: 'high', vehicles: 847, lat: -6.2250, lng: 106.8040 },
  { id: 2, name: 'Thamrin Center', level: 'medium', vehicles: 432, lat: -6.1950, lng: 106.8220 },
  { id: 3, name: 'Menteng Residential', level: 'low', vehicles: 156, lat: -6.1950, lng: 106.8350 },
  { id: 4, name: 'Gatot Subroto Highway', level: 'high', vehicles: 923, lat: -6.2400, lng: 106.8300 },
  { id: 5, name: 'Grand Indonesia Area', level: 'medium', vehicles: 534, lat: -6.1950, lng: 106.8200 },
];

// High-fidelity simulated roads of main avenues in Jakarta
const simulatedRoads = [
  {
    name: "Jalan Jenderal Sudirman",
    level: "high",
    color: "#ef4444",
    path: [
      [-6.2250, 106.8040] as [number, number],
      [-6.2115, 106.8166] as [number, number],
      [-6.1950, 106.8220] as [number, number]
    ]
  },
  {
    name: "Jalan M.H. Thamrin",
    level: "medium",
    color: "#eab308",
    path: [
      [-6.1950, 106.8220] as [number, number],
      [-6.1850, 106.8235] as [number, number],
      [-6.1750, 106.8270] as [number, number]
    ]
  },
  {
    name: "Jalan Gatot Subroto",
    level: "high",
    color: "#ef4444",
    path: [
      [-6.2115, 106.8166] as [number, number],
      [-6.2300, 106.8240] as [number, number],
      [-6.2400, 106.8300] as [number, number]
    ]
  },
  {
    name: "Jalan Rasuna Said",
    level: "medium",
    color: "#eab308",
    path: [
      [-6.2000, 106.8300] as [number, number],
      [-6.2150, 106.8315] as [number, number],
      [-6.2300, 106.8330] as [number, number]
    ]
  }
];

export function TrafficHeatmap() {
  const center: [number, number] = [-6.21, 106.82]; // Jakarta center
  const tomtomKey = import.meta.env.VITE_TOMTOM_API_KEY;
  const hasTomTomKey = tomtomKey && tomtomKey !== 'YOUR_TOMTOM_API_KEY';

  return (
    <div className="bg-[#0f0f14] border border-[#1a1a24] rounded-xl p-6 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Real-Time Traffic Heatmap</h3>
          <p className="text-sm text-gray-400 mt-1">Live congestion monitoring across city zones</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88]" />
              <span className="text-gray-400">Low</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-gray-400">Medium</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-gray-400">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Connection Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 bg-[#0a0a0f] border border-[#1a1a24] p-3 rounded-lg">
        <div className="flex items-center gap-2">
          {hasTomTomKey ? (
            <Globe className="w-4 h-4 text-[#00ff88] animate-pulse" />
          ) : (
            <Cpu className="w-4 h-4 text-[#00d9ff]" />
          )}
          <span className="text-xs font-semibold text-white">
            {hasTomTomKey ? 'Live TomTom Real-Time Traffic Layer Active' : 'High-Fidelity Traffic Simulation'}
          </span>
        </div>
        <span className="text-[10px] text-gray-400">
          {hasTomTomKey ? 'Live API data stream' : 'Add VITE_TOMTOM_API_KEY in .env for live road lines'}
        </span>
      </div>

      <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-[#1a1a24] z-0">
        <MapContainer 
          center={center} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', backgroundColor: '#0a0a0f' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
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
                    opacity: 0.2,
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
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-[#0a0a0f] rounded-lg p-3 border border-[#1a1a24]">
          <div className="text-xs text-gray-400 mb-1">High Congestion</div>
          <div className="text-xl font-bold text-red-400">2 Zones</div>
        </div>
        <div className="bg-[#0a0a0f] rounded-lg p-3 border border-[#1a1a24]">
          <div className="text-xs text-gray-400 mb-1">Medium Traffic</div>
          <div className="text-xl font-bold text-yellow-400">2 Zones</div>
        </div>
        <div className="bg-[#0a0a0f] rounded-lg p-3 border border-[#1a1a24]">
          <div className="text-xs text-gray-400 mb-1">Low Traffic</div>
          <div className="text-xl font-bold text-[#00ff88]">1 Zone</div>
        </div>
      </div>
    </div>
  );
}
