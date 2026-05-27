import { DollarSign, Car, Truck, Leaf, TrendingUp } from 'lucide-react';
import { translations, Language, Currency } from '../utils/translations';

interface CongestionPricingProps {
  language?: Language;
  currency?: Currency;
}

export function CongestionPricing({ language = 'id', currency = 'IDR' }: CongestionPricingProps) {
  const t = translations[language];
  const isIDR = currency === 'IDR';

  const pricingTiers = [
    { category: t.electricVehicles, icon: Leaf, price: isIDR ? 'Rp 0' : '$0.00', discount: '100%', color: '#00ff88' },
    { category: t.hybridVehicles, icon: Car, price: isIDR ? 'Rp 35.000' : '$2.50', discount: '50%', color: '#00d9ff' },
    { category: t.standardCars, icon: Car, price: isIDR ? 'Rp 75.000' : '$5.00', discount: '0%', color: '#8b5cf6' },
    { category: t.heavyTrucks, icon: Truck, price: isIDR ? 'Rp 180.000' : '$12.00', discount: '0%', color: '#f59e0b' },
  ];

  return (
    <div className="bg-white dark:bg-[#0f0f14] border border-slate-200 dark:border-[#1a1a24] rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#f59e0b]/20 to-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-[#f59e0b]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.dynamicPricing}</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400">{t.realtimeCongestionToll}</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-gradient-to-r dark:from-[#00ff88]/10 dark:to-[#00d9ff]/10 border border-slate-200 dark:border-[#00ff88]/20 rounded-lg p-4 mb-6 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">{t.currentMultiplier}</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">1.5x</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">{t.peakHoursActive}</div>
            <div className="flex items-center gap-1 text-sm font-semibold text-[#f59e0b]">
              <TrendingUp className="w-4 h-4" />
              {t.highDemand}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {pricingTiers.map((tier, index) => {
          const Icon = tier.icon;
          return (
            <div key={index} className="bg-slate-50 dark:bg-[#0a0a0f] rounded-lg p-4 border border-slate-200 dark:border-[#1a1a24] hover:border-[#00ff88]/30 dark:hover:border-[#00ff88]/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${tier.color}20`,
                      border: `1px solid ${tier.color}30`
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: tier.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{tier.category}</div>
                    <div className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                      {tier.discount !== '0%' && (
                        <span className="text-[#00ff88] font-semibold">{tier.discount} {t.greenDiscount}</span>
                      )}
                      {tier.discount === '0%' && <span>{t.standardRate}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{tier.price}</div>
                  <div className="text-xs text-slate-500 dark:text-gray-400">{t.perEntry}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#1a1a24]">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">{t.revenueToday}</div>
            <div className="text-sm font-bold text-[#00ff88]">{isIDR ? "Rp 518,7 Jt" : "$34,580"}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">{t.greenVehicles}</div>
            <div className="text-sm font-bold text-[#00d9ff]">23.4%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">{t.savedCarbon}</div>
            <div className="text-sm font-bold text-[#8b5cf6]">847 kg</div>
          </div>
        </div>
      </div>
    </div>
  );
}
