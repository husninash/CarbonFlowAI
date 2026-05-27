import { Bell, User, Wifi, Sun, Moon, Globe } from 'lucide-react';
import { translations, Language } from '../utils/translations';

interface TopNavProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  carbonStandard: 'euro' | 'epa';
  onChangeStandard: (standard: 'euro' | 'epa') => void;
  language?: Language;
}

export function TopNav({ theme, onToggleTheme, carbonStandard, onChangeStandard, language = 'id' }: TopNavProps) {
  const t = translations[language];

  return (
    <header className="h-16 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-slate-200 dark:border-[#1a1a24] flex items-center justify-between px-6 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30">
          <Wifi className="w-4 h-4 text-[#00ff88]" />
          <span className="text-xs text-[#00ff88] font-semibold">{t.live}</span>
        </div>
        <div className="text-xs text-slate-500 dark:text-gray-400">
          {t.lastUpdated}: <span className="text-slate-900 dark:text-white font-medium">2 {t.secondsAgo}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Carbon Standard Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-[#1a1a24] rounded-lg px-3 py-1.5 transition-colors duration-300">
          <Globe className="w-4 h-4 text-[#00ff88]" />
          <select
            value={carbonStandard}
            onChange={(e) => onChangeStandard(e.target.value as 'euro' | 'epa')}
            className="bg-transparent border-none outline-none text-xs font-semibold text-slate-700 dark:text-gray-200 cursor-pointer pr-1 focus:ring-0"
          >
            <option value="euro" className="bg-white dark:bg-[#0a0a0f] text-slate-800 dark:text-white">{t.euroStandard}</option>
            <option value="epa" className="bg-white dark:bg-[#0a0a0f] text-slate-800 dark:text-white">{t.epaStandard}</option>
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-slate-500 dark:text-gray-400"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400 animate-spin-slow" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>

        <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-slate-500 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#00ff88] rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-[#1a1a24]">
          <div className="text-right">
            <div className="text-sm text-slate-900 dark:text-white font-medium">{t.adminUser}</div>
            <div className="text-xs text-slate-500 dark:text-gray-400">{t.systemManager}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00d9ff] flex items-center justify-center">
            <User className="w-5 h-5 text-[#0a0a0f]" />
          </div>
        </div>
      </div>
    </header>
  );
}
