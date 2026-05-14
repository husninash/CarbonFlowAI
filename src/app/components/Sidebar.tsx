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

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'traffic', icon: Car, label: 'Traffic Monitoring' },
  { id: 'carbon', icon: Activity, label: 'Carbon Analytics' },
  { id: 'ai', icon: Brain, label: 'AI Prediction' },
  { id: 'pricing', icon: DollarSign, label: 'Congestion Pricing' },
  { id: 'iot', icon: Camera, label: 'IoT Devices' },
  { id: 'reports', icon: FileText, label: 'Reports' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#0a0a0f] border-r border-[#1a1a24] flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00d9ff] flex items-center justify-center">
            <Activity className="w-6 h-6 text-[#0a0a0f]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">CarbonFlow AI</h1>
            <p className="text-xs text-[#00ff88]">Smart City Platform</p>
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
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 m-3 rounded-lg bg-gradient-to-br from-[#00ff88]/10 to-[#00d9ff]/10 border border-[#00ff88]/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-xs text-[#00ff88] font-semibold">System Active</span>
        </div>
        <p className="text-xs text-gray-400">All IoT devices operational</p>
      </div>
    </aside>
  );
}
