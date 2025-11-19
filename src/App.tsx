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
import PassengerPortal from "./pages/PassengerPortal";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <main className="flex-1 lg:ml-20 md:ml-20 p-10 md:p-5 lg:p-4">
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
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/passenger" element={<Layout><PassengerPortal /></Layout>} />
          <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
