import { Camera, Wifi, WifiOff, MapPin } from 'lucide-react';

const devices = [
  { id: 'ESP32-001', location: 'Main St & 5th Ave', status: 'online', vehicles: 234, uptime: '99.8%' },
  { id: 'ESP32-002', location: 'Downtown Core', status: 'online', vehicles: 456, uptime: '99.2%' },
  { id: 'ESP32-003', location: 'Highway Junction', status: 'online', vehicles: 678, uptime: '98.9%' },
  { id: 'ESP32-004', location: 'Business District', status: 'offline', vehicles: 0, uptime: '95.4%' },
  { id: 'ESP32-005', location: 'Shopping Area', status: 'online', vehicles: 345, uptime: '99.5%' },
  { id: 'ESP32-006', location: 'Park Avenue', status: 'online', vehicles: 189, uptime: '99.9%' },
];

export function Cameras() {
  const onlineCount = devices.filter(d => d.status === 'online').length;

  return (
    <div className="bg-[#0f0f14] border border-[#1a1a24] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Camera Network</h3>
          <p className="text-sm text-gray-400 mt-1">ESP32-CAM status</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-xs text-[#00ff88] font-semibold">{onlineCount}/{devices.length} Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`bg-[#0a0a0f] rounded-lg p-4 border transition-all ${
              device.status === 'online'
                ? 'border-[#00ff88]/20 hover:border-[#00ff88]/40'
                : 'border-red-500/20 hover:border-red-500/40'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  device.status === 'online'
                    ? 'bg-[#00ff88]/10 border border-[#00ff88]/30'
                    : 'bg-red-500/10 border border-red-500/30'
                }`}>
                  <Camera className={`w-5 h-5 ${device.status === 'online' ? 'text-[#00ff88]' : 'text-red-500'}`} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{device.id}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {device.location}
                  </div>
                </div>
              </div>
              {device.status === 'online' ? (
                <Wifi className="w-4 h-4 text-[#00ff88]" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0f0f14] rounded-lg p-2">
                <div className="text-xs text-gray-400">Vehicles</div>
                <div className="text-sm font-bold text-white mt-0.5">{device.vehicles}</div>
              </div>
              <div className="bg-[#0f0f14] rounded-lg p-2">
                <div className="text-xs text-gray-400">Uptime</div>
                <div className="text-sm font-bold text-white mt-0.5">{device.uptime}</div>
              </div>
            </div>

            {device.status === 'online' && (
              <div className="mt-3 pt-3 border-t border-[#1a1a24]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Live Stream</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-500 font-semibold">REC</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
