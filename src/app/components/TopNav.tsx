import { Bell, User, Wifi } from 'lucide-react';

export function TopNav() {
  return (
    <header className="h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1a1a24] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30">
          <Wifi className="w-4 h-4 text-[#00ff88]" />
          <span className="text-xs text-[#00ff88] font-semibold">Live</span>
        </div>
        <div className="text-xs text-gray-400">
          Last updated: <span className="text-white">2 seconds ago</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#00ff88] rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[#1a1a24]">
          <div className="text-right">
            <div className="text-sm text-white font-medium">Admin User</div>
            <div className="text-xs text-gray-400">System Manager</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00d9ff] flex items-center justify-center">
            <User className="w-5 h-5 text-[#0a0a0f]" />
          </div>
        </div>
      </div>
    </header>
  );
}
