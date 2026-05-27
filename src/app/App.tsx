import { useState } from 'react';
import { Car, Users, Leaf, Camera, Activity, Gauge, FileText, Settings } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { MetricCard } from './components/MetricCard';
import { TrafficHeatmap } from './components/TrafficHeatmap';
import { CarbonChart } from './components/CarbonChart';
import { VehicleTypeChart } from './components/VehicleTypeChart';
import { AIPrediction } from './components/AIPrediction';
import { Cameras } from './components/Cameras';
import { CongestionPricing } from './components/CongestionPricing';
import { Reports } from './components/Reports';
import { ESGInsights } from './components/ESGInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { translations, Language, Currency } from './utils/translations';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [carbonStandard, setCarbonStandard] = useState<'euro' | 'epa'>('euro');
  const [language, setLanguage] = useState<Language>('id'); // Defaults to Indonesian as requested
  const [currency, setCurrency] = useState<Currency>('IDR'); // Defaults to Rupiah as requested

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderContent = () => {
    const t = translations[language];

    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            {/* Hero Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              <MetricCard
                title={t.totalVehiclesToday}
                value="5,466"
                change="12.3%"
                trend="up"
                icon={Car}
                accentColor="#00ff88"
              />
              <MetricCard
                title={t.congestionLevel}
                value={t.high}
                change={t.alert}
                trend="down"
                icon={Gauge}
                accentColor="#ef4444"
              />
              <MetricCard
                title={t.carbonEmission}
                value={carbonStandard === 'euro' ? "2,840 kg" : "5,254 kg"}
                change={carbonStandard === 'euro' ? "8.7%" : "12.4%"}
                trend="down"
                icon={Leaf}
                accentColor="#00d9ff"
              />
              <MetricCard
                title={t.activeCameras}
                value="5/6"
                change="83%"
                trend="up"
                icon={Camera}
                accentColor="#8b5cf6"
              />
              <MetricCard
                title={t.carbonIndex}
                value={carbonStandard === 'euro' ? "76.4" : "141.3"}
                change="4.2%"
                trend="down"
                icon={Activity}
                accentColor="#f59e0b"
              />
              <MetricCard
                title={t.aiAccuracy}
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
                  {t.trafficOverview}
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-[#1a1a24] data-[state=active]:text-white text-gray-400 px-6 py-2.5 rounded-md text-sm font-medium">
                  {t.aiAnalytics}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="traffic" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TrafficHeatmap theme={theme} />
                  <VehicleTypeChart />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AIPrediction />
                  <CarbonChart carbonStandard={carbonStandard} />
                </div>
              </TabsContent>
            </Tabs>
          </>
        );

      case 'traffic':
        return (
          <>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.trafficMonitoring}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <TrafficHeatmap theme={theme} />
              </div>
              <div className="h-full">
                <AIPrediction />
              </div>
            </div>
            <VehicleTypeChart />
          </>
        );

      case 'carbon':
        return (
          <>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.carbonAnalytics}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <CarbonChart carbonStandard={carbonStandard} />
              <VehicleTypeChart />
            </div>
            <ESGInsights />
          </>
        );

      case 'pricing':
        return (
          <>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.congestionPricing}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CongestionPricing language={language} currency={currency} />
              <CarbonChart carbonStandard={carbonStandard} />
            </div>
          </>
        );

      case 'cameras':
        return (
          <>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.cameras}</h2>
            <Cameras />
          </>
        );

      case 'reports':
        return (
          <Reports language={language} currency={currency} />
        );

      case 'settings':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center">
                <Settings className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.settings}</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{t.configureSystem}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-[#1a1a24] pb-3">
                {t.generalSettings}
              </h3>
              
              <div className="space-y-6">
                {/* Language Select */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-[#1a1a24] hover:border-[#00ff88]/30 dark:hover:border-[#00ff88]/30 transition-all duration-300">
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">{t.selectLanguage}</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 mt-1 block">Choose display language for the Emiora AI dashboard.</span>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => {
                      const newLang = e.target.value as Language;
                      setLanguage(newLang);
                      if (newLang === 'id') {
                        setCurrency('IDR');
                      } else {
                        setCurrency('USD');
                      }
                    }}
                    className="w-full sm:w-64 bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]/40 cursor-pointer"
                  >
                    <option value="id">{t.languageIndonesian}</option>
                    <option value="en">{t.languageEnglish}</option>
                  </select>
                </div>

                {/* Currency Select */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-[#1a1a24] hover:border-[#00ff88]/30 dark:hover:border-[#00ff88]/30 transition-all duration-300">
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">{t.pricingCurrency}</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 mt-1 block">Choose the active currency for Dynamic Congestion Pricing.</span>
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full sm:w-64 bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]/40 cursor-pointer"
                  >
                    <option value="IDR">{t.rupiah}</option>
                    <option value="USD">{t.usd}</option>
                  </select>
                </div>

                {/* Carbon Standards Select */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-[#1a1a24] hover:border-[#00ff88]/30 dark:hover:border-[#00ff88]/30 transition-all duration-300">
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">{t.carbonStandardLabel}</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 mt-1 block">Standard calculations for emission coefficients.</span>
                  </div>
                  <select
                    value={carbonStandard}
                    onChange={(e) => setCarbonStandard(e.target.value as 'euro' | 'epa')}
                    className="w-full sm:w-64 bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]/40 cursor-pointer"
                  >
                    <option value="euro">{t.euroStandard}</option>
                    <option value="epa">{t.epaStandard}</option>
                  </select>
                </div>

                {/* Theme Select */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-[#1a1a24] hover:border-[#00ff88]/30 dark:hover:border-[#00ff88]/30 transition-all duration-300">
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">{t.themeMode}</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 mt-1 block">Switch between light and dark display modes.</span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="w-full sm:w-64 bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 transition-all rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white flex items-center justify-center gap-2 cursor-pointer border-dashed"
                  >
                    {theme === 'dark' ? t.darkMode : t.lightMode}
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-[#1a1a24] flex items-center justify-between">
                <span className="text-xs text-[#00ff88] font-semibold">{t.saveSettings}</span>
                <span className="text-xs text-slate-400 dark:text-gray-500">v1.1.0</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`size-full flex transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0f] dark text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} language={language} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          theme={theme}
          onToggleTheme={toggleTheme}
          carbonStandard={carbonStandard}
          onChangeStandard={setCarbonStandard}
          language={language}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}