import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { time: '00:00', carbon: 145, vehicles: 234 },
  { time: '03:00', carbon: 89, vehicles: 156 },
  { time: '06:00', carbon: 287, vehicles: 478 },
  { time: '09:00', carbon: 456, vehicles: 823 },
  { time: '12:00', carbon: 398, vehicles: 712 },
  { time: '15:00', carbon: 421, vehicles: 765 },
  { time: '18:00', carbon: 534, vehicles: 967 },
  { time: '21:00', carbon: 312, vehicles: 589 },
  { time: '24:00', carbon: 198, vehicles: 345 },
];

export function CarbonChart() {
  return (
    <div className="bg-[#0f0f14] border border-[#1a1a24] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Carbon Emission Trends</h3>
          <p className="text-sm text-gray-400 mt-1">24-hour emission analysis (kg CO₂)</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-sm font-semibold">
            Today
          </button>
          <button className="px-3 py-1.5 rounded-lg text-gray-400 text-sm hover:bg-white/5">
            Week
          </button>
          <button className="px-3 py-1.5 rounded-lg text-gray-400 text-sm hover:bg-white/5">
            Month
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#1a1a24' }}
          />
          <YAxis
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#1a1a24' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a0f',
              border: '1px solid #1a1a24',
              borderRadius: '8px',
              color: '#fff',
            }}
            cursor={{ stroke: '#00ff88', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          <Line
            type="monotone"
            dataKey="carbon"
            stroke="#00ff88"
            strokeWidth={3}
            dot={{ fill: '#00ff88', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#00ff88', stroke: '#0a0a0f', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Peak Hour</div>
          <div className="text-sm font-bold text-white">18:00</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Peak Emission</div>
          <div className="text-sm font-bold text-red-400">534 kg</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Total Today</div>
          <div className="text-sm font-bold text-[#00ff88]">2,840 kg</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Avg per Hour</div>
          <div className="text-sm font-bold text-[#00d9ff]">118 kg</div>
        </div>
      </div>
    </div>
  );
}
