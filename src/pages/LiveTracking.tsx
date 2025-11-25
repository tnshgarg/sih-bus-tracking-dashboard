import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Search, 
  Filter, 
  Navigation, 
  Users, 
  Clock,
  AlertTriangle,
  Zap,
  Bus
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllLiveBuses, getBusTrackingData } from "@/api/app";
import { Skeleton } from "@/components/ui/skeleton";

const LiveTracking = () => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all live buses
  const { data, isLoading, error } = useQuery({
    queryKey: ["liveBuses"],
    queryFn: getAllLiveBuses,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch detailed tracking for selected bus
  const { data: trackingData } = useQuery({
    queryKey: ["busTracking", selectedBus],
    queryFn: () => selectedBus ? getBusTrackingData(selectedBus) : null,
    enabled: !!selectedBus,
  });

  const liveBuses = data?.buses || [];

  const getOccupancyColor = (loadPct: number) => {
    if (loadPct < 70) return "success";
    if (loadPct < 90) return "warning";
    return "destructive";
  };

  const getStatusColor = (loadCategory: string) => {
    switch (loadCategory) {
      case "low": return "success";
      case "high": return "destructive";
      default: return "default";
    }
  };

  const filteredBuses = liveBuses.filter(bus => 
    bus.bus_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bus.route_name && bus.route_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (bus.current_stop && bus.current_stop.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Bus Tracking</h1>
          <p className="text-muted-foreground">Real-time monitoring of all active buses</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search buses, routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Live Map View</span>
              <Badge variant="secondary" className="ml-auto">
                {liveBuses.length} Active Buses
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-muted rounded-lg h-96 overflow-hidden">
              {/* Enhanced Mock Map */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/10"></div>
              
              {/* Map Grid */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                  {Array.from({ length: 96 }).map((_, i) => (
                    <div key={i} className="border border-muted-foreground/20"></div>
                  ))}
                </div>
              </div>

              {/* Bus Locations */}
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="h-12 w-32" />
                </div>
              ) : filteredBuses.map((bus, index) => (
                <div
                  key={bus.bus_id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  style={{
                    left: `${25 + index * 18}%`,
                    top: `${25 + (index % 2) * 30}%`,
                  }}
                  onClick={() => setSelectedBus(selectedBus === bus.bus_id ? null : bus.bus_id)}
                >
                  <div className={`
                    relative w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all
                    ${getOccupancyColor(bus.passenger_load_pct) === 'success' ? 'bg-success' :
                      getOccupancyColor(bus.passenger_load_pct) === 'warning' ? 'bg-warning' : 'bg-destructive'}
                    ${selectedBus === bus.bus_id ? 'scale-125 ring-4 ring-primary/30' : 'hover:scale-110'}
                  `}>
                    <Bus className="w-4 h-4 text-white absolute top-1 left-1" />
                    
                    {/* Speed indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-bold">
                        {bus.speed_kmph ? Math.round(bus.speed_kmph / 10) : 0}
                      </span>
                    </div>
                  </div>
                  
                  {/* Enhanced Tooltip */}
                  {selectedBus === bus.bus_id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-20">
                      <div className="bg-card border border-border rounded-lg p-4 shadow-xl min-w-64">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{bus.bus_id}</span>
                          <Badge variant={getStatusColor(bus.load_category) as any}>
                            {bus.load_category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{bus.route_name || 'Unknown Route'}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>Load</span>
                            </span>
                            <span className="font-medium">{Math.round(bus.passenger_load_pct)}%</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center space-x-1">
                              <Zap className="h-3 w-3" />
                              <span>Speed</span>
                            </span>
                            <span className="font-medium">{bus.speed_kmph || 0} km/h</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>ETA</span>
                            </span>
                            <span className="font-medium">{bus.eta_minutes ? `${bus.eta_minutes} min` : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Route Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0.6"/>
                  </linearGradient>
                </defs>
                <path
                  d="M 25% 25% Q 45% 15% 61% 25% Q 75% 35% 79% 55%"
                  stroke="url(#routeGradient)"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  fill="none"
                  className="animate-pulse"
                />
              </svg>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 space-y-2">
                <Button size="sm" variant="secondary">
                  <Navigation className="h-4 w-4 mr-1" />
                  Center
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bus Details Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Live Bus Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))
              ) : error ? (
                <div className="p-4 text-center text-sm text-destructive">
                  Failed to load buses
                </div>
              ) : filteredBuses.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No buses found
                </div>
              ) : filteredBuses.map((bus) => (
                <div
                  key={bus.bus_id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedBus === bus.bus_id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedBus(selectedBus === bus.bus_id ? null : bus.bus_id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{bus.bus_id}</span>
                    <div className="flex items-center space-x-1">
                      <Badge 
                        variant={getOccupancyColor(bus.passenger_load_pct) as any}
                        className="text-xs"
                      >
                        {Math.round(bus.passenger_load_pct)}%
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{bus.route_name || 'Unknown Route'}</p>
                  <p className="text-xs text-foreground mb-2">📍 {bus.current_stop || 'Unknown Location'}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Next in {bus.eta_minutes ? `${bus.eta_minutes} min` : 'N/A'}</span>
                    {bus.passenger_load_pct > 90 && (
                      <div className="flex items-center space-x-1 text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Overcrowded</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedBus && trackingData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stop Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                {trackingData.stop_timeline.map((stop, index) => (
                  <div key={index} className="flex items-center space-x-3 py-2">
                    <div className={`w-2 h-2 rounded-full ${
                      stop.status === 'current' ? 'bg-primary' : 
                      stop.status === 'passed' ? 'bg-success' : 'bg-muted-foreground/30'
                    }`} />
                    <span className={`text-sm ${
                      stop.status === 'current' ? 'font-medium text-foreground' : 'text-muted-foreground'
                    }`}>
                      {stop.name}
                    </span>
                    {stop.status === 'current' && (
                      <Badge variant="secondary" className="ml-auto">
                        Current
                      </Badge>
                    )}
                    {stop.status === 'upcoming' && stop.eta_minutes && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {stop.eta_minutes} min
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;