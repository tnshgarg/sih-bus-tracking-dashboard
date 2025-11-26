import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Clock, 
  Calendar,
  Download,
  Target,
  DollarSign,
  Search,
  Ticket,
  Bus,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTicketAnalytics, getRealtimeAnalytics } from "@/api/admin";
import { Skeleton } from "@/components/ui/skeleton";

const Analytics = () => {
  // Ticket Analytics State
  const [boardingStop, setBoardingStop] = useState("");
  const [destinationStop, setDestinationStop] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch Ticket Analytics
  const { 
    data: ticketAnalytics, 
    isLoading: isLoadingTickets, 
    error: ticketError,
    refetch: refetchTickets
  } = useQuery({
    queryKey: ["ticketAnalytics", { boardingStop, destinationStop, startDate, endDate }],
    queryFn: () => getTicketAnalytics({
      boarding_stop: boardingStop || undefined,
      destination_stop: destinationStop || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    }),
    // Only refetch when filters change if at least one filter is active or initial load
    enabled: true, 
  });

  // Fetch Realtime Analytics for Route Performance (mocking route performance from realtime data for now)
  const { data: realtimeAnalytics } = useQuery({
    queryKey: ["realtimeAnalytics"],
    queryFn: getRealtimeAnalytics,
  });

  const handleTicketSearch = () => {
    refetchTickets();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setBoardingStop("");
    setDestinationStop("");
    setStartDate("");
    setEndDate("");
    setTimeout(() => refetchTickets(), 0);
  };

  // Pagination logic
  const totalBuses = ticketAnalytics?.buses?.length || 0;
  const totalPages = Math.ceil(totalBuses / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBuses = ticketAnalytics?.buses?.slice(startIndex, endIndex) || [];

  // Mock Route Performance Data (since we don't have a dedicated endpoint for this yet)
  // In a real app, this would come from an aggregation endpoint
  // Fetch Routes for Performance Data
  const { data: routesData } = useQuery({
    queryKey: ["allRoutes"],
    queryFn: () => import("@/api/admin").then(mod => mod.getAllRoutes()),
  });

  const routePerformance = routesData?.routes.map(route => ({
    route: route.name,
    passengers: route.daily_passengers || 0,
    efficiency: route.peak_occupancy ? Math.min(100, Math.round(100 - Math.abs(route.peak_occupancy - 100))) : 85, // Mock efficiency based on occupancy
    revenue: `₹${((route.daily_passengers || 0) * (route.fare_per_km || 2) * (route.distance_km || 20)).toLocaleString()}`, // Estimate revenue
    satisfaction: 4.0 + (Math.random() * 1), // Mock satisfaction
    trend: (route.peak_occupancy || 0) > 90 ? "up" : "stable"
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Insights</h1>
          <p className="text-muted-foreground">Route performance and ticket analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Route Performance</TabsTrigger>
          <TabsTrigger value="tickets">Ticket Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routePerformance.map((route, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">{route.route}</h4>
                      <Badge variant={route.trend === 'up' ? 'default' : route.trend === 'down' ? 'destructive' : 'secondary'}>
                        {route.trend}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Passengers</span>
                        </div>
                        <div className="text-lg font-semibold text-foreground">{route.passengers.toLocaleString()}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Efficiency</span>
                        </div>
                        <div className={`text-lg font-semibold ${
                          route.efficiency > 90 ? 'text-success' : 
                          route.efficiency > 80 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {route.efficiency}%
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Revenue</span>
                        </div>
                        <div className="text-lg font-semibold text-foreground">{route.revenue}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          <span className="text-sm text-muted-foreground">Satisfaction</span>
                        </div>
                        <div className="text-lg font-semibold text-foreground">{route.satisfaction}/5</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-primary" />
                <span>Search & Filter Tickets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="boardingStop">Boarding Stop (Optional)</Label>
                    <Input
                      id="boardingStop"
                      placeholder="Search by boarding stop..."
                      value={boardingStop}
                      onChange={(e) => setBoardingStop(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinationStop">Destination Stop (Optional)</Label>
                    <Input
                      id="destinationStop"
                      placeholder="Search by destination stop..."
                      value={destinationStop}
                      onChange={(e) => setDestinationStop(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date (Optional)</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleTicketSearch} 
                    disabled={isLoadingTickets}
                    className="flex-1 md:flex-none"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isLoadingTickets ? "Searching..." : "Filter Results"}
                  </Button>
                  {(boardingStop || destinationStop || startDate || endDate) && (
                    <Button 
                      onClick={clearFilters}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Show loading state */}
          {isLoadingTickets && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p>Loading ticket data...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show Error State */}
          {ticketError && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-destructive space-y-2">
                  <AlertCircle className="h-12 w-12 mx-auto" />
                  <h3 className="font-semibold text-lg">Error Loading Data</h3>
                  <p className="text-sm">{ticketError instanceof Error ? ticketError.message : "Failed to fetch ticket analytics"}</p>
                  <Button onClick={() => refetchTickets()} variant="outline" className="mt-4">
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show data */}
          {ticketAnalytics && !isLoadingTickets && !ticketError && (
            <>
              {/* Combined Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>All Ticket Data</CardTitle>
                  {ticketAnalytics.search_criteria.boarding_stop || ticketAnalytics.search_criteria.destination_stop ? (
                    <p className="text-sm text-muted-foreground">
                      Filtered: {ticketAnalytics.search_criteria.boarding_stop || 'Any'} → {ticketAnalytics.search_criteria.destination_stop || 'Any'}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Showing all tickets from database
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <Bus className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Buses</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {ticketAnalytics.combined_totals.total_buses}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Trips</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {ticketAnalytics.combined_totals.total_trips}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Tickets</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {ticketAnalytics.combined_totals.total_tickets}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Seats Occupied</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {ticketAnalytics.combined_totals.unique_seats_occupied}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Revenue</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        ₹{ticketAnalytics.combined_totals.total_revenue.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Avg Fare</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        ₹{ticketAnalytics.combined_totals.avg_fare.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Bus Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Bus-wise Analytics ({totalBuses} {totalBuses === 1 ? 'Bus' : 'Buses'})</CardTitle>
                    {totalPages > 1 && (
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {ticketAnalytics.buses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Ticket className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No ticket data found</p>
                      <p className="text-sm">Try adding some tickets or adjusting your filters</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {paginatedBuses.map((bus, index) => (
                      <div key={index} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-foreground text-lg">{bus.bus_id}</h4>
                            <p className="text-sm text-muted-foreground">Route: {bus.route_id}</p>
                          </div>
                          <Badge variant="secondary">
                            {bus.total_trips} {bus.total_trips === 1 ? "Trip" : "Trips"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Tickets Sold</div>
                            <div className="text-lg font-semibold text-foreground">{bus.total_tickets}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Seats Occupied</div>
                            <div className="text-lg font-semibold text-foreground">{bus.seats_occupied}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Revenue</div>
                            <div className="text-lg font-semibold text-foreground">
                              ₹{bus.total_revenue.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Avg Fare</div>
                            <div className="text-lg font-semibold text-foreground">
                              ₹{bus.avg_fare.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Occupancy</div>
                            <div className="text-lg font-semibold text-foreground">
                              {bus.total_trips > 0 ? Math.round((bus.seats_occupied / (bus.total_trips * 50)) * 100) : 0}%
                            </div>
                          </div>
                        </div>
                      </div>
                        ))}
                      </div>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                          <div className="text-sm text-muted-foreground">
                            Showing {startIndex + 1}-{Math.min(endIndex, totalBuses)} of {totalBuses} buses
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Previous
                            </Button>
                            
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                  key={page}
                                  variant={currentPage === page ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(page)}
                                  className="w-10"
                                >
                                  {page}
                                </Button>
                              ))}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                            >
                              Next
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;