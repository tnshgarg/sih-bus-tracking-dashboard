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

const LiveTracking = () => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const liveBuses = [
    {
      id: "PB-2501",
      route: "Jalandhar → Amritsar",
      currentLocation: "Near Golden Temple",
      occupancy: 85,
      capacity: 80,
      speed: 45,
      eta: "12 min",
      status: "on-time",
      lat: 31.6340,
      lng: 74.8723,
      nextStops: ["Golden Temple", "Amritsar Bus Stand", "Ram Tirath"]
    },
    {
      id: "PB-1847", 
      route: "Ludhiana → Chandigarh",
      currentLocation: "Rajpura Bypass",
      occupancy: 45,
      capacity: 80,
      speed: 55,
      eta: "8 min",
      status: "early",
      lat: 30.9010,
      lng: 75.8573,
      nextStops: ["ISBT Sector-17", "PGI Chandigarh", "Sector-43"]
    },
    {
      id: "PB-3921",
      route: "Amritsar → Pathankot", 
      currentLocation: "Gurdaspur Junction",
      occupancy: 95,
      capacity: 80,
      speed: 35,
      eta: "15 min",
      status: "delayed",
      lat: 32.0367,
      lng: 75.4056,
      nextStops: ["Pathankot Cantt", "Pathankot Bus Stand"]
    },
    {
      id: "CH-5623",
      route: "Chandigarh → Patiala",
      currentLocation: "Rajpura Market",
      occupancy: 62,
      capacity: 80,
      speed: 50,
      eta: "5 min",
      status: "on-time",
      lat: 30.7333,
      lng: 76.7794,
      nextStops: ["Patiala Bus Stand", "Sheran Wala Gate"]
    }
  ];

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage < 70) return "success";
    if (percentage < 90) return "warning";
    return "destructive";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time": return "success";
      case "delayed": return "destructive";
      case "early": return "default";
      default: return "secondary";
    }
  };

  const filteredBuses = liveBuses.filter(bus => 
    bus.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.currentLocation.toLowerCase().includes(searchQuery.toLowerCase())
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
              {filteredBuses.map((bus, index) => (
                <div
                  key={bus.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  style={{
                    left: `${25 + index * 18}%`,
                    top: `${25 + (index % 2) * 30}%`,
                  }}
                  onClick={() => setSelectedBus(selectedBus === bus.id ? null : bus.id)}
                >
                  <div className={`
                    relative w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all
                    ${getOccupancyColor(bus.occupancy, bus.capacity) === 'success' ? 'bg-success' :
                      getOccupancyColor(bus.occupancy, bus.capacity) === 'warning' ? 'bg-warning' : 'bg-destructive'}
                    ${selectedBus === bus.id ? 'scale-125 ring-4 ring-primary/30' : 'hover:scale-110'}
                  `}>
                    <Bus className="w-4 h-4 text-white absolute top-1 left-1" />
                    
                    {/* Speed indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-bold">
                        {Math.round(bus.speed / 10)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Enhanced Tooltip */}
                  {selectedBus === bus.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-20">
                      <div className="bg-card border border-border rounded-lg p-4 shadow-xl min-w-64">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{bus.id}</span>
                          <Badge variant={getStatusColor(bus.status) as any}>
                            {bus.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{bus.route}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>Occupancy</span>
                            </span>
                            <span className="font-medium">{bus.occupancy}/{bus.capacity}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center space-x-1">
                              <Zap className="h-3 w-3" />
                              <span>Speed</span>
                            </span>
                            <span className="font-medium">{bus.speed} km/h</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>ETA</span>
                            </span>
                            <span className="font-medium">{bus.eta}</span>
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
              {filteredBuses.map((bus) => (
                <div
                  key={bus.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedBus === bus.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedBus(selectedBus === bus.id ? null : bus.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{bus.id}</span>
                    <div className="flex items-center space-x-1">
                      <Badge 
                        variant={getOccupancyColor(bus.occupancy, bus.capacity) as any}
                        className="text-xs"
                      >
                        {Math.round((bus.occupancy / bus.capacity) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{bus.route}</p>
                  <p className="text-xs text-foreground mb-2">📍 {bus.currentLocation}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Next in {bus.eta}</span>
                    {bus.occupancy > bus.capacity && (
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

          {selectedBus && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Stops</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const bus = liveBuses.find(b => b.id === selectedBus);
                  return bus?.nextStops.map((stop, index) => (
                    <div key={index} className="flex items-center space-x-3 py-2">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`} />
                      <span className={`text-sm ${
                        index === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
                      }`}>
                        {stop}
                      </span>
                      {index === 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          Next
                        </Badge>
                      )}
                    </div>
                  ));
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;