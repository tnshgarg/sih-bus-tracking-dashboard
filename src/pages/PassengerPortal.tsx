import { useState } from "react";
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
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const popularRoutes = [
    {
      id: "R-001",
      name: "Jalandhar to Amritsar",
      nextBus: "8 min",
      occupancy: 68,
      fare: "₹45",
      rating: 4.2,
      stops: 12,
      duration: "1h 45m"
    },
    {
      id: "R-002", 
      name: "Ludhiana to Chandigarh",
      nextBus: "5 min",
      occupancy: 45,
      fare: "₹65",
      rating: 4.5,
      stops: 18,
      duration: "2h 15m"
    },
    {
      id: "R-003",
      name: "Amritsar to Pathankot",
      nextBus: "12 min",
      occupancy: 95,
      fare: "₹70",
      rating: 3.8,
      stops: 15,
      duration: "2h 30m"
    }
  ];

  const upcomingBuses = [
    {
      busNumber: "PB-2501",
      route: "Jalandhar → Amritsar",
      departure: "2:15 PM",
      platform: "Platform 3",
      occupancy: 68,
      capacity: 80,
      fare: "₹45",
      amenities: ["AC", "WiFi", "USB Charging"]
    },
    {
      busNumber: "PB-1847",
      route: "Ludhiana → Chandigarh", 
      departure: "2:22 PM",
      platform: "Platform 1",
      occupancy: 45,
      capacity: 80,
      fare: "₹65",
      amenities: ["AC", "WiFi", "GPS Tracking"]
    },
    {
      busNumber: "CH-5623",
      route: "Chandigarh → Patiala",
      departure: "2:30 PM", 
      platform: "Platform 2",
      occupancy: 62,
      capacity: 80,
      fare: "₹55",
      amenities: ["AC", "USB Charging", "Emergency Contact"]
    }
  ];

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy < 70) return "success";
    if (occupancy < 90) return "warning";
    return "destructive";
  };

  const getOccupancyText = (occupancy: number) => {
    if (occupancy < 70) return "Available";
    if (occupancy < 90) return "Filling Fast";
    return "Nearly Full";
  };

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
              {popularRoutes.map((route) => (
                <div
                  key={route.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{route.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{route.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{route.stops} stops</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-warning fill-current" />
                          <span>{route.rating}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-foreground">{route.fare}</div>
                      <div className="text-sm text-muted-foreground">per person</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground">Next bus in:</span>
                      <Badge variant="default">{route.nextBus}</Badge>
                    </div>
                    <Badge variant={getOccupancyColor(route.occupancy) as any}>
                      {getOccupancyText(route.occupancy)}
                    </Badge>
                  </div>

                  {selectedRoute === route.id && (
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
              <CardTitle>Upcoming Departures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingBuses.map((bus, index) => (
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
                      <div className="text-lg font-semibold text-foreground">{bus.departure}</div>
                      <div className="text-sm text-muted-foreground">{bus.platform}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {bus.occupancy}/{bus.capacity} passengers
                      </span>
                    </div>
                    <Badge variant={getOccupancyColor(bus.occupancy) as any}>
                      {Math.round((bus.occupancy / bus.capacity) * 100)}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {bus.amenities.map((amenity, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-lg font-semibold text-foreground">{bus.fare}</div>
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