import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShieldCheck, User, Star } from "lucide-react";
import MarketplaceSubmitForm from "@/components/marketplace/MarketplaceSubmitForm";

type FilterType = "all" | "admin" | "user";

const Marketplace = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["marketplace-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select("*")
        .eq("status", "approved")
        .order("is_featured", { ascending: false })
        .order("display_order")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = listings.filter((l) => {
    if (filter === "admin") return l.is_admin_listing;
    if (filter === "user") return !l.is_admin_listing;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4">
              Website <span className="text-gradient-gold">Marketplace</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Browse premium websites for sale. Verified by NORYX or submitted by the community.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-1 glass-card rounded-full p-1">
                <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All</FilterButton>
                <FilterButton active={filter === "admin"} onClick={() => setFilter("admin")}>
                  <ShieldCheck className="h-3.5 w-3.5 mr-1" /> NORYX Picks
                </FilterButton>
                <FilterButton active={filter === "user"} onClick={() => setFilter("user")}>
                  <User className="h-3.5 w-3.5 mr-1" /> Community
                </FilterButton>
              </div>
              <Button variant="hero" size="lg" onClick={() => setShowSubmitForm(true)}>
                Submit Your Website
              </Button>
            </div>
          </motion.div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No listings found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((listing, i) => (
                  <motion.div
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className={`glass-card rounded-2xl overflow-hidden group border-glow transition-all duration-300 ${
                      listing.is_admin_listing
                        ? "ring-1 ring-primary/30"
                        : ""
                    } ${listing.is_featured ? "ring-2 ring-primary/50" : ""}`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-secondary/50 overflow-hidden">
                      {listing.thumbnail_url ? (
                        <img
                          src={listing.thumbnail_url}
                          alt={listing.website_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Preview
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {listing.is_admin_listing && (
                          <Badge className="bg-primary text-primary-foreground font-semibold gap-1 shadow-lg">
                            <ShieldCheck className="h-3 w-3" /> Verified by NORYX
                          </Badge>
                        )}
                        {listing.is_featured && (
                          <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold gap-1 shadow-lg">
                            <Star className="h-3 w-3" /> Featured
                          </Badge>
                        )}
                        {!listing.is_admin_listing && (
                          <Badge variant="secondary" className="font-medium gap-1">
                            <User className="h-3 w-3" /> Community
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-heading font-semibold text-foreground text-lg leading-tight">
                          {listing.website_name}
                        </h3>
                        <span className="text-gradient-gold font-heading font-bold text-xl shrink-0">
                          ${Number(listing.price).toLocaleString()}
                        </span>
                      </div>
                      {listing.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {listing.description}
                        </p>
                      )}
                      <Button variant="heroOutline" size="sm" className="w-full" asChild>
                        <a href={listing.website_url} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" /> View Website
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Submit Form Dialog */}
      <MarketplaceSubmitForm open={showSubmitForm} onOpenChange={setShowSubmitForm} />
    </div>
  );
};

const FilterButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
      active
        ? "bg-primary text-primary-foreground shadow-md"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

export default Marketplace;
