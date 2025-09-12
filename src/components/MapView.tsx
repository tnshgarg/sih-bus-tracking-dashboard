import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bus, Navigation2 } from "lucide-react";

const MapView = () => {
  const mockBuses = [
    { id: "PB-2501", lat: 31.3260, lng: 75.5762, route: "Jalandhar → Amritsar", occupancy: 85 },
    { id: "PB-1847", lat: 30.9010, lng: 75.8573, route: "Ludhiana → Chandigarh", occupancy: 45 },
    { id: "PB-3921", lat: 31.6340, lng: 74.8723, route: "Amritsar → Pathankot", occupancy: 95 },
    { id: "CH-5623", lat: 30.7333, lng: 76.7794, route: "Chandigarh → Patiala", occupancy: 62 },
  ];

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span>Live Bus Tracking</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-muted rounded-lg h-64 lg:h-80 overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/10"></div>
          
          {/* Mock Map Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-muted-foreground/10"></div>
              ))}
            </div>
          </div>

          {/* Mock Bus Locations */}
          {mockBuses.map((bus, index) => (
            <div
              key={bus.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{
                left: `${20 + index * 18}%`,
                top: `${30 + (index % 2) * 25}%`,
              }}
            >
              <div className={`
                w-4 h-4 rounded-full border-2 border-white shadow-lg
                ${bus.occupancy > 90 ? 'bg-destructive' : 
                  bus.occupancy > 70 ? 'bg-warning' : 'bg-success'}
                animate-pulse
              `}>
                <Bus className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-48">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{bus.id}</span>
                    <Badge variant={bus.occupancy > 90 ? "destructive" : bus.occupancy > 70 ? "secondary" : "default"}>
                      {bus.occupancy}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{bus.route}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
            <div className="text-xs font-semibold mb-2 text-foreground">Bus Status</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-xs text-muted-foreground">&lt;70% Full</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span className="text-xs text-muted-foreground">70-90% Full</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span className="text-xs text-muted-foreground">&gt;90% Full</span>
              </div>
            </div>
          </div>

          {/* Mock Route Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 20% 30% Q 50% 20% 80% 55%"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 38% 55% Q 60% 70% 74% 30%"
              stroke="hsl(var(--success))"
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;