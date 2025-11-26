import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Bus, 
  Users, 
  UserCircle, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  Phone,
  CreditCard,
  MapPin,
  Signal,
  WifiOff
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFleetBuses, getFleetDrivers, getFleetConductors } from "@/api/admin";
import { Skeleton } from "@/components/ui/skeleton";

const FleetManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Fleet Data
  const { data: buses, isLoading: isLoadingBuses } = useQuery({
    queryKey: ["fleetBuses"],
    queryFn: getFleetBuses,
  });

  const { data: drivers, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ["fleetDrivers"],
    queryFn: getFleetDrivers,
  });

  const { data: conductors, isLoading: isLoadingConductors } = useQuery({
    queryKey: ["fleetConductors"],
    queryFn: getFleetConductors,
  });

  // Filter Logic
  const filterData = (data: any[], type: 'bus' | 'driver' | 'conductor') => {
    if (!data) return [];
    const query = searchQuery.toLowerCase();
    
    return data.filter(item => {
      if (type === 'bus') {
        return item.bus_id.toLowerCase().includes(query) || 
               item.status.toLowerCase().includes(query);
      } else {
        return item.name.toLowerCase().includes(query) || 
               item.status.toLowerCase().includes(query) ||
               (type === 'driver' ? item.driver_id : item.conductor_id).toLowerCase().includes(query);
      }
    });
  };

  const filteredBuses = filterData(buses || [], 'bus');
  const filteredDrivers = filterData(drivers || [], 'driver');
  const filteredConductors = filterData(conductors || [], 'conductor');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground">Manage buses, drivers, and conductors</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-background p-1 rounded-lg border w-full max-w-md">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search fleet..." 
          className="border-0 focus-visible:ring-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="buses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="buses" className="flex items-center gap-2">
            <Bus className="h-4 w-4" />
            Buses
            <Badge variant="secondary" className="ml-1">{buses?.length || 0}</Badge>
          </TabsTrigger>
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            Drivers
            <Badge variant="secondary" className="ml-1">{drivers?.length || 0}</Badge>
          </TabsTrigger>
          <TabsTrigger value="conductors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Conductors
            <Badge variant="secondary" className="ml-1">{conductors?.length || 0}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* BUSES TAB */}
        <TabsContent value="buses">
          <Card>
            <CardHeader>
              <CardTitle>Bus Fleet</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingBuses ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredBuses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bus className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No buses found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBuses.map((bus: any) => (
                    <div key={bus.bus_id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bus className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{bus.bus_id}</h3>
                            <p className="text-xs text-muted-foreground">{bus.type}</p>
                          </div>
                        </div>
                        <Badge variant={bus.status === 'active' ? 'default' : 'secondary'}>
                          {bus.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm mt-4">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Capacity</span>
                          <span className="text-foreground font-medium">{bus.capacity} Seats</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Last Seen</span>
                          <span className="text-foreground font-medium">
                            {bus.last_seen ? new Date(bus.last_seen).toLocaleString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DRIVERS TAB */}
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Drivers Directory</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingDrivers ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredDrivers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <UserCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No drivers found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDrivers.map((driver: any) => (
                    <div key={driver.driver_id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserCircle className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{driver.name}</h3>
                            <p className="text-xs text-muted-foreground">ID: {driver.driver_id}</p>
                          </div>
                        </div>
                        <Badge variant={driver.status === 'On Duty' ? 'default' : 'secondary'} className={driver.status === 'On Duty' ? 'bg-green-500 hover:bg-green-600' : ''}>
                          {driver.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm mt-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CreditCard className="h-3 w-3" />
                          <span>{driver.license_no}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{driver.phone}</span>
                        </div>
                        {driver.current_bus && (
                          <div className="flex items-center gap-2 text-primary mt-2 pt-2 border-t">
                            <Bus className="h-3 w-3" />
                            <span className="font-medium">Driving: {driver.current_bus}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONDUCTORS TAB */}
        <TabsContent value="conductors">
          <Card>
            <CardHeader>
              <CardTitle>Conductors Directory</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingConductors ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConductors.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No conductors found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredConductors.map((conductor: any) => (
                    <div key={conductor.conductor_id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{conductor.name}</h3>
                            <p className="text-xs text-muted-foreground">ID: {conductor.conductor_id}</p>
                          </div>
                        </div>
                        <Badge variant={conductor.status === 'On Duty' ? 'default' : 'secondary'} className={conductor.status === 'On Duty' ? 'bg-green-500 hover:bg-green-600' : ''}>
                          {conductor.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm mt-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CreditCard className="h-3 w-3" />
                          <span>{conductor.license_no}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{conductor.phone}</span>
                        </div>
                        {conductor.current_bus && (
                          <div className="flex items-center gap-2 text-primary mt-2 pt-2 border-t">
                            <Bus className="h-3 w-3" />
                            <span className="font-medium">On Bus: {conductor.current_bus}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FleetManagement;
