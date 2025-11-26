import Header from "@/components/Header";
import StatsOverview from "@/components/StatsOverview";
import MapView from "@/components/MapView";
import BusCard from "@/components/BusCard";
import { useQuery } from "@tanstack/react-query";
import { getAllLiveBuses } from "@/api/app";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["liveBuses"],
    queryFn: getAllLiveBuses,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const buses = data?.buses || [];

  // Transform API data to match BusCard props
  const transformedBuses = buses.map((bus) => ({
    busNumber: bus.bus_id,
    route: bus.route_name || "Unknown Route",
    currentOccupancy: Math.round(bus.passenger_load_pct),
    maxCapacity: 100,
    eta: bus.eta_minutes ? `${bus.eta_minutes} min` : "N/A",
    status: (bus.load_category === "low" ? "on-time" : 
             bus.load_category === "medium" ? "early" : "delayed") as "on-time" | "early" | "delayed",
    nextStop: bus.next_stop || "Unknown"
  }));

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Punjab Transit Dashboard</h1>
        <p className="text-muted-foreground">Real-time tracking and passenger management for tier-2 cities</p>
      </div>

      <StatsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Map View Removed as per request */}
        <div className="lg:col-span-2 space-y-4">
           {/* Placeholder for future content if needed, or just let the list take more space */}
           <div className="p-6 border rounded-lg bg-muted/20 text-center">
              <p className="text-muted-foreground">Map view is disabled. Please check Live Tracking for detailed bus status.</p>
           </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Live Bus Updates</h3>
          <div className="space-y-3 max-h-80 lg:max-h-96 overflow-y-auto pr-2">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))
            ) : error ? (
              <div className="p-4 border border-destructive rounded-lg">
                <p className="text-sm text-destructive">
                  Failed to load buses. Please ensure the API server is running.
                </p>
              </div>
            ) : transformedBuses.length === 0 ? (
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No active buses at the moment.
                </p>
              </div>
            ) : (
              transformedBuses.slice(0, 4).map((bus, index) => (
                <BusCard key={index} {...bus} />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {!isLoading && !error && transformedBuses.slice(4).map((bus, index) => (
          <BusCard key={index + 4} {...bus} />
        ))}
      </div>
    </div>
  );
};

export default Index;
