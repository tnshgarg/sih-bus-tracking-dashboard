// API Response Types

export interface RealtimeAnalytics {
  active_buses: number;
  avg_speed_kmph: number;
  crowding_breakdown: {
    low: number;
    medium: number;
    high: number;
  };
  timestamp: string;
}

export interface RouteStop {
  name: string;
  lat: number;
  lng: number;
  sequence: number;
}

export interface Route {
  route_id: string;
  name: string;
  fare_per_km: number;
  status?: string;
  stops: RouteStop[];
  // Analytics fields
  daily_passengers?: number;
  peak_occupancy?: number;
  avg_duration?: string;
  distance_km?: number;
}

export interface LiveBus {
  bus_id: string;
  route_id: string | null;
  route_name: string | null;
  trip_id: string | null;
  lat: number;
  lng: number;
  speed_kmph: number | null;
  bearing_deg: number | null;
  last_update: string;
  passenger_load_pct: number;
  load_category: "low" | "medium" | "high";
  current_stop: string | null;
  next_stop: string | null;
  eta_minutes: number | null;
}

export interface BusTrackingData {
  bus_id: string;
  route_id: string | null;
  route_name: string;
  trip_id: string | null;
  current_location: {
    lat: number;
    lng: number;
    speed_kmph: number | null;
    bearing_deg: number | null;
    timestamp: string;
  };
  passenger_load_pct: number;
  load_category: "low" | "medium" | "high";
  stop_timeline: Array<{
    name: string;
    lat: number;
    lng: number;
    sequence: number;
    status: "passed" | "current" | "upcoming";
    eta_minutes: number | null;
  }>;
}

export interface RevenueAnalytics {
  date: string;
  total_tickets: number;
  total_revenue: number;
  routes: Array<{
    route_id: string;
    total_tickets: number;
    total_revenue: number;
    total_trips: number;
  }>;
}

export interface DeviceHealth {
  device_id: string;
  bus_id: string;
  status: string;
  last_seen: string | null;
  offline: boolean;
}


export interface TicketAnalytics {
  search_criteria: {
    boarding_stop?: string;
    destination_stop?: string;
    start_date?: string;
    end_date?: string;
  };
  combined_totals: {
    total_buses: number;
    total_trips: number;
    total_tickets: number;
    total_revenue: number;
    unique_seats_occupied: number;
    avg_fare: number;
  };
  buses: Array<{
    bus_id: string;
    route_id: string;
    total_trips: number;
    total_tickets: number;
    total_revenue: number;
    seats_occupied: number;
    avg_fare: number;
    tickets: any[];
  }>;
}

export interface FleetBus {
  bus_id: string;
  status: string;
  last_seen: string | null;
  capacity: number;
  type: string;
}

export interface FleetDriver {
  driver_id: string;
  name: string;
  status: string;
  current_bus: string | null;
  license_no: string;
  phone: string;
}

export interface FleetConductor {
  conductor_id: string;
  name: string;
  status: string;
  current_bus: string | null;
  license_no: string;
  phone: string;
}

export interface ApiError {
  code: string;
  message: string;
  errors?: any[];
}
