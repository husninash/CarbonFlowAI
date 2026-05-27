import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  accentColor?: string;
}

export function MetricCard({ title, value, change, trend, icon: Icon, accentColor = '#00ff88' }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl p-6 shadow-sm dark:shadow-none hover:border-[#00ff88]/30 dark:hover:border-[#00ff88]/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
            border: `1px solid ${accentColor}30`
          }}
        >
          <Icon className="w-6 h-6" style={{ color: accentColor }} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            trend === 'up' ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-red-500/10 text-red-400'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
        <div className="text-sm text-slate-500 dark:text-gray-400">{title}</div>
      </div>
    </div>
  );
}
