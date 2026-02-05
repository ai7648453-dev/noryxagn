import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Category = "all" | "web-design" | "branding" | "e-commerce" | "ui-ux";

const categoryLabels: Record<Category, string> = {
  "all": "All",
  "web-design": "Web Design",
  "branding": "Branding",
  "e-commerce": "E-Commerce",
  "ui-ux": "UI/UX",
};

const PortfolioGrid = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const categories: Category[] = ["all", "web-design", "branding", "e-commerce", "ui-ux"];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gold text-background"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/3] bg-muted/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg">
              No projects found. Check back soon!
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl bg-muted/30 border border-border/50 transition-all duration-500 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5">
                  {/* Thumbnail */}
                  <div className="aspect-[4/3] overflow-hidden">
                    {project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <span className="text-4xl font-heading font-bold text-muted-foreground/30">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <span className="text-xs uppercase tracking-widest text-gold mb-2">
                      {categoryLabels[project.category as Category]}
                    </span>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    {project.project_link && (
                      <Button variant="hero" size="sm" asChild>
                        <a href={project.project_link} target="_blank" rel="noopener noreferrer">
                          View Project <ExternalLink className="ml-2" size={14} />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Info below card on mobile */}
                <div className="mt-4 md:hidden">
                  <span className="text-xs uppercase tracking-widest text-gold">
                    {categoryLabels[project.category as Category]}
                  </span>
                  <h3 className="text-lg font-heading font-bold text-foreground mt-1">
                    {project.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PortfolioGrid;
