import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllLiveBuses } from "@/api/app";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

const TopRoutesSummary = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["liveBuses"],
    queryFn: getAllLiveBuses,
    refetchInterval: 10000,
  });

  const buses = data?.buses || [];

  // Aggregate data by route
  const routeStats = useMemo(() => {
    const stats: Record<string, { name: string; totalLoad: number; count: number; maxLoad: number }> = {};
    
    buses.forEach(bus => {
      const routeName = bus.route_name || "Unknown";
      if (!stats[routeName]) {
        stats[routeName] = { name: routeName, totalLoad: 0, count: 0, maxLoad: 0 };
      }
      stats[routeName].totalLoad += bus.passenger_load_pct;
      stats[routeName].count += 1;
      stats[routeName].maxLoad = Math.max(stats[routeName].maxLoad, bus.passenger_load_pct);
    });

    return Object.values(stats)
      .map(stat => ({
        name: stat.name,
        avgOccupancy: Math.round(stat.totalLoad / stat.count),
        maxOccupancy: Math.round(stat.maxLoad),
        busCount: stat.count
      }))
      .sort((a, b) => b.avgOccupancy - a.avgOccupancy)
      .slice(0, 5);
  }, [buses]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col max-h-[400px]">
      <CardHeader className="pb-3 flex-none">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Top Congested Routes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto">
        <div className="divide-y">
          {routeStats.length === 0 ? (
             <div className="text-center text-muted-foreground py-8">No active route data</div>
          ) : (
            routeStats.map((route, i) => (
              <div key={i} className="p-3 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                <div className="space-y-1">
                  <div className="font-medium text-sm truncate max-w-[180px]" title={route.name}>{route.name}</div>
                  <div className="text-xs text-muted-foreground flex gap-2">
                    <span className={route.avgOccupancy > 80 ? "text-destructive font-medium" : ""}>
                      {route.avgOccupancy}% Avg Load
                    </span>
                    <span>•</span>
                    <span>{route.busCount} Buses</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-[10px] mb-1 bg-muted/50">
                    {route.maxOccupancy > 90 ? "Add Bus" : "Monitor"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopRoutesSummary;
