import { Card, CardContent } from "@/components/ui/card";
import { Wifi, WifiOff, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllLiveBuses } from "@/api/app";

const DataQualityPanel = () => {
  const { data } = useQuery({
    queryKey: ["liveBuses"],
    queryFn: getAllLiveBuses,
    refetchInterval: 10000,
  });

  const buses = data?.buses || [];
  
  // Calculate "Stale" buses (last update > 5 mins ago)
  const staleCount = buses.filter(bus => {
    const lastUpdate = new Date(bus.last_update).getTime();
    const now = new Date().getTime();
    return (now - lastUpdate) > 5 * 60 * 1000;
  }).length;

  const activeCount = buses.length;
  const onlinePct = activeCount > 0 ? Math.round(((activeCount - staleCount) / activeCount) * 100) : 100;

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            System Health
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Wifi className="h-3 w-3" /> Online Status
            </div>
            <div className="text-lg font-bold text-success">{onlinePct}%</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <WifiOff className="h-3 w-3" /> Stale Devices
            </div>
            <div className={`text-lg font-bold ${staleCount > 0 ? 'text-warning' : ''}`}>
              {staleCount} <span className="text-xs font-normal text-muted-foreground">buses</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataQualityPanel;
