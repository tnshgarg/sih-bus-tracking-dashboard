import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Route, 
  Clock, 
  Users, 
  MapPin,
  Plus,
  Edit,
  TrendingUp,
  AlertCircle,
  Calendar,
  Filter
} from "lucide-react";

const RouteManagement = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const routes = [
    {
      id: "R-001",
      name: "Jalandhar → Amritsar Express",
      distance: "74 km",
      avgDuration: "1h 45m",
      activeBuses: 8,
      totalStops: 12,
      dailyPassengers: 2400,
      peakOccupancy: 145,
      status: "optimal",
      frequency: "Every 20 min",
      operatingHours: "5:00 AM - 10:00 PM",
      lastUpdated: "2 min ago"
    },
    {
      id: "R-002", 
      name: "Ludhiana → Chandigarh",
      distance: "98 km",
      avgDuration: "2h 15m",
      activeBuses: 12,
      totalStops: 18,
      dailyPassengers: 3200,
      peakOccupancy: 125,
      status: "good",
      frequency: "Every 15 min",
      operatingHours: "4:30 AM - 11:00 PM",
      lastUpdated: "1 min ago"
    },
    {
      id: "R-003",
      name: "Amritsar → Pathankot (Pilgrimage)",
      distance: "112 km", 
      avgDuration: "2h 30m",
      activeBuses: 6,
      totalStops: 15,
      dailyPassengers: 1800,
      peakOccupancy: 165,
      status: "overcrowded",
      frequency: "Every 30 min",
      operatingHours: "5:30 AM - 9:30 PM",
      lastUpdated: "Just now"
    },
    {
      id: "R-004",
      name: "Chandigarh → Patiala",
      distance: "67 km",
      avgDuration: "1h 30m", 
      activeBuses: 10,
      totalStops: 14,
      dailyPassengers: 2800,
      peakOccupancy: 110,
      status: "optimal",
      frequency: "Every 12 min",
      operatingHours: "5:00 AM - 10:30 PM",
      lastUpdated: "3 min ago"
    }
  ];

  const scheduleData = [
    { time: "05:00", buses: 2, occupancy: 45 },
    { time: "06:00", buses: 4, occupancy: 75 },
    { time: "07:00", buses: 6, occupancy: 95 },
    { time: "08:00", buses: 8, occupancy: 125 },
    { time: "09:00", buses: 6, occupancy: 85 },
    { time: "10:00", buses: 4, occupancy: 65 },
    { time: "11:00", buses: 4, occupancy: 55 },
    { time: "12:00", buses: 5, occupancy: 70 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal": return "success";
      case "good": return "default";
      case "overcrowded": return "destructive";
      default: return "secondary";
    }
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy < 80) return "text-success";
    if (occupancy < 100) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Route Management</h1>
          <p className="text-muted-foreground">Manage routes, schedules, and optimize passenger flow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Route
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Route List */}
            <div className="lg:col-span-2 space-y-4">
              {routes.map((route) => (
                <Card 
                  key={route.id}
                  className={`cursor-pointer transition-all ${
                    selectedRoute === route.id ? 'border-primary shadow-md' : 'hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{route.name}</CardTitle>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Route className="h-4 w-4" />
                            <span>{route.distance}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{route.avgDuration}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{route.totalStops} stops</span>
                          </span>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(route.status) as any}>
                        {route.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Active Buses</div>
                        <div className="text-xl font-semibold text-foreground">{route.activeBuses}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Daily Passengers</div>
                        <div className="text-xl font-semibold text-foreground">
                          {route.dailyPassengers.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Peak Occupancy</div>
                        <div className={`text-xl font-semibold ${getOccupancyColor(route.peakOccupancy)}`}>
                          {route.peakOccupancy}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Frequency</div>
                        <div className="text-xl font-semibold text-foreground">{route.frequency}</div>
                      </div>
                    </div>
                    
                    {selectedRoute === route.id && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Operating Hours</div>
                            <div className="text-sm font-medium text-foreground">{route.operatingHours}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                            <div className="text-sm font-medium text-foreground">{route.lastUpdated}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Route
                          </Button>
                          <Button size="sm" variant="outline">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            View Analytics
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Route Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Total Routes</span>
                      <span className="text-lg font-semibold text-foreground">{routes.length}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Active Buses</span>
                      <span className="text-lg font-semibold text-foreground">
                        {routes.reduce((sum, route) => sum + route.activeBuses, 0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Daily Passengers</span>
                      <span className="text-lg font-semibold text-foreground">
                        {routes.reduce((sum, route) => sum + route.dailyPassengers, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Avg Occupancy</span>
                      <span className="text-lg font-semibold text-warning">
                        {Math.round(routes.reduce((sum, route) => sum + route.peakOccupancy, 0) / routes.length)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    <span>Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="text-sm font-medium text-destructive">Route R-003 Overcrowded</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      165% occupancy during peak hours
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="text-sm font-medium text-warning">Delayed Schedule</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Route R-002 running 8 minutes behind
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduleData.map((slot) => (
                  <div key={slot.time} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-semibold text-foreground">{slot.time}</div>
                      <div className="text-sm text-muted-foreground">{slot.buses} buses active</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-muted-foreground">Avg Occupancy:</div>
                      <Badge variant={slot.occupancy > 100 ? "destructive" : slot.occupancy > 80 ? "secondary" : "default"}>
                        {slot.occupancy}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-medium text-primary mb-2">Increase Frequency on R-003</h4>
                <p className="text-sm text-muted-foreground">
                  Add 2 more buses during 7-9 AM to reduce overcrowding by 25%. Expected to improve passenger satisfaction.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                <h4 className="font-medium text-success mb-2">Optimize R-002 Schedule</h4>
                <p className="text-sm text-muted-foreground">
                  Shift 1 bus from off-peak to 6-8 PM slot. Could increase revenue by ₹12,000/month.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                <h4 className="font-medium text-warning mb-2">New Route Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  Consider direct Jalandhar → Pathankot route. Analysis shows 800+ daily demand.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RouteManagement;