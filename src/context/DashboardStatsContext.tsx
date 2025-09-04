import React, { createContext, useContext, useRef } from "react";

interface DashboardStatsContextType {
  refreshDashboard: () => void;
  subscribe: (cb: () => void) => void;
}

const DashboardStatsContext = createContext<DashboardStatsContextType | undefined>(undefined);

export const useDashboardStats = () => {
  const ctx = useContext(DashboardStatsContext);
  if (!ctx) throw new Error("useDashboardStats must be used within DashboardStatsProvider");
  return ctx;
};

export const DashboardStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const listeners = useRef<(() => void)[]>([]);

  const refreshDashboard = () => {
    listeners.current.forEach((cb) => cb());
  };

  const subscribe = (cb: () => void) => {
    listeners.current.push(cb);
  };

  return (
    <DashboardStatsContext.Provider value={{ refreshDashboard, subscribe }}>
      {children}
    </DashboardStatsContext.Provider>
  );
};
