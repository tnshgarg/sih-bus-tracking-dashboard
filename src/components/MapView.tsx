import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bus, Navigation2, Maximize, Wifi, WifiOff, BatteryWarning, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLiveBuses } from "@/api/admin";

const MapView = () => {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const { data: buses, isLoading, error } = useQuery({
    queryKey: ["live-buses"],
    queryFn: getLiveBuses,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <Card className="lg:col-span-2 h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Live Fleet Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="lg:col-span-2 h-full flex flex-col">
        <CardHeader>
          <CardTitle>Live Fleet Map</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[400px] text-destructive">
          Failed to load map data
        </CardContent>
      </Card>
    );
  }

  const activeBuses = buses || [];

  return (
    <Card className="lg:col-span-2 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span>Live Fleet Map</span>
          <Badge variant="outline" className="ml-2">{activeBuses.length} Active</Badge>
        </CardTitle>
        <Button size="sm" variant="outline" className="h-8">
          <Maximize className="h-3 w-3 mr-1" />
          Fit to Active
        </Button>
      </CardHeader>
      <CardContent className="flex-1 min-h-[400px] p-0 relative">
        <div className="absolute inset-0 bg-muted/50 overflow-hidden rounded-b-lg">
          {/* Mock Map Background - In a real app this would be Google Maps / Leaflet */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800"></div>
          
          {/* Mock Map Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-foreground/20"></div>
              ))}
            </div>
          </div>

          {/* Bus Markers */}
          {activeBuses.map((bus: any, index: number) => (
            <div
              key={bus.bus_id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
              style={{
                // Mock positioning logic since we don't have a real map projection here
                // We'll just scatter them based on index for demo purposes if lat/lng are close
                left: `${20 + (index * 15) % 60}%`,
                top: `${30 + ((index * 7) % 50)}%`,
              }}
            >
              {/* Marker Pin */}
              <button 
                onClick={() => setActiveMarker(activeMarker === bus.bus_id ? null : bus.bus_id)}
                className={`
                  relative flex items-center justify-center w-8 h-8 rounded-full shadow-xl border-2 border-white transition-transform hover:scale-110
                  ${bus.load_category === 'high' ? 'bg-destructive' : 
                    bus.load_category === 'medium' ? 'bg-warning' : 'bg-success'}
                  ${activeMarker === bus.bus_id ? 'scale-125 ring-4 ring-primary/20 z-20' : ''}
                `}
              >
                <Bus className="w-4 h-4 text-white" />
              </button>
              
              {/* Detailed Popup */}
              {(activeMarker === bus.bus_id) && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-30 w-64">
                  <div className="bg-popover text-popover-foreground rounded-lg shadow-xl border border-border p-3 text-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-base">{bus.bus_id}</div>
                        <div className="text-xs text-muted-foreground">{bus.route_name || "No Route"}</div>
                      </div>
                      <Badge variant={bus.load_category === 'high' ? "destructive" : "outline"}>
                        {bus.passenger_load_pct}% Full
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div className="bg-muted/50 p-1.5 rounded">
                        <span className="text-muted-foreground block">Speed</span>
                        <span className="font-medium">{bus.speed_kmph || 0} km/h</span>
                      </div>
                      <div className="bg-muted/50 p-1.5 rounded">
                        <span className="text-muted-foreground block">Next Stop</span>
                        <span className="font-medium truncate">{bus.next_stop || "N/A"}</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t flex justify-between items-center">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Wifi className="h-3 w-3 text-success" />
                        Online
                      </div>
                      <Button size="sm" variant="ghost" className="h-6 text-xs px-2">
                        Track
                      </Button>
                    </div>
                  </div>
                  {/* Triangle pointer */}
                  <div className="absolute left-1/2 -bottom-2 w-4 h-4 bg-popover border-r border-b border-border transform -translate-x-1/2 rotate-45"></div>
                </div>
              )}
            </div>
          ))}

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="shadow-lg">
              <Navigation2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;