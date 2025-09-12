import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Clock, 
  AlertTriangle,
  Calendar,
  Download,
  Target,
  DollarSign,
  Zap
} from "lucide-react";

const Analytics = () => {
  const keyMetrics = [
    {
      title: "Passenger Prediction Accuracy",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      description: "AI prediction vs actual passenger counts"
    },
    {
      title: "Overcrowding Reduction",
      value: "31%",
      change: "+8%",
      trend: "up", 
      description: "Since implementing real-time tracking"
    },
    {
      title: "Average Wait Time",
      value: "8.4 min",
      change: "-3.2 min",
      trend: "down",
      description: "Down from 11.6 minutes last month"
    },
    {
      title: "Route Efficiency",
      value: "87%",
      change: "+5%",
      trend: "up",
      description: "Optimal passenger distribution achieved"
    }
  ];

  const routePerformance = [
    {
      route: "Jalandhar → Amritsar",
      passengers: 2400,
      efficiency: 92,
      revenue: "₹1,44,000",
      satisfaction: 4.2,
      trend: "stable"
    },
    {
      route: "Ludhiana → Chandigarh", 
      passengers: 3200,
      efficiency: 89,
      revenue: "₹2,08,000",
      satisfaction: 4.5,
      trend: "up"
    },
    {
      route: "Amritsar → Pathankot",
      passengers: 1800,
      efficiency: 76,
      revenue: "₹1,26,000",
      satisfaction: 3.8,
      trend: "down"
    },
    {
      route: "Chandigarh → Patiala",
      passengers: 2800,
      efficiency: 94,
      revenue: "₹1,68,000",
      satisfaction: 4.3,
      trend: "up"
    }
  ];

  const predictions = [
    {
      time: "Peak Morning (7-9 AM)",
      route: "All Routes",
      expectedLoad: "125-140%",
      recommendation: "Deploy 6 additional buses",
      impact: "Reduce overcrowding by 23%"
    },
    {
      time: "Evening Rush (5-7 PM)",
      route: "Ludhiana → Chandigarh",
      expectedLoad: "110-125%", 
      recommendation: "Add 2 express buses",
      impact: "Improve passenger satisfaction by 15%"
    },
    {
      time: "Weekend (Sat-Sun)",
      route: "Amritsar → Pathankot",
      expectedLoad: "150-165%",
      recommendation: "Increase frequency by 40%",
      impact: "Handle pilgrimage traffic surge"
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-success";
      case "down": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return TrendingUp;
      case "down": return TrendingDown;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Insights</h1>
          <p className="text-muted-foreground">AI-powered predictions and performance analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => {
          const TrendIcon = getTrendIcon(metric.trend);
          return (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <TrendIcon className={`h-4 w-4 ${getTrendColor(metric.trend)}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Route Performance</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="insights">Optimization Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routePerformance.map((route, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">{route.route}</h4>
                      <Badge variant={route.trend === 'up' ? 'default' : route.trend === 'down' ? 'destructive' : 'secondary'}>
                        {route.trend}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Passengers</span>
                        </div>
                        <div className="text-lg font-semibold text-foreground">{route.passengers.toLocaleString()}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Efficiency</span>
                        </div>
                        <div className={`text-lg font-semibold ${
                          route.efficiency > 90 ? 'text-success' : 
                          route.efficiency > 80 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {route.efficiency}%
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Revenue</span>
                        </div>
                        <div className="text-lg font-semibold text-foreground">{route.revenue}</div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          <span className="text-sm text-muted-foreground">Satisfaction</span>
                        </div>
                        <div className="text-lg font-semibold text-foreground">{route.satisfaction}/5</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>AI-Powered Passenger Flow Predictions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div key={index} className="p-4 rounded-lg bg-accent/50 border border-accent">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{prediction.time}</h4>
                        <p className="text-sm text-muted-foreground">{prediction.route}</p>
                      </div>
                      <Badge variant="secondary">{prediction.expectedLoad}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Recommendation</div>
                        <div className="text-sm font-medium text-foreground">{prediction.recommendation}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Expected Impact</div>
                        <div className="text-sm font-medium text-success">{prediction.impact}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Prediction Accuracy Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Prediction accuracy improving by 2.1% monthly</p>
                  <p className="text-xs">ML model learning from real-time data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Critical Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-destructive">Pathankot Route Overcrowding</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Consistent 165% occupancy during pilgrimage seasons
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-warning mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-warning">Schedule Gaps</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        35-minute gaps causing passenger bunching
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Optimization Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <div className="text-sm font-medium text-success">Revenue Increase Potential</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ₹2.4L monthly by optimizing Chandigarh routes
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-sm font-medium text-primary">New Route Opportunity</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Direct Jalandhar-Pathankot could serve 800+ daily passengers
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Smart Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="font-semibold text-foreground mb-2">Dynamic Pricing Implementation</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Implement surge pricing during peak hours (7-9 AM, 5-7 PM) to distribute load and increase revenue by 18%.
                  </p>
                  <Button size="sm">Implement Strategy</Button>
                </div>
                
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="font-semibold text-foreground mb-2">Predictive Bus Deployment</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use weather and event data to pre-deploy buses. Expected to reduce overcrowding by 31%.
                  </p>
                  <Button size="sm">Configure Alerts</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;