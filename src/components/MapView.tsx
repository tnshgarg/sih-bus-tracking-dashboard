import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bus, Navigation2, Maximize, Wifi, WifiOff, BatteryWarning } from "lucide-react";
import { useState } from "react";

const MapView = () => {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const mockBuses = [
    { id: "PB-2501", lat: 31.3260, lng: 75.5762, route: "Jalandhar → Amritsar", occupancy: 85, eta: "12m", lastPing: "10s ago", status: "ok" },
    { id: "PB-1847", lat: 30.9010, lng: 75.8573, route: "Ludhiana → Chandigarh", occupancy: 45, eta: "5m", lastPing: "2s ago", status: "ok" },
    { id: "PB-3921", lat: 31.6340, lng: 74.8723, route: "Amritsar → Pathankot", occupancy: 95, eta: "25m", lastPing: "45s ago", status: "stale" },
    { id: "CH-5623", lat: 30.7333, lng: 76.7794, route: "Chandigarh → Patiala", occupancy: 62, eta: "8m", lastPing: "5s ago", status: "ok" },
    { id: "PB-9988", lat: 30.5333, lng: 76.5794, route: "Patiala → Nabha", occupancy: 12, eta: "Stopped", lastPing: "5m ago", status: "offline" },
  ];

  return (
    <Card className="lg:col-span-2 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span>Live Fleet Map</span>
          <Badge variant="outline" className="ml-2">{mockBuses.length} Active</Badge>
        </CardTitle>
        <Button size="sm" variant="outline" className="h-8">
          <Maximize className="h-3 w-3 mr-1" />
          Fit to Active
        </Button>
      </CardHeader>
      <CardContent className="flex-1 min-h-[400px] p-0 relative">
        <div className="absolute inset-0 bg-muted/50 overflow-hidden rounded-b-lg">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800"></div>
          
          {/* Mock Map Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-foreground/20"></div>
              ))}
            </div>
          </div>

          {/* Mock Bus Markers */}
          {mockBuses.map((bus, index) => (
            <div
              key={bus.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + (index % 3) * 20}%`,
              }}
            >
              {/* Marker Pin */}
              <button 
                onClick={() => setActiveMarker(activeMarker === bus.id ? null : bus.id)}
                className={`
                  relative flex items-center justify-center w-8 h-8 rounded-full shadow-xl border-2 border-white transition-transform hover:scale-110
                  ${bus.occupancy > 90 ? 'bg-destructive' : 
                    bus.occupancy > 70 ? 'bg-warning' : 'bg-success'}
                  ${activeMarker === bus.id ? 'scale-125 ring-4 ring-primary/20 z-20' : ''}
                `}
              >
                <Bus className="w-4 h-4 text-white" />
                {bus.status !== 'ok' && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white flex items-center justify-center">
                    {bus.status === 'offline' ? <WifiOff className="w-2 h-2 text-white" /> : <BatteryWarning className="w-2 h-2 text-white" />}
                  </span>
                )}
              </button>
              
              {/* Detailed Popup */}
              {(activeMarker === bus.id || false) && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-30 w-64">
                  <div className="bg-popover text-popover-foreground rounded-lg shadow-xl border border-border p-3 text-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-base">{bus.id}</div>
                        <div className="text-xs text-muted-foreground">{bus.route}</div>
                      </div>
                      <Badge variant={bus.occupancy > 90 ? "destructive" : "outline"}>
                        {bus.occupancy}% Full
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div className="bg-muted/50 p-1.5 rounded">
                        <span className="text-muted-foreground block">ETA Next</span>
                        <span className="font-medium">{bus.eta}</span>
                      </div>
                      <div className="bg-muted/50 p-1.5 rounded">
                        <span className="text-muted-foreground block">Last Ping</span>
                        <span className={`font-medium ${bus.status === 'ok' ? 'text-success' : 'text-destructive'}`}>
                          {bus.lastPing}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t flex justify-between items-center">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {bus.status === 'ok' ? <Wifi className="h-3 w-3 text-success" /> : <WifiOff className="h-3 w-3 text-destructive" />}
                        Device {bus.status.toUpperCase()}
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