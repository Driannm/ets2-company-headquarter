export interface MonthlyFinance {
    month: string;
    revenue: number;
    expenses: number;
    netProfit: number;
  }
  
  export const monthlyFinanceData: MonthlyFinance[] = [
    { month: "Jan", revenue: 380000, expenses: 240000, netProfit: 140000 },
    { month: "Feb", revenue: 410000, expenses: 255000, netProfit: 155000 },
    { month: "Mar", revenue: 390000, expenses: 250000, netProfit: 140000 },
    { month: "Apr", revenue: 450000, expenses: 280000, netProfit: 170000 },
    { month: "May", revenue: 480000, expenses: 290000, netProfit: 190000 },
    { month: "Jun", revenue: 520000, expenses: 310000, netProfit: 210000 },
    { month: "Jul", revenue: 550000, expenses: 330000, netProfit: 220000 },
    { month: "Aug", revenue: 530000, expenses: 320000, netProfit: 210000 },
    { month: "Sep", revenue: 580000, expenses: 350000, netProfit: 230000 },
    { month: "Oct", revenue: 620000, expenses: 370000, netProfit: 250000 },
    { month: "Nov", revenue: 650000, expenses: 390000, netProfit: 260000 },
    { month: "Dec", revenue: 670000, expenses: 400000, netProfit: 270000 },
  ];
  
  export interface FinanceSummary {
    totalRevenue: number;
    totalExpenses: number;
    totalNetProfit: number;
  }
  
  export const financeSummary: FinanceSummary = {
    totalRevenue: 4500000,
    totalExpenses: 2900000,
    totalNetProfit: 1600000,
  };
  
  export interface SparklineData {
    label: string;
    data: number[];
    trend: number;
  }
  
  export const sparklineData: SparklineData[] = [
    { label: "Balance", data: [2100000, 2150000, 2200000, 2280000, 2350000, 2400000, 2450000], trend: 4.2 },
    { label: "Today's Profit", data: [18000, 19500, 21000, 22000, 23000, 24000, 24500], trend: 8.5 },
    { label: "Monthly Revenue", data: [580000, 600000, 620000, 635000, 650000, 660000, 670000], trend: 3.1 },
    { label: "Active Deliveries", data: [12, 14, 15, 16, 17, 18, 18], trend: 12.5 },
    { label: "Total Drivers", data: [48, 50, 52, 54, 55, 56, 57], trend: 5.8 },
    { label: "Fleet Size", data: [55, 57, 58, 60, 61, 62, 63], trend: 2.1 },
  ];