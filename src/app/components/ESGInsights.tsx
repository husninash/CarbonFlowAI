import { Leaf, TrendingUp, Award, Target } from 'lucide-react';

const insights = [
  {
    icon: Leaf,
    title: 'Sustainability Score',
    value: '87/100',
    change: '+5 pts',
    color: '#00ff88',
    description: 'Excellent environmental performance'
  },
  {
    icon: Target,
    title: 'Carbon Reduction',
    value: '23.4%',
    change: '+3.2%',
    color: '#00d9ff',
    description: 'vs last month target'
  },
  {
    icon: TrendingUp,
    title: 'Green Transport',
    value: '1,234',
    change: '+12%',
    color: '#8b5cf6',
    description: 'EV & hybrid vehicles today'
  },
  {
    icon: Award,
    title: 'ESG Rating',
    value: 'A+',
    change: 'Improved',
    color: '#f59e0b',
    description: 'Government certification'
  },
];

export function ESGInsights() {
  return (
    <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">ESG & Sustainability Insights</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Environmental impact analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className="bg-slate-50 dark:bg-[#0a0a0f] rounded-lg p-4 border border-slate-200 dark:border-[#1a1a24] hover:border-[#00ff88]/30 dark:hover:border-[#00ff88]/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${insight.color}20`,
                    border: `1px solid ${insight.color}30`
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: insight.color }} />
                </div>
                <div className="px-2 py-1 rounded-full bg-[#00ff88]/10 text-[#00ff88] text-xs font-semibold">
                  {insight.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{insight.value}</div>
              <div className="text-sm font-medium text-slate-800 dark:text-gray-300 mb-1">{insight.title}</div>
              <div className="text-xs text-slate-500 dark:text-gray-400">{insight.description}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#1a1a24]">
        <div className="bg-slate-50 dark:bg-gradient-to-r dark:from-[#00ff88]/10 dark:to-[#00d9ff]/10 border border-slate-200 dark:border-[#00ff88]/20 rounded-lg p-4 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-5 h-5 text-[#00ff88]" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Carbon Offset Potential</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-gray-400 mb-3">
            AI suggests planting <span className="text-[#00ff88] font-semibold">1,247 trees</span> to offset this month's emissions
          </div>
          <div className="h-2 bg-slate-200 dark:bg-[#1a1a24] rounded-full overflow-hidden transition-colors duration-300">
            <div className="h-full w-3/4 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
