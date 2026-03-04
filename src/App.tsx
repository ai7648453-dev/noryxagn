import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Auth from "./pages/Auth";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import PagesManager from "./pages/admin/PagesManager";
import HeroManager from "./pages/admin/HeroManager";
import PortfolioManager from "./pages/admin/PortfolioManager";
import ServicesManager from "./pages/admin/ServicesManager";
import TestimonialsManager from "./pages/admin/TestimonialsManager";
import MediaLibrary from "./pages/admin/MediaLibrary";
import SEOManager from "./pages/admin/SEOManager";
import LeadsManager from "./pages/admin/LeadsManager";
import SettingsManager from "./pages/admin/SettingsManager";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import MarketplaceManager from "./pages/admin/MarketplaceManager";
import FAQManager from "./pages/admin/FAQManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="pages" element={<PagesManager />} />
              <Route path="hero" element={<HeroManager />} />
              <Route path="portfolio" element={<PortfolioManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="testimonials" element={<TestimonialsManager />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="seo" element={<SEOManager />} />
              <Route path="leads" element={<LeadsManager />} />
              <Route path="settings" element={<SettingsManager />} />
              <Route path="marketplace" element={<MarketplaceManager />} />
              <Route path="faq" element={<FAQManager />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
