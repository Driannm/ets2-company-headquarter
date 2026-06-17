export interface AlertConfig {
    id: string;
    title: string;
    description: string;
    severity: "critical" | "warning" | "info";
    timestamp: string;
    action?: string;
  }
  
  export const alerts: AlertConfig[] = [
    {
      id: "alt1",
      title: "Maintenance Required",
      description: "Truck FH16-021 requires immediate maintenance check. Engine diagnostics show abnormal wear.",
      severity: "warning",
      timestamp: "2024-01-15T10:30:00Z",
      action: "Schedule Service",
    },
    {
      id: "alt2",
      title: "Garage Capacity",
      description: "Berlin Garage is at 92% capacity. Consider expanding or relocating vehicles.",
      severity: "warning",
      timestamp: "2024-01-15T09:45:00Z",
      action: "View Garage",
    },
    {
      id: "alt3",
      title: "Loan Payment Due",
      description: "Monthly loan payment of €45,000 is due tomorrow. Ensure sufficient funds are available.",
      severity: "critical",
      timestamp: "2024-01-15T08:00:00Z",
      action: "Pay Now",
    },
    {
      id: "alt4",
      title: "Driver Inactivity",
      description: "Driver Alex has been inactive for 2 consecutive days. Check status and assignments.",
      severity: "info",
      timestamp: "2024-01-15T07:15:00Z",
      action: "Contact Driver",
    },
    {
      id: "alt5",
      title: "Insurance Renewal",
      description: "Fleet insurance policy expires in 14 days. Renewal paperwork is pending approval.",
      severity: "warning",
      timestamp: "2024-01-15T06:30:00Z",
      action: "Renew Policy",
    },
  ];