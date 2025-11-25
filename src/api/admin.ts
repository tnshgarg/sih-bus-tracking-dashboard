import { API_CONFIG, ENDPOINTS, createHeaders } from "./config";
import type {
  RealtimeAnalytics,
  Route,
  RevenueAnalytics,
  DeviceHealth,
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
