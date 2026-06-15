import React from 'react';
import { Star, MessageSquare, Briefcase } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  status: 'Idle' | 'On Delivery' | 'Resting';
  rating: number;
  salary: number;
  efficiency: number; // L / 100km
}

export const DriversScreen: React.FC = () => {
  const drivers: Driver[] = [
    { id: '1', name: 'Ivan Petrov', status: 'On Delivery', rating: 4.8, salary: 3.50, efficiency: 32.4 },
    { id: '2', name: 'Zoe Becker', status: 'On Delivery', rating: 4.9, salary: 3.80, efficiency: 30.1 },
    { id: '3', name: 'Lukas Meyer', status: 'Resting', rating: 4.2, salary: 2.90, efficiency: 34.2 },
    { id: '4', name: 'Amelie Laurent', status: 'Idle', rating: 4.5, salary: 3.20, efficiency: 31.8 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-text-primary">Drivers Pool</h2>
        <p className="text-xs text-text-secondary">Review ratings, fuel efficiencies, and logs for active personnel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drivers.map((driver) => (
          <div 
            key={driver.id} 
            className="bg-panel-card p-6 rounded-dashboard border border-panel-inner flex flex-col justify-between gap-4 hover:border-accent-gold/20 transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-panel-sidebar flex items-center justify-center font-extrabold text-accent-gold border border-panel-inner">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary">{driver.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star size={12} className="fill-accent-gold text-accent-gold" />
                    <span className="text-xs font-semibold text-accent-gold">{driver.rating}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                driver.status === 'On Delivery' 
                  ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                  : driver.status === 'Resting' 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                    : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
              }`}>
                {driver.status}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 border-y border-panel-inner py-4">
              <div>
                <span className="text-[10px] uppercase text-text-secondary font-bold tracking-wider">Salary/Km</span>
                <p className="text-sm font-semibold text-text-primary mt-0.5">€{driver.salary.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-text-secondary font-bold tracking-wider">Avg. Efficiency</span>
                <p className="text-sm font-semibold text-text-primary mt-0.5">{driver.efficiency} L/100km</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button className="p-2 bg-panel-inner hover:bg-panel-card border border-panel-card text-text-secondary hover:text-text-primary rounded-lg transition-colors cursor-pointer">
                <MessageSquare size={16} />
              </button>
              <button className="px-3 py-1.5 bg-panel-inner hover:bg-panel-card border border-panel-card text-xs font-semibold text-text-primary rounded-lg flex items-center gap-1.5 hover:border-accent-gold/40 transition-colors cursor-pointer">
                <Briefcase size={14} className="text-accent-gold" />
                Assign Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};