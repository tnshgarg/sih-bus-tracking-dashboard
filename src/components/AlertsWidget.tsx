import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

const AlertsWidget = () => {
  const alerts = [
    { id: 1, severity: "critical", message: "Bus PB-9988 breakdown at Nabha Bypass", time: "5m ago" },
    { id: 2, severity: "high", message: "Route 7 congestion > 20 min delay", time: "15m ago" },
    { id: 3, severity: "medium", message: "Device offline: PB-1234", time: "1h ago" },
  ];

  const counts = {
    critical: alerts.filter(a => a.severity === "critical").length,
    high: alerts.filter(a => a.severity === "high").length,
    medium: alerts.filter(a => a.severity === "medium").length,
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative h-9">
          <Bell className="h-4 w-4 mr-2" />
          Alerts
          {(counts.critical > 0 || counts.high > 0) && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
          <h4 className="font-semibold text-sm">Active Alerts</h4>
          <div className="flex gap-1">
            {counts.critical > 0 && <Badge variant="destructive" className="h-5 px-1.5">{counts.critical}</Badge>}
            {counts.high > 0 && <Badge variant="secondary" className="h-5 px-1.5 bg-orange-100 text-orange-700 hover:bg-orange-200">{counts.high}</Badge>}
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No active alerts
            </div>
          ) : (
            <div className="divide-y">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex gap-3 items-start">
                    {alert.severity === "critical" ? (
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    ) : alert.severity === "high" ? (
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    )}
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 pl-7">
                    <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                      Focus Map
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 text-xs px-2 text-muted-foreground hover:text-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Ack
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AlertsWidget;
