import { MapPin, AlertTriangle } from 'lucide-react';

const trafficZones = [
  { id: 1, name: 'Downtown Core', level: 'high', vehicles: 847, x: '30%', y: '40%' },
  { id: 2, name: 'Business District', level: 'medium', vehicles: 432, x: '60%', y: '35%' },
  { id: 3, name: 'Residential Zone A', level: 'low', vehicles: 156, x: '25%', y: '65%' },
  { id: 4, name: 'Highway Junction', level: 'high', vehicles: 923, x: '70%', y: '60%' },
  { id: 5, name: 'Shopping Area', level: 'medium', vehicles: 534, x: '45%', y: '70%' },
];

export function TrafficHeatmap() {
  return (
    <div className="bg-[#0f0f14] border border-[#1a1a24] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Real-Time Traffic Heatmap</h3>
          <p className="text-sm text-gray-400 mt-1">Live congestion monitoring across city zones</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
            <span className="text-gray-400">Low</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-gray-400">Medium</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-400">High</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-96 bg-[#0a0a0f] rounded-lg border border-[#1a1a24] overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00ff88" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Traffic Zones */}
        {trafficZones.map((zone) => {
          const color = zone.level === 'high' ? '#ef4444' : zone.level === 'medium' ? '#eab308' : '#00ff88';
          return (
            <div
              key={zone.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: zone.x, top: zone.y }}
            >
              <div className="relative">
                {/* Pulse Effect */}
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-75"
                  style={{ backgroundColor: color }}
                />
                {/* Pin */}
                <div
                  className="relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 20px ${color}80`
                  }}
                >
                  {zone.level === 'high' ? (
                    <AlertTriangle className="w-4 h-4 text-white" />
                  ) : (
                    <MapPin className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-[#0a0a0f] border border-[#1a1a24] rounded-lg p-3 whitespace-nowrap shadow-xl">
                    <div className="text-sm font-semibold text-white mb-1">{zone.name}</div>
                    <div className="text-xs text-gray-400">Vehicles: <span className="text-white font-semibold">{zone.vehicles}</span></div>
                    <div className="text-xs text-gray-400">Status: <span className="font-semibold" style={{ color }}>{zone.level}</span></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
