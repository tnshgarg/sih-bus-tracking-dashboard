import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Bus, 
  AlertTriangle,
  Settings,
  Database,
  Activity,
  Lock,
  UserPlus,
  RefreshCw,
  Download,
  Upload,
  Server,
  Wifi,
  Power
} from "lucide-react";

const AdminPanel = () => {
  const [systemStatus, setSystemStatus] = useState("operational");

  const systemStats = [
    {
      title: "System Uptime",
      value: "99.97%",
      subtitle: "Last 30 days",
      icon: Activity,
      color: "text-success"
    },
    {
      title: "Active Users",
      value: "1,247",
      subtitle: "Connected now",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "GPS Devices",
      value: "247/250",
      subtitle: "Online buses",
      icon: Bus,
      color: "text-success"
    },
    {
      title: "Data Storage",
      value: "67%",
      subtitle: "Database usage",
      icon: Database,
      color: "text-warning"
    }
  ];

  const alerts = [
    {
      type: "critical",
      title: "Bus PB-3921 GPS Offline",
      description: "Lost connection 15 minutes ago on Amritsar-Pathankot route",
      timestamp: "2 min ago"
    },
    {
      type: "warning", 
      title: "High Server Load",
      description: "API response time increased by 23% in last hour",
      timestamp: "8 min ago"
    },
    {
      type: "info",
      title: "Scheduled Maintenance",
      description: "Database optimization completed successfully",
      timestamp: "1 hour ago"
    }
  ];

  const userAccounts = [
    {
      name: "Rajesh Kumar",
      role: "Transport Officer",
      department: "PRTC Jalandhar",
      lastActive: "Active now",
      status: "active"
    },
    {
      name: "Priya Singh", 
      role: "Route Manager",
      department: "PUNBUS Ludhiana",
      lastActive: "2 hours ago",
      status: "active"
    },
    {
      name: "Amit Sharma",
      role: "System Admin", 
      department: "IT Department",
      lastActive: "1 day ago",
      status: "inactive"
    }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical": return "destructive";
      case "warning": return "secondary";
      case "info": return "default";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Control Panel</h1>
          <p className="text-muted-foreground">System administration and monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={systemStatus === "operational" ? "default" : "destructive"}>
            {systemStatus === "operational" ? "System Operational" : "System Issues"}
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monitoring">System Monitoring</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span>System Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className="p-3 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm text-foreground">{alert.title}</h4>
                      <Badge variant={getAlertColor(alert.type) as any} className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Performance Monitor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span className="font-medium">34%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{width: "34%"}}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{width: "67%"}}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Network Traffic</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{width: "45%"}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Components Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border text-center">
                  <Server className="h-8 w-8 mx-auto mb-2 text-success" />
                  <div className="font-semibold text-foreground">Database Server</div>
                  <Badge variant="default" className="mt-1">Online</Badge>
                </div>
                
                <div className="p-4 rounded-lg border border-border text-center">
                  <Wifi className="h-8 w-8 mx-auto mb-2 text-success" />
                  <div className="font-semibold text-foreground">GPS Services</div>
                  <Badge variant="default" className="mt-1">Connected</Badge>
                </div>
                
                <div className="p-4 rounded-lg border border-border text-center">
                  <Power className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <div className="font-semibold text-foreground">Backup Systems</div>
                  <Badge variant="secondary" className="mt-1">Standby</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Accounts</CardTitle>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Search users..." className="flex-1" />
                  <Button variant="outline">Filter</Button>
                </div>
                
                <div className="space-y-3">
                  {userAccounts.map((user, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.role} • {user.department}</p>
                          <p className="text-xs text-muted-foreground">{user.lastActive}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Backup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <div className="text-sm font-medium text-success">Last Backup: Today 3:00 AM</div>
                  <div className="text-xs text-muted-foreground">All systems backed up successfully</div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Import/Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Route Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Database Cleanup
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">GPS Update Interval</label>
                  <Input value="30 seconds" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Data Retention Period</label>
                  <Input value="90 days" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Alert Threshold</label>
                  <Input value="85% occupancy" />
                </div>
                
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <div className="text-sm font-medium text-success">SSL Certificate Valid</div>
                  <div className="text-xs text-muted-foreground">Expires: March 15, 2025</div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Audit
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Update Passwords
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;