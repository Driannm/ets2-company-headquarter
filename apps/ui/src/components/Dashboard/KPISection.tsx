/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, Calendar, Truck, Users, Package, Gauge } from "lucide-react";
import { companyInfo } from "./data/CompanyData";
import { sparklineData } from "./data/FinanceData";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const kpiConfig = [
  { key: "balance", label: "Company Balance", icon: Wallet, color: "#4FD1FF", format: "€" },
  { key: "todaysProfit", label: "Today's Profit", icon: Calendar, color: "#00FF99", format: "€" },
  { key: "monthlyRevenue", label: "Monthly Revenue", icon: TrendingUp, color: "#7B61FF", format: "€" },
  { key: "activeDeliveries", label: "Active Deliveries", icon: Package, color: "#FFD54F", format: "" },
  { key: "totalDrivers", label: "Total Drivers", icon: Users, color: "#00E5FF", format: "" },
  { key: "fleetSize", label: "Fleet Size", icon: Truck, color: "#FF5C7A", format: "" },
];

const kpiValues: Record<string, number> = {
  balance: companyInfo.balance,
  todaysProfit: companyInfo.todaysProfit,
  monthlyRevenue: companyInfo.monthlyRevenue,
  activeDeliveries: companyInfo.activeDeliveries,
  totalDrivers: companyInfo.totalDrivers,
  fleetSize: companyInfo.fleetSize,
};

function formatValue(value: number, prefix: string): string {
  if (prefix === "€") {
    return `€${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
}

export default function KPISection() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiConfig.map((kpi, index) => {
        const Icon = kpi.icon;
        const value = kpiValues[kpi.key];
        const sparkline = sparklineData[index];
        const chartData = sparkline?.data.map((v, i) => ({ value: v })) || [];

        return (
          <motion.div
            key={kpi.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, boxShadow: `0 8px 32px ${kpi.color}15` }}
            className="relative overflow-hidden rounded-3xl bg-[#101C3A]/60 backdrop-blur-sm border border-[#4FD1FF]/10 p-5 group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${kpi.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
              <div className="flex items-center gap-1">
                {sparkline?.trend && sparkline.trend > 0 ? (
                  <TrendingUp className="w-3 h-3 text-[#00FF99]" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-[#FF5C7A]" />
                )}
                <span className={`text-xs font-medium ${sparkline?.trend && sparkline.trend > 0 ? "text-[#00FF99]" : "text-[#FF5C7A]"}`}>
                  {sparkline?.trend ? `${sparkline.trend > 0 ? "+" : ""}${sparkline.trend}%` : "+0%"}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/50 mb-1">{kpi.label}</p>
            <p className="text-xl font-bold text-white mb-3">{formatValue(value, kpi.format)}</p>

            <div className="h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`gradient-${kpi.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={kpi.color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={kpi.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={kpi.color}
                    strokeWidth={2}
                    fill={`url(#gradient-${kpi.key})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 0 1px ${kpi.color}30`,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}