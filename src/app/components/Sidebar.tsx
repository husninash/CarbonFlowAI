import {
  LayoutDashboard,
  Car,
  Activity,
  Brain,
  DollarSign,
  Camera,
  FileText,
  Settings
} from 'lucide-react';
import logo from '../../assets/logo.png';
import { translations, Language } from '../utils/translations';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  language?: Language;
}

export function Sidebar({ activeSection, onSectionChange, language = 'id' }: SidebarProps) {
  const t = translations[language];

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'traffic', icon: Car, label: t.trafficMonitoring },
    { id: 'carbon', icon: Activity, label: t.carbonAnalytics },
    { id: 'pricing', icon: DollarSign, label: t.congestionPricing },
    { id: 'cameras', icon: Camera, label: t.cameras },
    { id: 'reports', icon: FileText, label: t.reports },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0a0a0f] border-r border-slate-200 dark:border-[#1a1a24] flex flex-col transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] flex items-center justify-center overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/40 transition-colors duration-300">
            <img src={logo} alt="Emiora Logo" className="w-[110%] h-[110%] max-w-none object-cover transform hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Emiora</h1>
            <p className="text-xs text-[#00ff88] font-semibold tracking-wide uppercase">Smart City</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#00ff88]/10 to-[#00d9ff]/10 text-[#00ff88] border border-[#00ff88]/20'
                  : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 m-3 rounded-lg bg-slate-50 dark:bg-gradient-to-br dark:from-[#00ff88]/10 dark:to-[#00d9ff]/10 border border-slate-200 dark:border-[#00ff88]/20 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-xs text-[#00ff88] font-semibold">{t.systemActive}</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-gray-400">{t.allCamerasOperational}</p>
      </div>
    </aside>
  );
}
