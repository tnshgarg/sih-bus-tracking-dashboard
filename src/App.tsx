import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Index from "./pages/Index";
import LiveTracking from "./pages/LiveTracking";
import RouteManagement from "./pages/RouteManagement";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import FleetManagement from "./pages/FleetManagement";


const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <main className="flex-1 p-6">
      {children}
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/tracking" element={<Layout><LiveTracking /></Layout>} />
          <Route path="/routes" element={<Layout><RouteManagement /></Layout>} />
          <Route path="/fleet" element={<Layout><FleetManagement /></Layout>} />
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;