import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Route,
    Clock,
    MapPin,
    Plus,
    Edit,
    TrendingUp,
    AlertCircle,
    Filter,
} from "lucide-react";

const RouteManagement = () => {
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

    // applied filter states
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [activeBusMin, setActiveBusMin] = useState<number | null>(null);
    const [passengerMin, setPassengerMin] = useState<number | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [frequencyFilter, setFrequencyFilter] = useState<boolean>(false);
    const [peakOccupancyMin, setPeakOccupancyMin] = useState<number | null>(null);

    // UI state for status sublist
    const [statusOpen, setStatusOpen] = useState<boolean>(false);

    // draft states so filters only apply when user clicks "Apply"
    const [draftStatus, setDraftStatus] = useState<string | null>(statusFilter);
    const [draftActiveBusMin, setDraftActiveBusMin] = useState<number | null>(activeBusMin);
    const [draftPassengerMin, setDraftPassengerMin] = useState<number | null>(passengerMin);
    const [draftSearchText, setDraftSearchText] = useState<string>(searchText);
    const [draftFrequencyFilter, setDraftFrequencyFilter] = useState<boolean>(frequencyFilter);
    const [draftPeakOccupancyMin, setDraftPeakOccupancyMin] = useState<number | null>(peakOccupancyMin);

    const routes = [
        {
            id: "R-001",
            name: "Jalandhar → Amritsar Express",
            distance: "74 km",
            avgDuration: "1h 45m",
            activeBuses: 8,
            totalStops: 12,
            dailyPassengers: 2400,
            peakOccupancy: 145,
            status: "optimal",
            frequency: "Every 20 min",
            operatingHours: "5:00 AM - 10:00 PM",
            lastUpdated: "2 min ago",
        },
        {
            id: "R-002",
            name: "Ludhiana → Chandigarh",
            distance: "98 km",
            avgDuration: "2h 15m",
            activeBuses: 12,
            totalStops: 18,
            dailyPassengers: 3200,
            peakOccupancy: 125,
            status: "good",
            frequency: "Every 15 min",
            operatingHours: "4:30 AM - 11:00 PM",
            lastUpdated: "1 min ago",
        },
        {
            id: "R-003",
            name: "Amritsar → Pathankot (Pilgrimage)",
            distance: "112 km",
            avgDuration: "2h 30m",
            activeBuses: 6,
            totalStops: 15,
            dailyPassengers: 1800,
            peakOccupancy: 165,
            status: "overcrowded",
            frequency: "Every 30 min",
            operatingHours: "5:30 AM - 9:30 PM",
            lastUpdated: "Just now",
        },
        {
            id: "R-004",
            name: "Chandigarh → Patiala",
            distance: "67 km",
            avgDuration: "1h 30m",
            activeBuses: 10,
            totalStops: 14,
            dailyPassengers: 2800,
            peakOccupancy: 110,
            status: "optimal",
            frequency: "Every 12 min",
            operatingHours: "5:00 AM - 10:30 PM",
            lastUpdated: "3 min ago",
        },
    ];

    // scheduleData
    const scheduleData = [
        { time: "05:00", buses: 2, occupancy: 45 },
        { time: "06:00", buses: 4, occupancy: 75 },
        { time: "07:00", buses: 6, occupancy: 95 },
        { time: "08:00", buses: 8, occupancy: 125 },
        { time: "09:00", buses: 6, occupancy: 85 },
        { time: "10:00", buses: 4, occupancy: 65 },
        { time: "11:00", buses: 4, occupancy: 55 },
        { time: "12:00", buses: 5, occupancy: 70 },
    ];

    // apply filters (uses applied states, not drafts)
    const filteredRoutes = routes.filter((route) => {
        if (statusFilter && route.status !== statusFilter) return false;
        if (activeBusMin !== null && route.activeBuses < activeBusMin) return false;
        if (passengerMin !== null && route.dailyPassengers < passengerMin) return false;
        if (peakOccupancyMin !== null && route.peakOccupancy < peakOccupancyMin) return false;
        if (frequencyFilter) {
            const parts = route.frequency.split(" ");
            const num = parseInt(parts[1], 10);
            if (!isNaN(num) && num >= 20) return false;
            if (isNaN(num)) return false;
        }
        if (searchText.length > 0 && !route.name.toLowerCase().includes(searchText.toLowerCase())) return false;
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "optimal":
                return "success";
            case "good":
                return "default";
            case "overcrowded":
                return "destructive";
            default:
                return "secondary";
        }
    };

    const getOccupancyColor = (occupancy: number) => {
        if (occupancy < 80) return "text-success";
        if (occupancy < 100) return "text-warning";
        return "text-destructive";
    };

    // Initialize drafts from applied filters when user opens the filter menu
    const initDrafts = () => {
        setDraftStatus(statusFilter);
        setDraftActiveBusMin(activeBusMin);
        setDraftPassengerMin(passengerMin);
        setDraftSearchText(searchText);
        setDraftFrequencyFilter(frequencyFilter);
        setDraftPeakOccupancyMin(peakOccupancyMin);
        setStatusOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Route Management</h1>
                    <p className="text-muted-foreground">
                        Manage routes, schedules, and optimize passenger flow
                    </p>
                </div>

                <div className="flex gap-2">
                    {/* DROPDOWN FILTER BUTTON */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                onClick={initDrafts} // make sure drafts reflect current applied filters
                            >
                                <Filter className="h-4 w-4 mr-2" /> Filter
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-72 p-3 space-y-3">
                            <DropdownMenuLabel>Filters</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* STATUS FILTER (open sub-list without closing the menu) */}
                            <div>
    <button
        type="button"
        className="w-full flex items-center justify-between text-left"
        onClick={(e) => {
            e.stopPropagation();
            setStatusOpen((s) => !s);
        }}
    >
        <span className="text-xs mb-1 text-muted-foreground">Status</span>
        <span className="text-xs text-muted-foreground">{draftStatus ?? "All"}</span>
    </button>

    {statusOpen && (
        <div className="mt-2 space-y-1 pl-2">
            {["optimal", "good", "overcrowded"].map((status) => (
                <DropdownMenuCheckboxItem
                    key={status}
                    checked={draftStatus === status}
                    onClick={(e) => e.stopPropagation()}
                    onSelect={(e) => e.preventDefault()}  // <-- THIS keeps dropdown open
                    onCheckedChange={() =>
                        setDraftStatus(draftStatus === status ? null : status)
                    }
                >
                    {status}
                </DropdownMenuCheckboxItem>
            ))}
        </div>
    )}
</div>

                            {/* ACTIVE BUSES FILTER */}
                            <div>
                                <p className="text-xs mb-1 text-muted-foreground">Min Active Buses</p>
                                <Input
                                    type="number"
                                    placeholder="e.g. 5"
                                    value={draftActiveBusMin === null ? "" : String(draftActiveBusMin)}
                                    onChange={(e) =>
                                        setDraftActiveBusMin(e.target.value === "" ? null : Number(e.target.value))
                                    }
                                />
                            </div>

                            {/* DAILY PASSENGERS */}
                            <div>
                                <p className="text-xs mb-1 text-muted-foreground">Min Daily Passengers</p>
                                <Input
                                    type="number"
                                    placeholder="e.g. 2000"
                                    value={draftPassengerMin === null ? "" : String(draftPassengerMin)}
                                    onChange={(e) =>
                                        setDraftPassengerMin(e.target.value === "" ? null : Number(e.target.value))
                                    }
                                />
                            </div>

                            {/* PEAK OCCUPANCY */}
                            <div>
                                <p className="text-xs mb-1 text-muted-foreground">Min Peak Occupancy (%)</p>
                                <Input
                                    type="number"
                                    placeholder="e.g. 120"
                                    value={draftPeakOccupancyMin === null ? "" : String(draftPeakOccupancyMin)}
                                    onChange={(e) =>
                                        setDraftPeakOccupancyMin(e.target.value === "" ? null : Number(e.target.value))
                                    }
                                />
                            </div>

                            {/* ROUTE NAME SEARCH */}
                            <div>
                                <p className="text-xs mb-1 text-muted-foreground">Search Route Name</p>
                                <Input
                                    placeholder="Search..."
                                    value={draftSearchText}
                                    onChange={(e) => setDraftSearchText(e.target.value)}
                                />
                            </div>

                            {/* FREQUENCY < 20 MIN */}
                            <DropdownMenuCheckboxItem
                                checked={draftFrequencyFilter}
                                onCheckedChange={(v) => setDraftFrequencyFilter(!!v)}
                            >
                                Routes with frequency &lt; 20 min
                            </DropdownMenuCheckboxItem>

                            <DropdownMenuSeparator />
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        // reset both drafts and applied filters
                                        setDraftStatus(null);
                                        setDraftActiveBusMin(null);
                                        setDraftPassengerMin(null);
                                        setDraftSearchText("");
                                        setDraftFrequencyFilter(false);
                                        setDraftPeakOccupancyMin(null);

                                        setStatusFilter(null);
                                        setActiveBusMin(null);
                                        setPassengerMin(null);
                                        setSearchText("");
                                        setFrequencyFilter(false);
                                        setPeakOccupancyMin(null);
                                    }}
                                >
                                    Reset
                                </Button>

                                <Button
                                    className="flex-1"
                                    onClick={() => {
                                        // apply drafts to actual filters
                                        setStatusFilter(draftStatus);
                                        setActiveBusMin(draftActiveBusMin);
                                        setPassengerMin(draftPassengerMin);
                                        setSearchText(draftSearchText);
                                        setFrequencyFilter(draftFrequencyFilter);
                                        setPeakOccupancyMin(draftPeakOccupancyMin);
                                        // close status sub-list
                                        setStatusOpen(false);
                                    }}
                                >
                                    Apply
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button>
                        <Plus className="h-4 w-4 mr-2" /> Add Route
                    </Button>
                </div>
            </div>

            {/* TABS */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="schedules">Schedules</TabsTrigger>
                    <TabsTrigger value="optimization">Optimization</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ROUTE LIST */}
                        <div className="lg:col-span-2 space-y-4">
                            {filteredRoutes.map((route) => (
                                <Card
                                    key={route.id}
                                    className={`cursor-pointer transition-all ${
                                        selectedRoute === route.id ? "border-primary shadow-md" : "hover:shadow-sm"
                                    }`}
                                    onClick={() =>
                                        setSelectedRoute(selectedRoute === route.id ? null : route.id)
                                    }
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{route.name}</CardTitle>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                                    <span className="flex items-center space-x-1">
                                                        <Route className="h-4 w-4" />
                                                        <span>{route.distance}</span>
                                                    </span>
                                                    <span className="flex items-center space-x-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{route.avgDuration}</span>
                                                    </span>
                                                    <span className="flex items-center space-x-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{route.totalStops} stops</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge variant={getStatusColor(route.status) as any}>
                                                {route.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <div className="text-sm text-muted-foreground">Active Buses</div>
                                                <div className="text-xl font-semibold text-foreground">{route.activeBuses}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Daily Passengers</div>
                                                <div className="text-xl font-semibold text-foreground">
                                                    {route.dailyPassengers.toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Peak Occupancy</div>
                                                <div className={`text-xl font-semibold ${getOccupancyColor(route.peakOccupancy)}`}>
                                                    {route.peakOccupancy}%
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Frequency</div>
                                                <div className="text-xl font-semibold text-foreground">{route.frequency}</div>
                                            </div>
                                        </div>

                                        {selectedRoute === route.id && (
                                            <div className="mt-4 pt-4 border-t border-border">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-sm text-muted-foreground mb-1">Operating Hours</div>
                                                        <div className="text-sm font-medium text-foreground">{route.operatingHours}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                                                        <div className="text-sm font-medium text-foreground">{route.lastUpdated}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-4">
                                                    <Button size="sm" variant="outline">
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit Route
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <TrendingUp className="h-4 w-4 mr-1" />
                                                        View Analytics
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Quick Stats & Alerts */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Route Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-muted-foreground">Total Routes</span>
                                            <span className="text-lg font-semibold text-foreground">{routes.length}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-muted-foreground">Active Buses</span>
                                            <span className="text-lg font-semibold text-foreground">
                                                {routes.reduce((sum, r) => sum + r.activeBuses, 0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-muted-foreground">Daily Passengers</span>
                                            <span className="text-lg font-semibold text-foreground">
                                                {routes.reduce((sum, r) => sum + r.dailyPassengers, 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-muted-foreground">Avg Occupancy</span>
                                            <span className="text-lg font-semibold text-warning">
                                                {Math.round(routes.reduce((sum, r) => sum + r.peakOccupancy, 0) / routes.length)}%
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center space-x-2">
                                        <AlertCircle className="h-5 w-5 text-warning" />
                                        <span>Alerts</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                        <div className="text-sm font-medium text-destructive">Route R-003 Overcrowded</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            165% occupancy during peak hours
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                                        <div className="text-sm font-medium text-warning">Delayed Schedule</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Route R-002 running 8 minutes behind
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="schedules" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hourly Schedule Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {scheduleData.map((slot) => (
                                    <div key={slot.time} className="flex items-center justify-between p-3 rounded-lg border border-border">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-lg font-semibold text-foreground">{slot.time}</div>
                                            <div className="text-sm text-muted-foreground">{slot.buses} buses active</div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="text-sm text-muted-foreground">Avg Occupancy:</div>
                                            <Badge variant={slot.occupancy > 100 ? "destructive" : slot.occupancy > 80 ? "secondary" : "default"}>
                                                {slot.occupancy}%
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="optimization" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Route Optimization Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <h4 className="font-medium text-primary mb-2">Increase Frequency on R-003</h4>
                                <p className="text-sm text-muted-foreground">
                                    Add 2 more buses during 7-9 AM to reduce overcrowding by 25%. Expected to improve passenger satisfaction.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                                <h4 className="font-medium text-success mb-2">Optimize R-002 Schedule</h4>
                                <p className="text-sm text-muted-foreground">
                                    Shift 1 bus from off-peak to 6-8 PM slot. Could increase revenue by ₹12,000/month.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                                <h4 className="font-medium text-warning mb-2">New Route Opportunity</h4>
                                <p className="text-sm text-muted-foreground">
                                    Consider direct Jalandhar → Pathankot route. Analysis shows 800+ daily demand.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default RouteManagement;