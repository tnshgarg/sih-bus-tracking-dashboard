import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Route,
  Clock,
  MapPin,
  Plus,
  Edit,
  TrendingUp,
  AlertCircle,
  Filter
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";


// ---------------- API BASE URL ----------------
const API_BASE_URL = "http://localhost:3000/etm/v1";
const AUTH_TOKEN = "Bearer sk-test-1234567890";


// ---------------- SCHEDULE DATA ----------------
const scheduleData = [
  { time: "05:00", buses: 2, occupancy: 45 },
  { time: "06:00", buses: 4, occupancy: 75 },
  { time: "07:00", buses: 6, occupancy: 95 },
  { time: "08:00", buses: 8, occupancy: 125 },
];


// =====================================================================
//                             COMPONENT
// =====================================================================
const RouteManagement = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [routesList, setRoutesList] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------------- ADD ROUTE STATE ----------------
  const [newRoute, setNewRoute] = useState({
    name: "",
    startPoint: "",
    endPoint: "",
    stops: "",
    distance: "",
    avgDuration: "",
    dailyPassengers: "",
    peakOccupancy: "",
    status: "optimal"
  });

  // -------------------------------------------------------
  //        FILTER STATES (fully added & integrated)
  // -------------------------------------------------------
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [passengerMin, setPassengerMin] = useState<number | null>(null);
  const [peakOccupancyMin, setPeakOccupancyMin] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const [statusOpen, setStatusOpen] = useState(false);

  // Drafts
  const [draftStatus, setDraftStatus] = useState<string | null>(null);
  const [draftPassengerMin, setDraftPassengerMin] = useState<number | null>(null);
  const [draftPeakOccupancyMin, setDraftPeakOccupancyMin] = useState<number | null>(null);
  const [draftSearchText, setDraftSearchText] = useState("");

  const initDrafts = () => {
    setDraftStatus(statusFilter);
    setDraftPassengerMin(passengerMin);
    setDraftPeakOccupancyMin(peakOccupancyMin);
    setDraftSearchText(searchText);
    setStatusOpen(false);
  };

  const applyFilters = async () => {
    // Update local filter states
    setStatusFilter(draftStatus);
    setPassengerMin(draftPassengerMin);
    setPeakOccupancyMin(draftPeakOccupancyMin);
    setSearchText(draftSearchText);
    setStatusOpen(false);

    // Fetch routes with backend-supported filters
    await fetchRoutes({
      minDailyPassengers: draftPassengerMin,
      minPeakOccupancy: draftPeakOccupancyMin,
      search: draftSearchText || null,
    });
  };

  const resetFilters = async () => {
    // Reset draft states
    setDraftStatus(null);
    setDraftPassengerMin(null);
    setDraftPeakOccupancyMin(null);
    setDraftSearchText("");

    // Reset actual filter states
    setStatusFilter(null);
    setPassengerMin(null);
    setPeakOccupancyMin(null);
    setSearchText("");

    // Fetch all routes without filters
    await fetchRoutes();
  };

  // ---------------- FETCH ROUTES WITH FILTERS ----------------
  const fetchRoutes = async (filters?: {
    minDailyPassengers?: number | null;
    minPeakOccupancy?: number | null;
    search?: string | null;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters?.minDailyPassengers) {
        params.append("min_daily_passengers", filters.minDailyPassengers.toString());
      }
      
      if (filters?.minPeakOccupancy) {
        params.append("min_peak_occupancy", filters.minPeakOccupancy.toString());
      }
      
      if (filters?.search) {
        params.append("search", filters.search);
      }
      
      const url = `${API_BASE_URL}/routes${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": AUTH_TOKEN,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch routes");
      }

      const data = await response.json();
      
      // Map backend response to frontend format
      const formattedRoutes = data.routes.map((route: any) => ({
        id: `R-${String(route.id).padStart(3, "0")}`,
        name: route.name,
        startPoint: route.start_point,
        endPoint: route.end_point,
        stops: Array.isArray(route.stops) ? route.stops.join(", ") : route.stops,
        distance: String(route.distance_km),
        avgDuration: route.avg_duration,
        dailyPassengers: route.daily_passengers,
        peakOccupancy: route.peak_occupancy,
        status: route.peak_occupancy > 150 ? "overcrowded" : 
                route.peak_occupancy > 100 ? "good" : "optimal",
        lastUpdated: new Date(route.updated_at).toLocaleString()
      }));

      setRoutesList(formattedRoutes);
    } catch (err) {
      console.error("Error fetching routes:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch routes");
    } finally {
      setLoading(false);
    }
  };

  // Fetch routes on component mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  // Filtered Routes (frontend filter for status only, since backend doesn't support it)
  const filteredRoutes = routesList.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal": return "default";
      case "good": return "secondary";
      case "overcrowded": return "destructive";
      default: return "outline";
    }
  };


  // ---------------- HANDLE ADD ROUTE ----------------
  const handleAddRoute = async () => {
    try {
      // Validate required fields
      if (!newRoute.name || !newRoute.startPoint || !newRoute.endPoint ||
          !newRoute.distance || !newRoute.avgDuration || 
          !newRoute.dailyPassengers || !newRoute.peakOccupancy) {
        alert("Please fill in all required fields");
        return;
      }

      // Convert comma-separated stops to array
      const stopsArray = newRoute.stops
        .split(",")
        .map(stop => stop.trim())
        .filter(stop => stop.length > 0);

      // Prepare data for API
      const routeData = {
        name: newRoute.name,
        start_point: newRoute.startPoint,
        end_point: newRoute.endPoint,
        stops: stopsArray,
        distance_km: Number(newRoute.distance),
        avg_duration: newRoute.avgDuration,
        daily_passengers: Number(newRoute.dailyPassengers),
        peak_occupancy: Number(newRoute.peakOccupancy),
      };

      // Call backend API
      const response = await fetch(`${API_BASE_URL}/routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": AUTH_TOKEN,
        },
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create route");
      }

      // Close dialog and reset form
      setOpenAdd(false);
      setNewRoute({
        name: "",
        startPoint: "",
        endPoint: "",
        stops: "",
        distance: "",
        avgDuration: "",
        dailyPassengers: "",
        peakOccupancy: "",
        status: "optimal"
      });

      // Refetch routes to get the updated list
      await fetchRoutes();

      alert("Route created successfully!");
    } catch (error) {
      console.error("Error creating route:", error);
      alert(`Failed to create route: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };


  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Route Management</h1>
          <p className="text-muted-foreground">Manage bus routes and optimize the network</p>
        </div>

        <div className="flex gap-2">

          {/* FILTER DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" onClick={initDrafts}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {(statusFilter || passengerMin || peakOccupancyMin || searchText) && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                    {[statusFilter, passengerMin, peakOccupancyMin, searchText].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-72 p-3 space-y-3">

              <DropdownMenuLabel>Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* STATUS */}
              <div>
                <button
                  className="w-full flex justify-between text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusOpen(!statusOpen);
                  }}
                >
                  <span className="text-xs text-muted-foreground">
                    Status <span className="text-[10px]">(UI only)</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{draftStatus ?? "All"}</span>
                </button>

                {statusOpen && (
                  <div className="mt-2 space-y-1 pl-2">
                    {["optimal", "good", "overcrowded"].map((s) => (
                      <DropdownMenuCheckboxItem
                        key={s}
                        checked={draftStatus === s}
                        onCheckedChange={() =>
                          setDraftStatus(draftStatus === s ? null : s)
                        }
                        onSelect={(e) => e.preventDefault()}
                      >
                        {s}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                )}
              </div>

              {/* PASSENGER MIN */}
              <div>
                <p className="text-xs text-muted-foreground">Min Daily Passengers</p>
                <Input
                  type="number"
                  placeholder="2000"
                  value={draftPassengerMin ?? ""}
                  onChange={(e) =>
                    setDraftPassengerMin(e.target.value ? Number(e.target.value) : null)
                  }
                />
              </div>

              {/* PEAK OCCUPANCY */}
              <div>
                <p className="text-xs text-muted-foreground">Min Peak Occupancy (%)</p>
                <Input
                  type="number"
                  placeholder="120"
                  value={draftPeakOccupancyMin ?? ""}
                  onChange={(e) =>
                    setDraftPeakOccupancyMin(e.target.value ? Number(e.target.value) : null)
                  }
                />
              </div>

              {/* SEARCH */}
              <div>
                <p className="text-xs text-muted-foreground">Search Route Name</p>
                <Input
                  placeholder="Search..."
                  value={draftSearchText}
                  onChange={(e) => setDraftSearchText(e.target.value)}
                />
              </div>

              <DropdownMenuSeparator />

              {/* RESET + APPLY */}
              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
                <Button className="flex-1" onClick={applyFilters}>
                  Apply
                </Button>
              </div>

            </DropdownMenuContent>
          </DropdownMenu>

          {/* ADD ROUTE DIALOG */}
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Bus Route</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 mt-4">

                {/* Route Name */}
                <div className="col-span-2">
                  <label className="text-sm font-medium">Route Name *</label>
                  <Input
                    placeholder="e.g., Jalandhar → Amritsar Express"
                    value={newRoute.name}
                    onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                  />
                </div>

                {/* Start Point */}
                <div>
                  <label className="text-sm font-medium">Start Point *</label>
                  <Input
                    placeholder="e.g., Jalandhar"
                    value={newRoute.startPoint}
                    onChange={(e) => setNewRoute({ ...newRoute, startPoint: e.target.value })}
                  />
                </div>

                {/* End Point */}
                <div>
                  <label className="text-sm font-medium">End Point *</label>
                  <Input
                    placeholder="e.g., Amritsar"
                    value={newRoute.endPoint}
                    onChange={(e) => setNewRoute({ ...newRoute, endPoint: e.target.value })}
                  />
                </div>

                {/* Major Stops */}
                <div className="col-span-2">
                  <label className="text-sm font-medium">Stops (comma-separated)</label>
                  <Input
                    placeholder="e.g., Kartarpur, Beas, Tarn Taran"
                    value={newRoute.stops}
                    onChange={(e) => setNewRoute({ ...newRoute, stops: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter stop names separated by commas
                  </p>
                </div>

                {/* Distance */}
                <div>
                  <label className="text-sm font-medium">Distance (km) *</label>
                  <Input
                    type="number"
                    placeholder="e.g., 74"
                    value={newRoute.distance}
                    onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
                  />
                </div>

                {/* Avg Duration */}
                <div>
                  <label className="text-sm font-medium">Avg Duration *</label>
                  <Input
                    placeholder="e.g., 1h 45m or 45 mins"
                    value={newRoute.avgDuration}
                    onChange={(e) => setNewRoute({ ...newRoute, avgDuration: e.target.value })}
                  />
                </div>

                {/* Daily Passengers */}
                <div>
                  <label className="text-sm font-medium">Daily Passengers *</label>
                  <Input
                    type="number"
                    placeholder="e.g., 2400"
                    value={newRoute.dailyPassengers}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, dailyPassengers: e.target.value })
                    }
                  />
                </div>

                {/* Peak Occupancy */}
                <div>
                  <label className="text-sm font-medium">Peak Occupancy (%) *</label>
                  <Input
                    type="number"
                    placeholder="e.g., 145"
                    value={newRoute.peakOccupancy}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, peakOccupancy: e.target.value })
                    }
                  />
                </div>

                {/* Status Dropdown */}
                <div className="col-span-2">
                  <label className="text-sm font-medium">Status (UI only)</label>
                  <Select
                    value={newRoute.status}
                    onValueChange={(v) => setNewRoute({ ...newRoute, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="optimal">Optimal</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="overcrowded">Overcrowded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setOpenAdd(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRoute}>Save Route</Button>
              </DialogFooter>

            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="overview" className="space-y-4">

        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>


        {/* ---------------- OVERVIEW TAB ---------------- */}
        <TabsContent value="overview">
          
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Loading routes...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-12">
              <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <div>
                      <h3 className="font-semibold text-lg">Error Loading Routes</h3>
                      <p className="text-muted-foreground text-sm mt-2">{error}</p>
                    </div>
                    <Button onClick={() => fetchRoutes()}>Retry</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Routes List */}
          {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ROUTE LIST */}
            <div className="lg:col-span-2 space-y-4">
              {filteredRoutes.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <Route className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg">No Routes Found</h3>
                    <p className="text-muted-foreground text-sm mt-2">
                      {routesList.length === 0 
                        ? "Start by adding your first route" 
                        : "No routes match your filters"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredRoutes.map((route) => (
                <Card
                  key={route.id}
                  className={`cursor-pointer transition-all ${
                    selectedRoute === route.id
                      ? "border-primary shadow-md"
                      : "hover:shadow-sm"
                  }`}
                  onClick={() =>
                    setSelectedRoute(selectedRoute === route.id ? null : route.id)
                  }
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{route.name}</CardTitle>

                        <div className="text-sm text-muted-foreground mt-2 space-x-4">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{route.startPoint} → {route.endPoint}</span>
                          </span>

                          <span className="flex items-center space-x-1">
                            <Route className="w-4 h-4" />
                            <span>{route.distance} km</span>
                          </span>

                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{route.avgDuration}</span>
                          </span>
                        </div>

                        <div className="text-xs text-muted-foreground mt-1">
                          Stops: {route.stops}
                        </div>
                      </div>

                      <Badge variant={getStatusColor(route.status)}>
                        {route.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Daily Passengers</div>
                        <div className="text-lg font-semibold">{route.dailyPassengers}</div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">Peak Occupancy</div>
                        <div className="text-lg font-semibold">{route.peakOccupancy}%</div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">Last Updated</div>
                        <div className="text-lg font-medium">{route.lastUpdated}</div>
                      </div>
                    </div>

                    {selectedRoute === route.id && (
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit Route
                        </Button>

                        <Button variant="outline" size="sm">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          View Analytics
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )))}
            </div>


            {/* QUICK STATS */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Route Statistics</CardTitle>
                </CardHeader>
                <CardContent>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Routes</span>
                    <span className="font-semibold">{filteredRoutes.length}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Daily Passengers</span>
                    <span className="font-semibold">
                      {filteredRoutes.reduce((sum, r) => sum + r.dailyPassengers, 0)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Peak Occupancy</span>
                    <span className="font-semibold">
                      {filteredRoutes.length > 0
                        ? Math.round(
                            filteredRoutes.reduce((sum, r) => sum + r.peakOccupancy, 0) /
                              filteredRoutes.length
                          )
                        : 0}%
                    </span>
                  </div>

                </CardContent>
              </Card>

              {/* ALERTS */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    Alerts
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="p-3 border border-red-300 bg-red-50 rounded-md">
                    <div className="font-medium text-red-600">Route R-003 Overcrowded</div>
                    <div className="text-xs text-muted-foreground">
                      Peak occupancy 165% during morning hours.
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
          )}
        </TabsContent>


        {/* ---------------- SCHEDULE TAB ---------------- */}
        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Schedule Overview</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {scheduleData.map((slot) => (
                  <div key={slot.time} className="flex justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-semibold">{slot.time}</div>
                      <div className="text-muted-foreground text-sm">{slot.buses} buses active</div>
                    </div>

                    <Badge
                      variant={
                        slot.occupancy > 100
                          ? "destructive"
                          : slot.occupancy > 80
                          ? "secondary"
                          : "default"
                      }
                    >
                      {slot.occupancy}%
                    </Badge>

                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* ---------------- OPTIMIZATION TAB ---------------- */}
        <TabsContent value="optimization">
          <Card>
            <CardHeader>
              <CardTitle>Route Optimization Recommendations</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
                <h4 className="font-medium text-primary">Increase Frequency on R-003</h4>
                <p className="text-sm text-muted-foreground">
                  Add 2 buses during morning peak hours to reduce overcrowding by 25%.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="font-medium text-yellow-700">New Route Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  High demand detected for direct Jalandhar → Pathankot route.
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
