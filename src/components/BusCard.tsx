import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, Users, Clock, Navigation } from "lucide-react";

interface BusCardProps {
  busNumber: string;
  route: string;
  currentOccupancy: number;
  maxCapacity: number;
  eta: string;
  status: "on-time" | "delayed" | "early";
  nextStop: string;
}

const BusCard = ({
  busNumber,
  route,
  currentOccupancy,
  maxCapacity,
  eta,
  status,
  nextStop,
}: BusCardProps) => {
  const occupancyPercentage = (currentOccupancy / maxCapacity) * 100;
  
  const getOccupancyColor = () => {
    if (occupancyPercentage < 70) return "text-success";
    if (occupancyPercentage < 90) return "text-warning";
    return "text-destructive";
  };

  const getOccupancyBg = () => {
    if (occupancyPercentage < 70) return "bg-success/10 border-success/20";
    if (occupancyPercentage < 90) return "bg-warning/10 border-warning/20";
    return "bg-destructive/10 border-destructive/20";
  };

  const getStatusColor = () => {
    switch (status) {
      case "on-time": return "bg-success";
      case "delayed": return "bg-destructive";
      case "early": return "bg-primary";
      default: return "bg-muted";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bus className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">{busNumber}</span>
          </div>
          <Badge className={getStatusColor()}>
            {status}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">{route}</div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className={`p-3 rounded-lg border ${getOccupancyBg()}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Occupancy</span>
            </div>
            <span className={`text-sm font-semibold ${getOccupancyColor()}`}>
              {currentOccupancy}/{maxCapacity}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                occupancyPercentage < 70
                  ? "bg-success"
                  : occupancyPercentage < 90
                  ? "bg-warning"
                  : "bg-destructive"
              }`}
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">ETA</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{eta}</span>
        </div>

        <div className="flex items-center space-x-1">
          <Navigation className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Next: {nextStop}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusCard;