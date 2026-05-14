import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Cars', value: 3542, color: '#00ff88' },
  { name: 'Motorcycles', value: 1234, color: '#00d9ff' },
  { name: 'Trucks', value: 456, color: '#8b5cf6' },
  { name: 'Buses', value: 234, color: '#f59e0b' },
];

export function VehicleTypeChart() {
  return (
    <div className="bg-[#0f0f14] border border-[#1a1a24] rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-2">Vehicle Distribution</h3>
      <p className="text-sm text-gray-400 mb-6">Detected vehicles by type (today)</p>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a0f',
              border: '1px solid #1a1a24',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between bg-[#0a0a0f] rounded-lg p-3 border border-[#1a1a24]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-400">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-white">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
