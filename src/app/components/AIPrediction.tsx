import { Brain, TrendingUp, Clock, MapPin } from 'lucide-react';

const predictions = [
  { time: '14:00-15:00', zone: 'Jl. MH. Thamrin (Aeon Mall)', level: 'High', probability: 87, color: '#ef4444' },
  { time: '15:00-16:00', zone: 'Jl. Jungleland Boulevard', level: 'Medium', probability: 64, color: '#eab308' },
  { time: '16:00-17:00', zone: 'Jl. Sentul Boulevard', level: 'High', probability: 92, color: '#ef4444' },
];

const routes = [
  { route: 'Rute A via Jl. Siliwangi', savings: '12 min', carbon: '-23%', status: 'recommended' },
  { route: 'Rute B via Tol Jagorawi (Sentul)', savings: '8 min', carbon: '-15%', status: 'alternative' },
  { route: 'Rute C via Jl. Sentul Boulevard', savings: '5 min', carbon: '-8%', status: 'alternative' },
];

export function AIPrediction() {
  return (
    <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#8b5cf6]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Traffic Prediction</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400">Next 3 hours forecast</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {predictions.map((pred, index) => (
          <div key={index} className="bg-slate-50 dark:bg-[#0a0a0f] rounded-lg p-4 border border-slate-200 dark:border-[#1a1a24] transition-colors duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{pred.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-gray-400">Confidence:</span>
                <span className="text-xs font-bold text-[#00ff88]">{pred.probability}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                <span className="text-sm text-slate-500 dark:text-gray-400">{pred.zone}</span>
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-semibold" style={{
                backgroundColor: `${pred.color}20`,
                color: pred.color
              }}>
                {pred.level} Congestion
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-3 h-1.5 bg-slate-200 dark:bg-[#1a1a24] rounded-full overflow-hidden transition-colors duration-300">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pred.probability}%`,
                  backgroundColor: pred.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 dark:border-[#1a1a24] pt-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#00ff88]" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Recommended Routes</h4>
        </div>
        <div className="space-y-2">
          {routes.map((route, index) => (
            <div
              key={index}
              className={`rounded-lg p-3 border transition-all ${
                route.status === 'recommended'
                  ? 'border-[#00ff88]/30 bg-[#00ff88]/5 dark:bg-[#00ff88]/5'
                  : 'bg-slate-50 dark:bg-[#0a0a0f] border-slate-200 dark:border-[#1a1a24]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-900 dark:text-white">{route.route}</span>
                {route.status === 'recommended' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#00ff88]/20 text-[#00ff88] text-xs font-semibold">
                    Best
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 dark:text-gray-400">
                <span>Save: <span className="text-[#00ff88] font-semibold">{route.savings}</span></span>
                <span>Carbon: <span className="text-[#00ff88] font-semibold">{route.carbon}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
