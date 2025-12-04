import { API_CONFIG, ENDPOINTS, createHeaders } from "./config";
import type {
  RealtimeAnalytics,
  Route,
  RevenueAnalytics,
  DeviceHealth,
  TicketAnalytics,
  FleetBus,
  FleetDriver,
  FleetConductor,
} from "./types";

/**
 * Get real-time analytics (active buses, speed, crowding)
 */
export async function getRealtimeAnalytics(): Promise<RealtimeAnalytics> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.ANALYTICS_REALTIME}`,
    {
      headers: createHeaders(true),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch realtime analytics: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get revenue analytics for a specific date
 */
export async function getRevenueAnalytics(
  date: string
): Promise<RevenueAnalytics> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.ANALYTICS_REVENUE}?date=${date}`,
    {
      headers: createHeaders(true),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch revenue analytics: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all routes with stops
 */
export async function getAllRoutes(): Promise<{ routes: Route[]; count: number }> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.ROUTES}`,
    {
      headers: createHeaders(true),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch routes: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get device health status
 */
export async function getDeviceHealth(): Promise<{
  devices: DeviceHealth[];
  summary: { total: number; online: number; offline: number };
}> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.DEVICE_HEALTH}`,
    {
      headers: createHeaders(true),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch device health: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get ticket analytics with filters
 */
export async function getTicketAnalytics(filters: {
  boarding_stop?: string;
  destination_stop?: string;
  start_date?: string;
  end_date?: string;
}): Promise<TicketAnalytics> {
  const params = new URLSearchParams();
  if (filters.boarding_stop) params.append("boarding_stop", filters.boarding_stop);
  if (filters.destination_stop) params.append("destination_stop", filters.destination_stop);
  if (filters.start_date) params.append("start_date", filters.start_date);
  if (filters.end_date) params.append("end_date", filters.end_date);

  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.ANALYTICS_TICKETS}?${params.toString()}`,
    {
      headers: createHeaders(true),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ticket analytics: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all fleet buses
 */
export async function getFleetBuses(): Promise<FleetBus[]> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.FLEET_BUSES}`,
    {
      headers: createHeaders(true),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch fleet buses: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all fleet drivers
 */
export async function getFleetDrivers(): Promise<FleetDriver[]> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.FLEET_DRIVERS}`,
    {
      headers: createHeaders(true),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch fleet drivers: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all fleet conductors
 */
export async function getFleetConductors(): Promise<FleetConductor[]> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.FLEET_CONDUCTORS}`,
    {
      headers: createHeaders(true),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch fleet conductors: ${response.statusText}`);
  }

  return response.json();
}
/**
 * Get all live buses for map
 */
export async function getLiveBuses(): Promise<any[]> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.BUSES_LIVE}`,
    {
      headers: createHeaders(true),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch live buses: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get route performance analytics
 */
export async function getRoutePerformance(): Promise<any[]> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.ANALYTICS_ROUTE_PERFORMANCE}`,
    {
      headers: createHeaders(true),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch route performance: ${response.statusText}`);
  }

  return response.json();
}


/**
 * Create a new conductor
 */
export async function createConductor(data: {
  conductorId: string;
  name: string;
  password: string;
  licenseNo: string;
  phone: string;
}): Promise<any> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.FLEET_CONDUCTORS}`,
    {
      method: "POST",
      headers: createHeaders(true),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to create conductor: ${response.statusText}`);
  }

  return response.json();
}
