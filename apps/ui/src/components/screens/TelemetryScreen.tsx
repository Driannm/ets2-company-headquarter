import React from 'react';
import { Gauge, Flame, Navigation, Key } from 'lucide-react';

export const TelemetryScreen: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-text-primary">Live Cockpit Telemetry</h2>
        <p className="text-xs text-text-secondary">Real-time simulation monitor for external telemetry screens.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tachometer Speed & RPM Dial */}
        <div className="bg-panel-card p-6 rounded-dashboard border border-panel-inner flex flex-col justify-between items-center h-80 relative overflow-hidden">
          <div className="w-full flex justify-between text-xs text-text-secondary uppercase tracking-wider font-bold">
            <span>Speedometer</span>
            <span>RPM Dial</span>
          </div>

          {/* Digital Instrument Representation */}
          <div className="flex flex-col items-center">
            <span className="text-6xl font-black text-text-primary tracking-tight font-mono">
              83 <span className="text-sm text-text-secondary font-sans uppercase">km/h</span>
            </span>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs font-mono text-accent-gold">1,450 RPM</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>

          {/* Simplified Linear Scale RPM Gauge */}
          <div className="w-full">
            <div className="flex justify-between text-[10px] text-text-secondary mb-1.5">
              <span>0</span>
              <span>1000</span>
              <span className="text-accent-gold">1500 (Eco)</span>
              <span className="text-accent-crimson">2500</span>
            </div>
            <div className="w-full h-3 bg-panel-inner rounded-full overflow-hidden p-0.5 border border-panel-card">
              <div className="h-full bg-gradient-to-r from-green-500 to-accent-gold rounded-full w-3/5" />
            </div>
          </div>
        </div>

        {/* Transmission & Diagnostics */}
        <div className="bg-panel-card p-6 rounded-dashboard border border-panel-inner flex flex-col justify-between h-80">
          <div className="w-full flex justify-between text-xs text-text-secondary uppercase tracking-wider font-bold">
            <span>Gearbox Status</span>
            <span>Diagnostics</span>
          </div>

          <div className="flex items-center justify-center gap-6">
            {/* Active Gear Display */}
            <div className="w-24 h-24 rounded-2xl bg-panel-inner border border-panel-card flex flex-col items-center justify-center">
              <span className="text-xs text-text-secondary uppercase font-semibold">Active Gear</span>
              <span className="text-4xl font-extrabold text-accent-gold font-mono">D11</span>
            </div>
            
            {/* Cruise Control Indicators */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-text-primary font-semibold">Cruise Control (80 km/h)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-panel-inner" />
                <span className="text-text-secondary">Motor Brake Active</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-panel-inner p-2 rounded-lg border border-panel-card">
              <span className="text-[10px] text-text-secondary block">Water Temp</span>
              <span className="font-bold text-text-primary font-mono">82°C</span>
            </div>
            <div className="bg-panel-inner p-2 rounded-lg border border-panel-card">
              <span className="text-[10px] text-text-secondary block">Air Press</span>
              <span className="font-bold text-text-primary font-mono">11.8 Bar</span>
            </div>
            <div className="bg-panel-inner p-2 rounded-lg border border-panel-card">
              <span className="text-[10px] text-text-secondary block">Oil Temp</span>
              <span className="font-bold text-text-primary font-mono">94°C</span>
            </div>
          </div>
        </div>

        {/* Consumables (Fuel & AdBlue) */}
        <div className="bg-panel-card p-6 rounded-dashboard border border-panel-inner flex flex-col justify-between h-80">
          <div className="w-full flex justify-between text-xs text-text-secondary uppercase tracking-wider font-bold">
            <span>Consumables</span>
            <span>Est. Autonomy</span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Fuel Progress */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Flame size={12} className="text-accent-gold" />
                  Fuel Reservoir
                </span>
                <span className="text-text-primary font-bold font-mono">420L / 800L</span>
              </div>
              <div className="w-full h-2.5 bg-panel-inner rounded-full overflow-hidden">
                <div className="h-full bg-accent-gold rounded-full w-[52.5%]" />
              </div>
            </div>

            {/* AdBlue Progress */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">AdBlue Liquid</span>
                <span className="text-text-primary font-bold font-mono">45L / 80L</span>
              </div>
              <div className="w-full h-2.5 bg-panel-inner rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[56%]" />
              </div>
            </div>
          </div>

          <div className="bg-panel-inner p-3 rounded-card border border-panel-card text-center">
            <span className="text-[10px] uppercase text-text-secondary font-bold tracking-wider">Estimated Autonomy Range</span>
            <p className="text-lg font-bold text-accent-gold font-mono mt-0.5">approx. 1,280 km</p>
          </div>
        </div>

      </div>
    </div>
  );
};