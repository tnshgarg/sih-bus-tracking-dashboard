import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  metricValue?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  context?: string;
  historyData?: number[]; // Mock data for sparkline
  topEvents?: Array<{ time: string; event: string; impact: string }>;
  recommendations?: string[];
}

const DetailModal = ({
  isOpen,
  onClose,
  title,
  metricValue,
  trend,
  trendValue,
  context,
  historyData = [40, 35, 45, 50, 48, 55, 60, 58, 62, 65, 55, 50], // Default mock
  topEvents = [],
  recommendations = []
}: DetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {title}
            {trend && (
              <Badge variant={trend === "up" ? "default" : trend === "down" ? "destructive" : "secondary"}>
                {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {trendValue}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {context}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Main Metric & Sparkline */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="col-span-1 bg-muted/30">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold">{metricValue}</div>
                <div className="text-xs text-muted-foreground mt-1">Current Value</div>
              </CardContent>
            </Card>
            <Card className="col-span-2">
              <CardContent className="pt-6">
                <div className="h-16 flex items-end gap-1">
                  {historyData.map((val, i) => (
                    <div 
                      key={i} 
                      className="bg-primary/20 hover:bg-primary/40 transition-colors rounded-t w-full"
                      style={{ height: `${val}%` }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>24h ago</span>
                  <span>Now</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Events */}
          {topEvents.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Recent Contributing Events
              </h4>
              <div className="space-y-2">
                {topEvents.map((event, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded bg-muted/50 text-sm">
                    <div className="flex gap-3">
                      <span className="text-muted-foreground font-mono text-xs">{event.time}</span>
                      <span>{event.event}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{event.impact}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Recommended Actions
              </h4>
              <ul className="space-y-2">
                {recommendations.map((rec, i) => (
                  <li key={i} className="text-sm flex gap-2 items-start">
                    <span className="text-primary">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
