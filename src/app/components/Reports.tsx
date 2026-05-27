import { useState, useEffect } from 'react';
import { 
  FileText, Calendar, Filter, Camera, Download, Search, 
  ArrowUpDown, CheckCircle2, Loader2, BarChart2, TrendingUp, ShieldAlert
} from 'lucide-react';
import { translations, Language, Currency } from '../utils/translations';

interface ReportsProps {
  language: Language;
  currency: Currency;
}

interface ReportRecord {
  id: number;
  timestamp: string;
  location: string;
  camera: string;
  vehicles: number;
  carbonEmitted: number;
  carbonSaved: number;
  revenueUSD: number;
  revenueIDR: number;
  congestionLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

// Highly realistic mock logs for Sentul City
const baseRecords: ReportRecord[] = [
  { id: 1, timestamp: '2026-05-27 08:30:00', location: 'Jl. MH. Thamrin (Aeon Mall)', camera: 'Camera 01', vehicles: 412, carbonEmitted: 112.4, carbonSaved: 48.6, revenueUSD: 824.00, revenueIDR: 12360000, congestionLevel: 'HIGH' },
  { id: 2, timestamp: '2026-05-27 08:45:00', location: 'Jl. Sentul Boulevard', camera: 'Camera 02', vehicles: 290, carbonEmitted: 74.2, carbonSaved: 36.8, revenueUSD: 580.00, revenueIDR: 8700000, congestionLevel: 'MEDIUM' },
  { id: 3, timestamp: '2026-05-27 09:15:00', location: 'Jl. Jungleland Boulevard', camera: 'Camera 03', vehicles: 456, carbonEmitted: 132.8, carbonSaved: 54.2, revenueUSD: 1140.00, revenueIDR: 17100000, congestionLevel: 'HIGH' },
  { id: 4, timestamp: '2026-05-27 10:00:00', location: 'Jl. Siliwangi (Golf Club)', camera: 'Camera 04', vehicles: 120, carbonEmitted: 28.5, carbonSaved: 14.5, revenueUSD: 240.00, revenueIDR: 3600000, congestionLevel: 'LOW' },
  { id: 5, timestamp: '2026-05-27 11:30:00', location: 'Bundaran Sentul', camera: 'Camera 05', vehicles: 198, carbonEmitted: 45.9, carbonSaved: 22.1, revenueUSD: 396.00, revenueIDR: 5940000, congestionLevel: 'LOW' },
  { id: 6, timestamp: '2026-05-26 14:20:00', location: 'Jl. MH. Thamrin (Aeon Mall)', camera: 'Camera 01', vehicles: 380, carbonEmitted: 98.6, carbonSaved: 41.4, revenueUSD: 760.00, revenueIDR: 11400000, congestionLevel: 'MEDIUM' },
  { id: 7, timestamp: '2026-05-26 17:45:00', location: 'Jl. Sentul Boulevard', camera: 'Camera 02', vehicles: 430, carbonEmitted: 121.2, carbonSaved: 51.8, revenueUSD: 860.00, revenueIDR: 12900000, congestionLevel: 'HIGH' },
  { id: 8, timestamp: '2026-05-25 08:15:00', location: 'Jl. Jungleland Boulevard', camera: 'Camera 03', vehicles: 480, carbonEmitted: 140.5, carbonSaved: 58.5, revenueUSD: 1200.00, revenueIDR: 18000000, congestionLevel: 'HIGH' },
  { id: 9, timestamp: '2026-05-24 11:00:00', location: 'Jl. Siliwangi (Golf Club)', camera: 'Camera 04', vehicles: 154, carbonEmitted: 34.8, carbonSaved: 18.2, revenueUSD: 308.00, revenueIDR: 4620000, congestionLevel: 'LOW' },
  { id: 10, timestamp: '2026-05-23 16:30:00', location: 'Bundaran Sentul', camera: 'Camera 05', vehicles: 245, carbonEmitted: 58.2, carbonSaved: 28.8, revenueUSD: 490.00, revenueIDR: 7350000, congestionLevel: 'MEDIUM' },
  { id: 11, timestamp: '2026-05-20 09:00:00', location: 'Jl. MH. Thamrin & Jl. Sentul Raya', camera: 'Camera 06', vehicles: 310, carbonEmitted: 81.4, carbonSaved: 38.6, revenueUSD: 620.00, revenueIDR: 9300000, congestionLevel: 'MEDIUM' },
  { id: 12, timestamp: '2026-05-15 15:45:00', location: 'Jl. MH. Thamrin & Jl. Sentul Raya', camera: 'Camera 06', vehicles: 275, carbonEmitted: 71.9, carbonSaved: 34.1, revenueUSD: 550.00, revenueIDR: 8250000, congestionLevel: 'MEDIUM' },
];

export function Reports({ language, currency }: ReportsProps) {
  const t = translations[language];
  const isIDR = currency === 'IDR';

  // Filters state
  const [reportType, setReportType] = useState<'traffic' | 'carbon' | 'revenue'>('traffic');
  const [dateRange, setDateRange] = useState<'24h' | '7days' | '30days'>('7days');
  const [cameraFilter, setCameraFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Generated preview data state
  const [generatedData, setGeneratedData] = useState<ReportRecord[]>(baseRecords);

  // Sorting state
  const [sortField, setSortField] = useState<keyof ReportRecord>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Export progress states
  const [exportMode, setExportMode] = useState<'PDF' | 'CSV' | null>(null);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStep, setExportStep] = useState<number>(0);

  // Auto-regenerate report preview data when filters change
  useEffect(() => {
    let filtered = [...baseRecords];

    // Filter by Camera
    if (cameraFilter !== 'all') {
      filtered = filtered.filter(item => item.camera === cameraFilter);
    }

    // Filter by Date Range (Simulated timestamps)
    const now = new Date('2026-05-27T12:00:00'); // Consistent baseline
    filtered = filtered.filter(item => {
      const recordDate = new Date(item.timestamp.replace(' ', 'T'));
      const diffTime = Math.abs(now.getTime() - recordDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (dateRange === '24h') return diffDays <= 1;
      if (dateRange === '7days') return diffDays <= 7;
      if (dateRange === '30days') return diffDays <= 30;
      return true;
    });

    // Filter by Search Query (Location)
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' 
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      } else {
        return sortOrder === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
    });

    setGeneratedData(filtered);
  }, [reportType, dateRange, cameraFilter, searchQuery, sortField, sortOrder]);

