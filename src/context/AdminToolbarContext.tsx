import React from "react";

// Actions/state that pages can expose to the Admin navbar
export type AdminToolbarState = {
  // Dashboard
  onRefresh?: () => void;

  // Inquiries
  onInquiriesEdit?: () => void;
  onInquiriesArchive?: () => void;

  // Projects
  onProjectAdd?: () => void;
  onProjectToggleArchive?: () => void;
  isProjectArchive?: boolean;
  onToggleMenu?: () => void; // mobile list toggle

  // Page Management
  onPageEdit?: () => void;
  onPlaceholder?: () => void;
};

export type AdminToolbarContextValue = {
  state: AdminToolbarState;
  // Merge provided partial into current toolbar state
  setToolbarState: (partial: Partial<AdminToolbarState>) => void;
  // Clear current toolbar state (used on page unmount)
  resetToolbarState: () => void;
};

const defaultValue: AdminToolbarContextValue = {
  state: {},
  setToolbarState: () => undefined,
  resetToolbarState: () => undefined,
};

const AdminToolbarContext = React.createContext<AdminToolbarContextValue>(defaultValue);

export const AdminToolbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<AdminToolbarState>({});

  const setToolbarState = React.useCallback((partial: Partial<AdminToolbarState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetToolbarState = React.useCallback(() => {
    setState({});
  }, []);

  const value = React.useMemo<AdminToolbarContextValue>(
    () => ({ state, setToolbarState, resetToolbarState }),
    [state, setToolbarState, resetToolbarState]
  );

  return <AdminToolbarContext.Provider value={value}>{children}</AdminToolbarContext.Provider>;
};

export function useAdminToolbar() {
  return React.useContext(AdminToolbarContext);
}