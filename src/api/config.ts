// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  ADMIN_TOKEN: import.meta.env.VITE_ADMIN_TOKEN || "admin_demo_token_12345",
  APP_TOKEN: import.meta.env.VITE_APP_TOKEN || "APP_demo_token_12345",
};

// API Endpoints
export const ENDPOINTS = {
  // Admin endpoints
  ADMIN: {
    ROUTES: "/admin/v1/routes",
    ANALYTICS_REALTIME: "/admin/v1/analytics/realtime",
    ANALYTICS_REVENUE: "/admin/v1/analytics/revenue",
    ANALYTICS_TICKETS: "/admin/v1/analytics/tickets",
    ANALYTICS_ROUTE_PERFORMANCE: "/admin/v1/analytics/route-performance",
    DEVICE_HEALTH: "/admin/v1/device-health",
    FLEET_BUSES: "/admin/v1/fleet/buses",
    FLEET_DRIVERS: "/admin/v1/fleet/drivers",
    FLEET_CONDUCTORS: "/admin/v1/fleet/conductors",
    BUSES_LIVE: "/admin/v1/buses/live",
  },
  // App endpoints
  APP: {
    BUSES_LIVE: "/app/v1/buses/live",
    BUS_TRACK: "/app/v1/bus",
    ROUTES_SEARCH: "/app/v1/routes/search",
    ROUTE_LIVE_BUSES: "/app/v1/routes",
    STOPS: "/app/v1/stops",
  },
};

// Helper to create headers
export const createHeaders = (useAdminToken = true) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${useAdminToken ? API_CONFIG.ADMIN_TOKEN : API_CONFIG.APP_TOKEN}`,
});
