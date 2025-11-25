import { API_CONFIG, ENDPOINTS, createHeaders } from "./config";
import type { LiveBus, BusTrackingData } from "./types";

/**
 * Get all live buses across all routes
 */
export async function getAllLiveBuses(): Promise<{
  buses: LiveBus[];
  count: number;
}> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.APP.BUSES_LIVE}`,
    {
      headers: createHeaders(false), // Use app token
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch live buses: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get detailed tracking data for a specific bus
 */
export async function getBusTrackingData(
  busId: string
): Promise<BusTrackingData | null> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.APP.BUS_TRACK}/${busId}/track`,
    {
      headers: createHeaders(false), // Use app token
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch bus tracking data: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get live buses on a specific route
 */
export async function getRouteLiveBuses(routeId: string): Promise<{
  route_id: string;
  buses: LiveBus[];
}> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.APP.ROUTE_LIVE_BUSES}/${routeId}/live-buses`,
    {
      headers: createHeaders(false), // Use app token
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch route live buses: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search routes by query
 */
export async function searchRoutes(query: string): Promise<{
  query: string;
  results: any[];
}> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.APP.ROUTES_SEARCH}?query=${encodeURIComponent(query)}`,
    {
      headers: createHeaders(false), // Use app token
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to search routes: ${response.statusText}`);
  }

  return response.json();
}
