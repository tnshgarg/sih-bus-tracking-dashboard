import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Users, Clock, MapPin } from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      title: "Active Buses",
      value: "247",
      subtitle: "Currently on routes",
      icon: Bus,
      color: "text-primary",
    },
    {
      title: "Total Passengers",
      value: "12,543",
      subtitle: "Live passenger count",
      icon: Users,
      color: "text-success",
    },
    {
      title: "Avg Wait Time",
      value: "8 min",
      subtitle: "Real-time average",
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Route Coverage",
      value: "73",
      subtitle: "Active routes",
      icon: MapPin,
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;