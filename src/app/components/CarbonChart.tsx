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

interface CarbonChartProps {
  carbonStandard?: 'euro' | 'epa';
}

export function CarbonChart({ carbonStandard = 'euro' }: CarbonChartProps) {
  const isEPA = carbonStandard === 'epa';
  const factor = isEPA ? 1.85 : 1;

  // Dynamically scale the carbon emissions data based on the chosen standard
  const adjustedData = chartData.map(item => ({
    ...item,
    carbon: Math.round(item.carbon * factor)
  }));

  const totalToday = isEPA ? "5,254 kg" : "2,840 kg";
  const peakEmission = Math.round(534 * factor);
  const avgEmission = Math.round(118 * factor);

  return (
    <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Carbon Emission Trends</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            24-hour emission analysis (kg CO₂ under {isEPA ? 'US EPA' : 'Euro 6'} standards)
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-sm font-semibold">
            Today
          </button>
          <button className="px-3 py-1.5 rounded-lg text-slate-500 dark:text-gray-400 text-sm hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            Week
          </button>
          <button className="px-3 py-1.5 rounded-lg text-slate-500 dark:text-gray-400 text-sm hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            Month
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={adjustedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-[#1a1a24]" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0', className: 'dark:stroke-[#1a1a24]' }}
          />
          <YAxis
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0', className: 'dark:stroke-[#1a1a24]' }}
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
          <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">Peak Hour</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">18:00</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">Peak Emission</div>
          <div className="text-sm font-bold text-red-600 dark:text-red-400">{peakEmission} kg</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">Total Today</div>
          <div className="text-sm font-bold text-[#00ff88]">{totalToday}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">Avg per Hour</div>
          <div className="text-sm font-bold text-[#00d9ff]">{avgEmission} kg</div>
        </div>
      </div>
    </div>
  );
}
