import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Users, Clock, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRealtimeAnalytics } from "@/api/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import DetailModal from "./DetailModal";

const StatsOverview = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ["realtimeAnalytics"],
    queryFn: getRealtimeAnalytics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              Failed to load analytics. Please ensure the API server is running.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const timestamp = new Date().toLocaleTimeString();

  const stats = [
    {
      id: "active_buses",
      title: "Active Buses",
      value: analytics?.active_buses.toString() || "0",
      subtitle: "Currently on routes",
      icon: Bus,
      color: "text-primary",
      trend: "stable",
    },
    {
      id: "avg_speed",
      title: "Avg Speed",
      value: `${analytics?.avg_speed_kmph.toFixed(1) || "0"} km/h`,
      subtitle: "Real-time average",
      icon: Clock,
      color: "text-warning",
      trend: "down",
    },
    {
      id: "low_crowding",
      title: "Low Crowding",
      value: analytics?.crowding_breakdown.low.toString() || "0",
      subtitle: "Buses with low load",
      icon: Users,
      color: "text-success",
      trend: "up",
    },
    {
      id: "high_crowding",
      title: "High Crowding",
      value: analytics?.crowding_breakdown.high.toString() || "0",
      subtitle: "Buses with high load",
      icon: MapPin,
      color: "text-destructive",
      trend: "up",
    },
  ];

  const selectedStat = stats.find(s => s.id === selectedMetric);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card 
            key={stat.id} 
            className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-primary"
            onClick={() => setSelectedMetric(stat.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex justify-between items-end mt-1">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  <p className="text-[10px] font-medium text-primary/80 mt-0.5">{stat.context}</p>
                </div>
                <span className="text-[10px] text-muted-foreground/60">Updated: {timestamp}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedStat && (
        <DetailModal
          isOpen={!!selectedMetric}
          onClose={() => setSelectedMetric(null)}
          title={selectedStat.title}
          metricValue={selectedStat.value}
          trend={selectedStat.trend as any}
          trendValue="5% vs last hour"
          context={selectedStat.context}
          recommendations={selectedStat.recommendations}
          topEvents={[
            { time: "10:30 AM", event: "Shift change peak started", impact: "High" },
            { time: "09:15 AM", event: "Traffic jam reported at Main Chowk", impact: "Medium" }
          ]}
        />
      )}
    </>
  );
};

export default StatsOverview;