import Header from "@/components/Header";
import StatsOverview from "@/components/StatsOverview";
import MapView from "@/components/MapView";
import BusCard from "@/components/BusCard";

const Index = () => {
  // Mock data for Punjab bus routes
  const mockBuses = [
    {
      busNumber: "PB-2501",
      route: "Jalandhar → Amritsar (Golden Temple)",
      currentOccupancy: 68,
      maxCapacity: 80,
      eta: "12 min",
      status: "on-time" as const,
      nextStop: "Kartarpur Corridor"
    },
    {
      busNumber: "PB-1847",
      route: "Ludhiana → Chandigarh",
      currentOccupancy: 36,
      maxCapacity: 80,
      eta: "8 min",
      status: "early" as const,
      nextStop: "ISBT Sector-17"
    },
    {
      busNumber: "PB-3921",
      route: "Amritsar → Pathankot (Vaishno Devi)",
      currentOccupancy: 76,
      maxCapacity: 80,
      eta: "15 min",
      status: "delayed" as const,
      nextStop: "Gurdaspur Junction"
    },
    {
      busNumber: "CH-5623",
      route: "Chandigarh → Patiala",
      currentOccupancy: 49,
      maxCapacity: 80,
      eta: "5 min",
      status: "on-time" as const,
      nextStop: "Rajpura Bus Stand"
    },
    {
      busNumber: "PB-7432",
      route: "Patiala → Bathinda",
      currentOccupancy: 72,
      maxCapacity: 80,
      eta: "18 min",
      status: "on-time" as const,
      nextStop: "Sangrur Market"
    },
    {
      busNumber: "JL-9871",
      route: "Jalandhar → Pathankot",
      currentOccupancy: 28,
      maxCapacity: 80,
      eta: "7 min",
      status: "early" as const,
      nextStop: "Dasuya Bypass"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Punjab Transit Dashboard</h1>
        <p className="text-muted-foreground">Real-time tracking and passenger management for tier-2 cities</p>
      </div>

      <StatsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <MapView />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Live Bus Updates</h3>
          <div className="space-y-3 max-h-80 lg:max-h-96 overflow-y-auto pr-2">
            {mockBuses.slice(0, 4).map((bus, index) => (
              <BusCard key={index} {...bus} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockBuses.slice(4).map((bus, index) => (
          <BusCard key={index + 4} {...bus} />
        ))}
      </div>
    </div>
  );
};

export default Index;
