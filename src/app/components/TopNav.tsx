import { Bell, User, Wifi, Sun, Moon } from 'lucide-react';

interface TopNavProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function TopNav({ theme, onToggleTheme }: TopNavProps) {
  return (
    <header className="h-16 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-slate-200 dark:border-[#1a1a24] flex items-center justify-between px-6 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30">
          <Wifi className="w-4 h-4 text-[#00ff88]" />
          <span className="text-xs text-[#00ff88] font-semibold">Live</span>
        </div>
        <div className="text-xs text-slate-500 dark:text-gray-400">
          Last updated: <span className="text-slate-900 dark:text-white font-medium">2 seconds ago</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
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
            <div className="text-sm text-slate-900 dark:text-white font-medium">Admin User</div>
            <div className="text-xs text-slate-500 dark:text-gray-400">System Manager</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00d9ff] flex items-center justify-center">
            <User className="w-5 h-5 text-[#0a0a0f]" />
          </div>
        </div>
      </div>
    </header>
  );
}