  const handleSort = (field: keyof ReportRecord) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Simulated export engine triggering real browser download on 100%
  const handleExport = (mode: 'PDF' | 'CSV') => {
    setExportMode(mode);
    setExportProgress(0);
    setExportStep(0);
  };

  useEffect(() => {
    if (exportMode === null) return;

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Trigger actual download of dynamic CSV / Text summary
            triggerActualDownload();
            setExportMode(null);
            setExportProgress(0);
          }, 800);
          return 100;
        }

        const nextProgress = prev + Math.floor(Math.random() * 15) + 5;
        const boundedProgress = Math.min(nextProgress, 100);

        // Update step descriptions dynamically
        if (boundedProgress < 30) setExportStep(0); // Compiling data...
        else if (boundedProgress < 70) setExportStep(1); // Processing charts...
        else if (boundedProgress < 100) setExportStep(2); // Generating file...
        else setExportStep(3); // Download ready!

        return boundedProgress;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [exportMode]);

  const triggerActualDownload = () => {
    let headers = "Timestamp,Location,Camera Node,Vehicles,Carbon Emitted (kg),Carbon Saved (kg),Revenue";
    if (reportType === 'carbon') {
      headers = "Timestamp,Location,Camera Node,Vehicles,Carbon Emitted (kg),Carbon Saved (kg)";
    } else if (reportType === 'traffic') {
      headers = "Timestamp,Location,Camera Node,Vehicles,Congestion Level";
    }

    const rows = generatedData.map(item => {
      const revStr = isIDR ? `Rp ${item.revenueIDR.toLocaleString()}` : `$${item.revenueUSD.toFixed(2)}`;
      if (reportType === 'carbon') {
        return `"${item.timestamp}","${item.location}","${item.camera}","${item.vehicles}","${item.carbonEmitted}","${item.carbonSaved}"`;
      } else if (reportType === 'traffic') {
        return `"${item.timestamp}","${item.location}","${item.camera}","${item.vehicles}","${item.congestionLevel}"`;
      }
      return `"${item.timestamp}","${item.location}","${item.camera}","${item.vehicles}","${item.carbonEmitted}","${item.carbonSaved}","${revStr}"`;
    });

    const fileContent = [headers, ...rows].join("\n");
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `emiora_ai_${reportType}_report_${dateRange}_${new Date().toISOString().split('T')[0]}.${exportMode === 'PDF' ? 'txt' : 'csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Summary Metrics calculations
  const totalVehicles = generatedData.reduce((sum, item) => sum + item.vehicles, 0);
  const totalCarbonEmitted = generatedData.reduce((sum, item) => sum + item.carbonEmitted, 0);
  const totalCarbonSaved = generatedData.reduce((sum, item) => sum + item.carbonSaved, 0);
  const totalRevenue = generatedData.reduce((sum, item) => sum + (isIDR ? item.revenueIDR : item.revenueUSD), 0);
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00ff88]/20 to-[#00d9ff]/10 border border-[#00ff88]/30 flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#00ff88]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.reports}</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">Generate, filter and export smart city insights</p>
          </div>
        </div>

        {/* Action export buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleExport('CSV')}
            disabled={generatedData.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#1a1a24] bg-white dark:bg-[#0f0f14] text-sm font-semibold text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00d9ff]" />
            {t.exportCSV}
          </button>
          <button 
            onClick={() => handleExport('PDF')}
            disabled={generatedData.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-slate-950 text-sm font-bold hover:shadow-lg hover:shadow-[#00ff88]/10 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            {t.exportPDF}
          </button>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-gray-400 font-semibold">{t.totalVehicles}</span>
            <div className="p-2 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/20">
              <BarChart2 className="w-4 h-4 text-[#00ff88]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-4">
            {totalVehicles.toLocaleString()}
          </div>
          <span className="text-xs text-slate-400 dark:text-gray-500 mt-1 block">Vehicles counted in range</span>
        </div>

        <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-gray-400 font-semibold">
              {reportType === 'carbon' ? t.carbonEmitted : t.carbonSaved}
            </span>
            <div className="p-2 rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/20">
              <TrendingUp className="w-4 h-4 text-[#00d9ff]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-4">
            {(reportType === 'carbon' ? totalCarbonEmitted : totalCarbonSaved).toLocaleString(undefined, { maximumFractionDigits: 1 })} kg
          </div>
          <span className="text-xs text-slate-400 dark:text-gray-500 mt-1 block">
            {reportType === 'carbon' ? 'CO2 emitted estimation' : 'Emissions saved by green transit'}
          </span>
        </div>

        <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-gray-400 font-semibold">
              {reportType === 'revenue' ? t.revenueToday : t.averageCongestion}
            </span>
            <div className="p-2 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20">
              {reportType === 'revenue' ? (
                <span className="text-[#8b5cf6] font-bold text-xs">{isIDR ? 'Rp' : '$'}</span>
              ) : (
                <ShieldAlert className="w-4 h-4 text-[#8b5cf6]" />
              )}
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-4">
            {reportType === 'revenue' ? (
              isIDR ? `Rp ${totalRevenue.toLocaleString()}` : `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ) : (
              generatedData.filter(i => i.congestionLevel === 'HIGH').length >= generatedData.length / 2 ? t.high : t.medium
            )}
          </div>
          <span className="text-xs text-slate-400 dark:text-gray-500 mt-1 block">
            {reportType === 'revenue' ? 'Dynamic pricing revenues' : 'Overall calculated level'}
          </span>
        </div>
      </div>

      {/* Toolbar Filter section */}
      <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
          {/* Select Report Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              {t.reportType}
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'traffic' | 'carbon' | 'revenue')}
              className="w-full bg-slate-50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-[#1a1a24] rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]/40 cursor-pointer transition-colors duration-300"
            >
              <option value="traffic">{t.trafficFlowReport}</option>
              <option value="carbon">{t.carbonEmissionReport}</option>
              <option value="revenue">{t.revenueReport}</option>
            </select>
          </div>

          {/* Select Date Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              {t.dateRange}
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '24h' | '7days' | '30days')}
              className="w-full bg-slate-50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-[#1a1a24] rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]/40 cursor-pointer transition-colors duration-300"
            >
              <option value="24h">{t.last24Hours}</option>
              <option value="7days">{t.last7Days}</option>
              <option value="30days">{t.last30Days}</option>
            </select>
          </div>

          {/* Select Camera Node */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" />
              {t.cameraNode}
            </label>
            <select
              value={cameraFilter}
              onChange={(e) => setCameraFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-[#1a1a24] rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88]/40 cursor-pointer transition-colors duration-300"
            >
              <option value="all">{t.allCameras}</option>
              <option value="Camera 01">Camera 01 (CV Main)</option>
              <option value="Camera 02">Camera 02</option>
              <option value="Camera 03">Camera 03</option>
              <option value="Camera 04">Camera 04</option>
              <option value="Camera 05">Camera 05</option>
              <option value="Camera 06">Camera 06</option>
            </select>
          </div>

          {/* Search location bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0a0a0f] border border-slate-200 dark:border-[#1a1a24] rounded-lg pl-9 pr-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff88]/40 transition-colors duration-300"
            />
          </div>
        </div>
      </div>

      {/* Main Table Preview Section */}
      <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="px-6 py-4 border-b border-slate-150 dark:border-[#1a1a24] bg-slate-50/50 dark:bg-[#0d0d12]/50 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800 dark:text-white">{t.previewingReport}</span>
          <span className="text-xs text-slate-500 dark:text-gray-400">{generatedData.length} records matched</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0a0a0f]/40 border-b border-slate-200 dark:border-[#1a1a24] text-slate-500 dark:text-gray-400 select-none">
                <th className="px-6 py-3.5 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => handleSort('timestamp')}>
                  <div className="flex items-center gap-1.5">
                    {t.timestamp}
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-6 py-3.5 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => handleSort('location')}>
                  <div className="flex items-center gap-1.5">
                    {t.location}
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-6 py-3.5 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => handleSort('camera')}>
                  <div className="flex items-center gap-1.5">
                    {t.cameraNode}
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-6 py-3.5 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => handleSort('vehicles')}>
                  <div className="flex items-center gap-1.5">
                    {t.vehiclesDetected}
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                {reportType === 'carbon' ? (
                  <>
                    <th className="px-6 py-3.5 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => handleSort('carbonEmitted')}>
                      <div className="flex items-center gap-1.5">
                        {t.carbonEmitted}
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => handleSort('carbonSaved')}>
                      <div className="flex items-center gap-1.5">
                        {t.carbonSaved}
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3.5 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => handleSort('carbonSaved')}>
                      <div className="flex items-center gap-1.5">
                        {t.carbonSaved}
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => handleSort('revenueUSD')}>
                      <div className="flex items-center gap-1.5">
                        {t.revenue}
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1a1a24]">
              {generatedData.length > 0 ? (
                generatedData.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{record.timestamp}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-gray-300">{record.location}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-gray-300">
                      <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-[#1a1a24] text-xs font-semibold">
                        {record.camera}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white font-semibold">{record.vehicles.toLocaleString()}</td>
                    {reportType === 'carbon' ? (
                      <>
                        <td className="px-6 py-4 text-red-500 font-semibold">{record.carbonEmitted.toFixed(1)} kg</td>
                        <td className="px-6 py-4 text-[#00ff88] font-semibold">{record.carbonSaved.toFixed(1)} kg</td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-[#00ff88] font-semibold">{record.carbonSaved.toFixed(1)} kg</td>
                        <td className="px-6 py-4 text-[#00d9ff] font-bold">
                          {isIDR ? `Rp ${record.revenueIDR.toLocaleString()}` : `$${record.revenueUSD.toFixed(2)}`}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-gray-400">
                    {t.noReportsFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Export Progress Modal Overlay */}
      {exportMode && (
        <div className="fixed inset-0 z-[999] bg-[#0a0a0f]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-2xl p-6 shadow-2xl space-y-6 text-center">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-[#1a1a24]"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#00ff88] border-t-transparent animate-spin"></div>
              <FileText className="w-6 h-6 text-[#00ff88] animate-pulse" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {exportStep === 0 && t.compilingData}
                {exportStep === 1 && t.processingCharts}
                {exportStep === 2 && t.generatingReport}
                {exportStep === 3 && t.downloadReady}
              </h4>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                {exportMode === 'PDF' ? 'Compiling PDF document layout' : 'Compiling CSV format file'}
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#00ff88] to-[#00d9ff] h-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-gray-400 font-bold">
                <span>STATUS: {exportProgress}%</span>
                <span>{exportProgress === 100 ? t.downloading.toUpperCase() : 'PROCESSING...'}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#0a0a0f] border border-slate-150 dark:border-[#1a1a24] p-3 rounded-lg flex items-center gap-3">
              <CheckCircle2 className={`w-5 h-5 transition-colors ${exportProgress >= 30 ? 'text-[#00ff88]' : 'text-slate-300 dark:text-gray-600'}`} />
              <span className={`text-xs text-left font-semibold ${exportProgress >= 30 ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                {t.compilingData}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-[#0a0a0f] border border-slate-150 dark:border-[#1a1a24] p-3 rounded-lg flex items-center gap-3">
              <CheckCircle2 className={`w-5 h-5 transition-colors ${exportProgress >= 70 ? 'text-[#00ff88]' : 'text-slate-300 dark:text-gray-600'}`} />
              <span className={`text-xs text-left font-semibold ${exportProgress >= 70 ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                {t.processingCharts}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-[#0a0a0f] border border-slate-150 dark:border-[#1a1a24] p-3 rounded-lg flex items-center gap-3">
              <CheckCircle2 className={`w-5 h-5 transition-colors ${exportProgress === 100 ? 'text-[#00ff88]' : 'text-slate-300 dark:text-gray-600'}`} />
              <span className={`text-xs text-left font-semibold ${exportProgress === 100 ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                {t.generatingReport}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
