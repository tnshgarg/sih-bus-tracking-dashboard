import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Navigation,
  Bookmark,
  Bell,
  Bus,
  Route as RouteIcon,
  Calendar,
  Phone
} from "lucide-react";

const PassengerPortal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  type PassengerRoute = {
    id: string;
    name: string;
    startPoint: string;
    endPoint: string;
    stops: string;
    duration: string;
    rating?: number;
  };

  type LiveBus = {
    busNumber: string;
    route: string;
    lastUpdate: string;
    speed: number | null;
    lat: number;
    lng: number;
  };

  const [routes, setRoutes] = useState<PassengerRoute[]>([]);
  const [liveBuses, setLiveBuses] = useState<LiveBus[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [isLoadingBuses, setIsLoadingBuses] = useState(false);

  const API_BASE_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:3000";
  const API_BASE_PATH = (import.meta as any).env.VITE_API_BASE_PATH || "/etm/v1";
  const API_TOKEN = (import.meta as any).env.VITE_API_TOKEN || "demo_token_12345";

  const fetchRoutes = async () => {
    try {
      setIsLoadingRoutes(true);
      const res = await fetch(`${API_BASE_URL}${API_BASE_PATH}/routes`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load routes");
      const data = await res.json();
      const mapped: PassengerRoute[] = (data.routes || []).map((r: any) => ({
        id: r.route_id,
        name: r.name,
        startPoint: r.start_point,
        endPoint: r.end_point,
        stops: r.stops,
        duration: r.avg_duration || "",
        rating: 4.0, // placeholder rating until backed by real data
      }));
      setRoutes(mapped);
    } catch (err) {
      console.error("Error loading routes for passenger portal:", err);
    } finally {
      setIsLoadingRoutes(false);
    }
  };

  const fetchLiveBuses = async (routeId: string, routeLabel: string) => {
    try {
      setIsLoadingBuses(true);
      const res = await fetch(
        `${API_BASE_URL}${API_BASE_PATH}/route/${routeId}/live-buses`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to load live buses");
      const data = await res.json();
      const mapped: LiveBus[] = (data.buses || []).map((b: any) => ({
        busNumber: b.bus_id,
        route: routeLabel,
        lastUpdate: new Date(b.last_update).toLocaleTimeString(),
        speed: b.speed_kmph,
        lat: b.lat,
        lng: b.lng,
      }));
      setLiveBuses(mapped);
    } catch (err) {
      console.error("Error loading live buses:", err);
      setLiveBuses([]);
    } finally {
      setIsLoadingBuses(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy < 70) return "default";
    if (occupancy < 90) return "secondary";
    return "destructive";
  };

  const getOccupancyText = (occupancy: number) => {
    if (occupancy < 70) return "Available";
    if (occupancy < 90) return "Filling Fast";
    return "Nearly Full";
  };

  const filteredRoutes = routes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.startPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.endPoint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <h1 className="text-3xl font-bold text-foreground mb-2">Find Your Bus</h1>
        <p className="text-muted-foreground mb-6">Real-time bus tracking for Punjab routes</p>
        
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search routes, destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Routes */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-primary" />
                <span>Popular Routes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoadingRoutes && (
                  <div className="text-sm text-muted-foreground">Loading routes...</div>
                )}
                {!isLoadingRoutes && filteredRoutes.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No routes found. Try a different search.
                  </div>
                )}
                {!isLoadingRoutes && filteredRoutes.map((route) => (
                <div
                  key={route.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    const isSame = selectedRouteId === route.id;
                    const nextSelected = isSame ? null : route.id;
                    setSelectedRouteId(nextSelected);
                    if (!isSame) {
                      fetchLiveBuses(
                        route.id,
                        `${route.startPoint} → ${route.endPoint}`
                      );
                    } else {
                      setLiveBuses([]);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {route.startPoint} → {route.endPoint}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{route.duration || "—"}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{route.stops}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-warning fill-current" />
                          <span>{route.rating}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      Route ID: {route.id}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground">
                        Tap to see live buses on this route
                      </span>
                    </div>
                  </div>

                  {selectedRouteId === route.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Navigation className="h-4 w-4 mr-1" />
                          Track Live
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bookmark className="h-4 w-4 mr-1" />
                          Save Route
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bell className="h-4 w-4 mr-1" />
                          Set Alert
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Departures */}
          <Card>
            <CardHeader>
              <CardTitle>Live Buses on Selected Route</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingBuses && (
                <div className="text-sm text-muted-foreground">
                  Loading live buses...
                </div>
              )}
              {!isLoadingBuses && liveBuses.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Select a route above to see live buses.
                </div>
              )}
              {!isLoadingBuses && liveBuses.map((bus, index) => (
                <div key={index} className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Bus className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{bus.busNumber}</div>
                        <div className="text-sm text-muted-foreground">{bus.route}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Last update: {bus.lastUpdate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Speed: {bus.speed != null ? `${bus.speed} km/h` : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Location: {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                Find Nearest Bus Stop
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <RouteIcon className="h-4 w-4 mr-2" />
                Plan My Journey
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                View Timetable
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Set Bus Alerts
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Live Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="text-sm font-medium text-success">Service Normal</div>
                <div className="text-xs text-muted-foreground">All routes operating on schedule</div>
              </div>
              
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="text-sm font-medium text-warning">Weather Alert</div>
                <div className="text-xs text-muted-foreground">Light rain expected 4-6 PM</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <div className="text-sm text-muted-foreground">
                <p><strong>Helpline:</strong> 1800-123-4567</p>
                <p><strong>Hours:</strong> 5 AM - 11 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PassengerPortal;