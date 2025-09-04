// Centralized route path constants for admin and client

// Client routes
export const HOME_ROUTE = "/";
export const HARAYA_ROUTE = "/Haraya";
export const AURELIA_ROUTE = "/Aurelia";
export const LAYA_ROUTE = "/Laya";
export const WACKWACK_ROUTE = "/WackWack";
export const SHANGSUMMIT_ROUTE = "/ShangSummit";

// Admin routes
export const ADMIN_ROUTE = "/Admin";
export const ADMIN_DASHBOARD_ROUTE = "/Admin/Dashboard";
export const ADMIN_PROJECTS_ROUTE = "/Admin/Projects";
export const ADMIN_PROJECTS_ARCHIVE_ROUTE = "/Admin/Projects/Archive";
export const ADMIN_INQUIRIES_ROUTE = "/Admin/Inquiries";
export const ADMIN_PAGE_MANAGEMENT_ROUTE = "/Admin/PageManagement";
export const ADMIN_SETTINGS_ROUTE = "/Admin/Settings";
export const ADMIN_ERROR_TEST_ROUTE = "/Admin/ErrorTest";

export const ROUTE_PATHS = {
  ADMIN: "/Admin",
  ADMIN_DASHBOARD: "/Admin/Dashboard",
  ADMIN_PROJECTS: "/Admin/Projects",
  ADMIN_PROJECTS_ARCHIVE: "/Admin/Projects/Archive",
  ADMIN_INQUIRIES: "/Admin/Inquiries",
  ADMIN_PAGE_MANAGEMENT: "/Admin/PageManagement",
  ADMIN_SETTINGS: "/Admin/Settings",
  ADMIN_ERROR_TEST: "/Admin/ErrorTest",
};

export type RoutePath = typeof ROUTE_PATHS[keyof typeof ROUTE_PATHS];