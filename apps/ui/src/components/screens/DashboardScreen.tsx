import React from 'react';
import { StatCard } from '../ui/StatCard.js';
import { Truck, Coins, Users, Clock, Navigation2, ArrowRight } from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* 1. Hero Card: Active Logistics Job */}
      <div className="bg-gradient-to-r from-panel-card via-panel-card to-accent-crimson/20 p-8 rounded-dashboard border border-panel-inner flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        <div className="flex flex-col gap-4 max-w-xl z-10">
          <div className="flex items-center gap-3">
            <span className="bg-accent-gold/15 text-accent-gold text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-accent-gold/30">
              Active Delivery
            </span>
            <span className="text-text-secondary text-xs font-mono">ID: Job-7112</span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-text-primary tracking-tight">
              SCANIA S730 • High-Tech Components
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Currently traversing near <strong className="text-accent-gold">Hannover (Germany)</strong> en route to London.
            </p>
          </div>

          {/* Real-time Progress Bar */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between text-xs font-semibold text-text-secondary">
              <span>Berlin (Origin)</span>
              <span>London (Destination)</span>
            </div>
            <div className="w-full h-2.5 bg-panel-inner rounded-full overflow-hidden border border-panel-card">
              <div className="h-full bg-accent-gold rounded-full w-3/5 relative animate-pulse" />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Elapsed: 420 km</span>
              <span className="text-accent-gold font-bold">280 km remaining</span>
            </div>
          </div>
        </div>

        {/* Live Mini Navigation Vector Graphic */}
        <div className="w-full lg:w-72 h-44 bg-panel-inner rounded-card border border-panel-card p-4 flex flex-col justify-between items-center relative">
          <div className="w-full flex justify-between items-center border-b border-panel-card pb-2">
            <span className="text-xs font-bold text-text-secondary flex items-center gap-1">
              <Navigation2 size={12} className="rotate-45 text-accent-gold" />
              Route Vector
            </span>
            <span className="text-[10px] font-mono text-accent-gold">53% Complete</span>
          </div>

          <svg className="w-full h-24" viewBox="0 0 100 40">
            {/* Mock Route Path */}
            <path 
              d="M10,20 Q30,5 50,30 T90,20" 
              fill="none" 
              stroke="#3a1f1f" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
            <path 
              d="M10,20 Q30,5 50,30" 
              fill="none" 
              stroke="#fca311" 
              strokeWidth="3" 
              strokeLinecap="round"
              strokeDasharray="4 2"
            />
            {/* Truck Marker */}
            <circle cx="50" cy="30" r="5" fill="#9e2a2b" className="animate-ping" />
            <circle cx="50" cy="30" r="4" fill="#fca311" />
            {/* Origin & Destination */}
            <circle cx="10" cy="20" r="3" fill="#f5ecec" />
            <circle cx="90" cy="20" r="3" fill="#9e2a2b" />
          </svg>
        </div>
      </div>

      {/* 2. Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Fleet" 
          value="12 / 14" 
          icon={Truck} 
          trend={{ value: 4, isPositive: true, timeframe: "vs yesterday" }} 
        />
        <StatCard 
          title="Estimated Revenues" 
          value="€142,390" 
          icon={Coins} 
          trend={{ value: 12, isPositive: true, timeframe: "this week" }} 
          variant="accent"
        />
        <StatCard 
          title="Active Drivers" 
          value="8 on road" 
          icon={Users} 
        />
        <StatCard 
          title="Operating Hours" 
          value="12,340 hrs" 
          icon={Clock} 
        />
      </div>

      {/* 3. Quick Actions Panel & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-panel-card p-6 rounded-card border border-panel-inner lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
            Recommended Contracts
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { cargo: 'Medical Equipment', route: 'Krakow ➜ Poznan', payout: '€22,400', weight: '12t' },
              { cargo: 'Automotive Parts', route: 'Stuttgart ➜ Warsaw', payout: '€41,900', weight: '24t' },
            ].map((contract, idx) => (
              <div key={idx} className="bg-panel-inner p-4 rounded-card border border-panel-card flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">{contract.cargo}</h4>
                  <p className="text-xs text-text-secondary">{contract.route} • {contract.weight}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-accent-gold">{contract.payout}</span>
                  <button className="p-2 bg-panel-card rounded-lg text-text-primary hover:text-accent-gold transition-colors cursor-pointer">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Warnings */}
        <div className="bg-panel-card p-6 rounded-card border border-panel-inner flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
            Attention Required
          </h3>
          <div className="flex flex-col gap-3">
            <div className="bg-accent-crimson/10 border border-accent-crimson/30 p-4 rounded-card">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">
                Chassis Damage Alert
              </h4>
              <p className="text-[11px] text-text-secondary mt-1">
                Volvo FH16 (Plate: B-772-XX) has reached 14% chassis damage. Immediate servicing is advised.
              </p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-card">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">
                Driver Fatigue Check
              </h4>
              <p className="text-[11px] text-text-secondary mt-1">
                Ivan Petrov driving time will exceed the legal limit in 45 minutes. Rest scheduled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};