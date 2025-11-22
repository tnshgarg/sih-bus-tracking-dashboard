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
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";

const Analytics = () => {
  // Ticket Analytics State
  const [boardingStop, setBoardingStop] = useState("");
  const [destinationStop, setDestinationStop] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ticketAnalytics, setTicketAnalytics] = useState<any>(null);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleTicketSearch = async () => {
    if (!boardingStop || !destinationStop) {
      setSearchError("Please enter both boarding and destination stops");
      return;
    }

    setIsLoadingTickets(true);
    setSearchError("");

    try {
      // Build query parameters
      const params = new URLSearchParams({
        boarding_stop: boardingStop,
        destination_stop: destinationStop,
      });

      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      // API Configuration
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || "/etm/v1";
      const API_TOKEN = import.meta.env.VITE_API_TOKEN || "demo_token_12345";

      const response = await fetch(
        `${API_BASE_URL}${API_BASE_PATH}/analytics/route-tickets?${params}`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch ticket analytics");
      }

      const data = await response.json();
      setTicketAnalytics(data);
      setSearchError(""); // Clear any previous errors on success
    } catch (error) {
      console.error("Error fetching ticket analytics:", error);
      
      // Show warning but load demo data
      setSearchError("⚠️ Backend not connected. Showing demo data. To see real data, ensure the backend server is running on http://localhost:3000");
      
      // For demo purposes, set sample data
      setTicketAnalytics({
        search_criteria: {
          boarding_stop: boardingStop,
          destination_stop: destinationStop,
          start_date: startDate || null,
          end_date: endDate || null,
        },
        combined_totals: {
          total_buses: 4,
          total_trips: 12,
          total_tickets: 345,
          total_revenue: 24150.50,
          unique_seats_occupied: 42,
          avg_fare: 70.00,
        },
        buses: [
          {
            bus_id: "PB-05-A-1234",
            route_id: "CHD-GGN-01",
            total_trips: 3,
            total_tickets: 95,
            total_revenue: 6650.00,
            seats_occupied: 12,
            avg_fare: 70.00,
            tickets: [],
          },
          {
            bus_id: "PB-05-A-5678",
            route_id: "CHD-GGN-01",
            total_trips: 3,
            total_tickets: 88,
            total_revenue: 6160.00,
            seats_occupied: 11,
            avg_fare: 70.00,
            tickets: [],
          },
          {
            bus_id: "PB-05-A-9012",
            route_id: "CHD-GGN-02",
            total_trips: 4,
            total_tickets: 112,
            total_revenue: 7840.00,
            seats_occupied: 14,
            avg_fare: 70.00,
            tickets: [],
          },
          {
            bus_id: "PB-05-A-3456",
            route_id: "CHD-GGN-02",
            total_trips: 2,
            total_tickets: 50,
            total_revenue: 3500.50,
            seats_occupied: 5,
            avg_fare: 70.01,
            tickets: [],
          },
        ],
      });
    } finally {
      setIsLoadingTickets(false);
    }
  };

  // Load all tickets on component mount
  const [allTicketsData, setAllTicketsData] = useState<any>(null);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadAllTickets = async () => {
    setIsLoadingAll(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || "/etm/v1";
      const API_TOKEN = import.meta.env.VITE_API_TOKEN || "demo_token_12345";

      // Get all tickets by using wildcard search
      const response = await fetch(
        `${API_BASE_URL}${API_BASE_PATH}/analytics/route-tickets?boarding_stop=&destination_stop=`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch all tickets");
      }

      const data = await response.json();
      setAllTicketsData(data);
    } catch (error) {
      console.error("Error fetching all tickets:", error);
      // Set empty data structure if fails
      setAllTicketsData({
        search_criteria: { boarding_stop: "", destination_stop: "", start_date: null, end_date: null },
        combined_totals: { total_buses: 0, total_trips: 0, total_tickets: 0, total_revenue: 0, unique_seats_occupied: 0, avg_fare: 0 },
        buses: []
      });
    } finally {
      setIsLoadingAll(false);
    }
  };

  const routePerformance = [
    {
      route: "Jalandhar → Amritsar",
      passengers: 2400,
      efficiency: 92,
      revenue: "₹1,44,000",
      satisfaction: 4.2,
      trend: "stable"
    },
    {
      route: "Ludhiana → Chandigarh", 
      passengers: 3200,
      efficiency: 89,
      revenue: "₹2,08,000",
      satisfaction: 4.5,
      trend: "up"
    },
    {
      route: "Amritsar → Pathankot",
      passengers: 1800,
      efficiency: 76,
      revenue: "₹1,26,000",
      satisfaction: 3.8,
      trend: "down"
    },
    {
      route: "Chandigarh → Patiala",
      passengers: 2800,
      efficiency: 94,
      revenue: "₹1,68,000",
      satisfaction: 4.3,
      trend: "up"
    }
  ];

  // Load all tickets on mount
  useEffect(() => {
    loadAllTickets();
  }, []);

  // Filter displayed data based on search
  const displayData = ticketAnalytics || allTicketsData;
  
  // Pagination logic
  const totalBuses = displayData?.buses?.length || 0;
  const totalPages = Math.ceil(totalBuses / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBuses = displayData?.buses?.slice(startIndex, endIndex) || [];
  
  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [displayData]);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-success";
      case "down": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return TrendingUp;
      case "down": return TrendingDown;
      default: return Clock;
    }
  };

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

                {searchError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {searchError}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={handleTicketSearch} 
                    disabled={isLoadingTickets || !boardingStop || !destinationStop}
                    className="flex-1 md:flex-none"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isLoadingTickets ? "Searching..." : "Filter Results"}
                  </Button>
                  {(boardingStop || destinationStop || startDate || endDate) && (
                    <Button 
                      onClick={() => {
                        setBoardingStop("");
                        setDestinationStop("");
                        setStartDate("");
                        setEndDate("");
                        setTicketAnalytics(null);
                        loadAllTickets();
                      }}
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
          {(isLoadingAll || isLoadingTickets) && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p>Loading ticket data...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show data */}
          {displayData && !(isLoadingAll || isLoadingTickets) && (
            <>
              {/* Combined Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>All Ticket Data</CardTitle>
                  {displayData.search_criteria.boarding_stop || displayData.search_criteria.destination_stop ? (
                    <p className="text-sm text-muted-foreground">
                      Filtered: {displayData.search_criteria.boarding_stop || 'Any'} → {displayData.search_criteria.destination_stop || 'Any'}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Showing all tickets from database
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <Bus className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Buses</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {displayData.combined_totals.total_buses}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Trips</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {displayData.combined_totals.total_trips}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Tickets</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {displayData.combined_totals.total_tickets}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Passengers</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {displayData.combined_totals.total_tickets}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Seats Occupied</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {displayData.combined_totals.total_seats_occupied || 0}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Revenue</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        ₹{displayData.combined_totals.total_revenue.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Avg Fare</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        ₹{displayData.combined_totals.avg_fare.toFixed(2)}
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
                  {displayData.buses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Ticket className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No ticket data found</p>
                      <p className="text-sm">Try adding some tickets or adjusting your filters</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {paginatedBuses.map((bus: any, index: number) => (
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

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Tickets Sold</div>
                            <div className="text-lg font-semibold text-foreground">{bus.total_tickets}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Passengers</div>
                            <div className="text-lg font-semibold text-foreground">{bus.total_tickets}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Seats Occupied</div>
                            <div className="text-lg font-semibold text-foreground">{bus.seats_occupied || 0}</div>
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
                              {Math.round((bus.total_tickets / (bus.total_trips * 50)) * 100)}%
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