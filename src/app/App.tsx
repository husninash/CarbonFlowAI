import { useState } from 'react';
import { Car, Users, Leaf, Camera, Activity, Gauge, FileText, Settings } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { MetricCard } from './components/MetricCard';
import { TrafficHeatmap } from './components/TrafficHeatmap';
import { CarbonChart } from './components/CarbonChart';
import { VehicleTypeChart } from './components/VehicleTypeChart';
import { AIPrediction } from './components/AIPrediction';
import { IoTDevices } from './components/IoTDevices';
import { CongestionPricing } from './components/CongestionPricing';
import { ESGInsights } from './components/ESGInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            {/* Hero Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              <MetricCard
                title="Total Vehicles Today"
                value="5,466"
                change="12.3%"
                trend="up"
                icon={Car}
                accentColor="#00ff88"
              />
              <MetricCard
                title="Congestion Level"
                value="High"
                change="Alert"
                trend="down"
                icon={Gauge}
                accentColor="#ef4444"
              />
              <MetricCard
                title="Carbon Emission"
                value="2,840 kg"
                change="8.7%"
                trend="down"
                icon={Leaf}
                accentColor="#00d9ff"
              />
              <MetricCard
                title="Active Cameras"
                value="5/6"
                change="83%"
                trend="up"
                icon={Camera}
                accentColor="#8b5cf6"
              />
              <MetricCard
                title="Carbon Index"
                value="76.4"
                change="4.2%"
                trend="down"
                icon={Activity}
                accentColor="#f59e0b"
              />
              <MetricCard
                title="AI Accuracy"
                value="94.7%"
                change="2.1%"
                trend="up"
                icon={Users}
                accentColor="#ec4899"
              />
            </div>

            {/* Tabbed Charts */}
            <Tabs defaultValue="traffic" className="w-full">
              <TabsList className="mb-6 bg-[#0f0f14] border border-[#1a1a24] p-1 h-auto rounded-lg">
                <TabsTrigger value="traffic" className="data-[state=active]:bg-[#1a1a24] data-[state=active]:text-white text-gray-400 px-6 py-2.5 rounded-md text-sm font-medium">
                  Traffic Overview
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-[#1a1a24] data-[state=active]:text-white text-gray-400 px-6 py-2.5 rounded-md text-sm font-medium">
                  AI & Analytics
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="traffic" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TrafficHeatmap />
                  <VehicleTypeChart />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AIPrediction />
                  <CarbonChart />
                </div>
              </TabsContent>
            </Tabs>
          </>
        );

      case 'traffic':
        return (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">Traffic Monitoring</h2>
            <div className="mb-6">
              <TrafficHeatmap />
            </div>
            <VehicleTypeChart />
          </>
        );

      case 'carbon':
        return (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">Carbon Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <CarbonChart />
              <VehicleTypeChart />
            </div>
            <ESGInsights />
          </>
        );

      case 'ai':
        return (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">AI Prediction</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIPrediction />
              <TrafficHeatmap />
            </div>
          </>
        );

      case 'pricing':
        return (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">Congestion Pricing</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CongestionPricing />
              <CarbonChart />
            </div>
          </>
        );

      case 'iot':
        return (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">IoT Devices</h2>
            <IoTDevices />
          </>
        );

      case 'reports':
        return (
          <div className="bg-[#0f0f14] border border-[#1a1a24] rounded-xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Reports</h2>
            <p className="text-gray-400">Generate and view system reports</p>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-[#0f0f14] border border-[#1a1a24] rounded-xl p-12 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
            <p className="text-gray-400">Configure system preferences</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="size-full flex bg-[#0a0a0f] dark">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}