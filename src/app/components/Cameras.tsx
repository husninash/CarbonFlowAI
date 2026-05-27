import { Camera, Wifi, WifiOff, MapPin, Cpu, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CVData {
  status: string;
  totals: {
    Car: number;
    Bus: number;
    Truck: number;
    Motorcycle: number;
    Total: number;
  };
  carbon_emissions_kg: number;
  congestion_index: string;
  active_vehicles_count: number;
  fps: number;
}

const initialDevices = [
  { id: 'ESP32-001 (CV Main)', location: 'Main St & 5th Ave', status: 'online', vehicles: 0, uptime: '99.8%' },
  { id: 'ESP32-002', location: 'Downtown Core', status: 'online', vehicles: 456, uptime: '99.2%' },
  { id: 'ESP32-003', location: 'Highway Junction', status: 'online', vehicles: 678, uptime: '98.9%' },
  { id: 'ESP32-004', location: 'Business District', status: 'offline', vehicles: 0, uptime: '95.4%' },
  { id: 'ESP32-005', location: 'Shopping Area', status: 'online', vehicles: 345, uptime: '99.5%' },
  { id: 'ESP32-006', location: 'Park Avenue', status: 'online', vehicles: 189, uptime: '99.9%' },
];

export function Cameras() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [devices, setDevices] = useState(initialDevices);

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        const res = await fetch('/cv_analytics.json');
        if (res.ok) {
          const data: CVData = await res.json();
          setCvData(data);
          
          setDevices(prev => prev.map(d => {
            if (d.id.includes('ESP32-001')) {
              return {
                ...d,
                vehicles: data.totals.Total || d.vehicles,
                status: data.status === 'active' ? 'online' : d.status
              };
            }
            return d;
          }));
        }
      } catch (err) {
        console.warn("CV Pipeline data not yet active or reachable: ", err);
      }
    };

    fetchCVData();
    const interval = setInterval(fetchCVData, 1000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = devices.filter(d => d.status === 'online').length;

  return (
    <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Camera Network</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">ESP32-CAM status</p>
        </div>
        <div className="flex items-center gap-3">
          {cvData && cvData.status === 'active' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 animate-pulse">
              <Cpu className="w-3.5 h-3.5 text-[#8b5cf6]" />
              <span className="text-xs text-[#8b5cf6] font-semibold">AI CV Active ({cvData.fps} FPS)</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs text-[#00ff88] font-semibold">{onlineCount}/{devices.length} Online</span>
          </div>
        </div>
      </div>

      {cvData && cvData.status === 'active' && (
        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-gradient-to-r dark:from-[#8b5cf6]/10 dark:to-[#00d9ff]/10 border border-slate-200 dark:border-[#8b5cf6]/20 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#8b5cf6]" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">Live AI Computer Vision Metrics</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-gray-400">Live feed processed via OpenCV</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
            <div className="bg-white dark:bg-[#0a0a0f]/60 p-2.5 rounded-lg border border-slate-200 dark:border-[#1a1a24]">
              <span className="text-[10px] text-slate-500 dark:text-gray-400 block">Total Detected</span>
              <span className="text-sm font-extrabold text-[#00ff88]">{cvData.totals.Total}</span>
            </div>
            <div className="bg-white dark:bg-[#0a0a0f]/60 p-2.5 rounded-lg border border-slate-200 dark:border-[#1a1a24]">
              <span className="text-[10px] text-slate-500 dark:text-gray-400 block">Cars / Heavies</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">{cvData.totals.Car} / {cvData.totals.Truck + cvData.totals.Bus}</span>
            </div>
            <div className="bg-white dark:bg-[#0a0a0f]/60 p-2.5 rounded-lg border border-slate-200 dark:border-[#1a1a24]">
              <span className="text-[10px] text-slate-500 dark:text-gray-400 block">Est. CO2 Emitted</span>
              <span className="text-sm font-extrabold text-[#00d9ff]">{cvData.carbon_emissions_kg.toFixed(2)} kg</span>
            </div>
            <div className="bg-white dark:bg-[#0a0a0f]/60 p-2.5 rounded-lg border border-slate-200 dark:border-[#1a1a24]">
              <span className="text-[10px] text-slate-500 dark:text-gray-400 block">Active Congestion</span>
              <span className="text-sm font-extrabold text-red-400">{cvData.congestion_index}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((device) => {
          const isMainCV = device.id.includes('ESP32-001');
          return (
            <div
              key={device.id}
              className={`bg-slate-50 dark:bg-[#0a0a0f] rounded-lg p-4 border transition-all ${
                device.status === 'online'
                  ? isMainCV && cvData?.status === 'active'
                    ? 'border-[#8b5cf6]/40 shadow-md shadow-[#8b5cf6]/5 hover:border-[#8b5cf6]/60'
                    : 'border-[#00ff88]/20 dark:border-[#00ff88]/20 hover:border-[#00ff88]/40 dark:hover:border-[#00ff88]/40'
                  : 'border-red-500/20 hover:border-red-500/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    device.status === 'online'
                      ? isMainCV && cvData?.status === 'active'
                        ? 'bg-[#8b5cf6]/10 border border-[#8b5cf6]/30'
                        : 'bg-[#00ff88]/10 border border-[#00ff88]/30'
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}>
                    <Camera className={`w-5 h-5 ${
                      device.status === 'online' 
                        ? isMainCV && cvData?.status === 'active'
                          ? 'text-[#8b5cf6]'
                          : 'text-[#00ff88]' 
                        : 'text-red-500'
                    }`} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {device.id}
                      {isMainCV && cvData?.status === 'active' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-ping" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {device.location}
                    </div>
                  </div>
                </div>
                {device.status === 'online' ? (
                  <Wifi className={`w-4 h-4 ${isMainCV && cvData?.status === 'active' ? 'text-[#8b5cf6]' : 'text-[#00ff88]'}`} />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-[#0f0f14] border border-slate-200/60 dark:border-none rounded-lg p-2 transition-colors duration-300">
                  <div className="text-xs text-slate-500 dark:text-gray-400">Vehicles</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {isMainCV && cvData?.status === 'active' ? cvData.totals.Total : device.vehicles}
                  </div>
                </div>
                <div className="bg-white dark:bg-[#0f0f14] border border-slate-200/60 dark:border-none rounded-lg p-2 transition-colors duration-300">
                  <div className="text-xs text-slate-500 dark:text-gray-400">Uptime</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{device.uptime}</div>
                </div>
              </div>

              {device.status === 'online' && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-[#1a1a24]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-gray-400">Live Stream</span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full bg-red-500 ${isMainCV && cvData?.status === 'active' ? 'animate-ping' : 'animate-pulse'}`} />
                      <span className="text-red-500 font-semibold">{isMainCV && cvData?.status === 'active' ? 'AI LIVE' : 'REC'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
