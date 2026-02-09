import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Monitor, Palette, ShoppingCart, Users, Smartphone, Code, PenTool, BarChart3, Globe, Zap, Layers, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, LucideIcon> = {
  Monitor, Palette, ShoppingCart, Users, Smartphone, Code, PenTool, BarChart3, Globe, Zap, Layers,
};

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("is_enabled", true).order("display_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="services" ref={ref} className="section-padding bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/3 blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-gold border border-gold/30 rounded-full bg-gold/5 mb-6">
            Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
            What We Do <span className="text-gradient-gold">Best</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon_name || "Monitor"] || Monitor;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group"
              >
                <div className="glass-card border-glow rounded-2xl p-8 lg:p-10 h-full transition-all duration-300 hover:bg-card/90">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <Icon className="text-gold" size={28} />
                    </div>
                    {service.tag && (
                      <span className="text-xs font-medium text-gold uppercase tracking-wider bg-gold/10 px-3 py-1 rounded-full">
                        {service.tag}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl lg:text-2xl font-heading font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <div>
                      {service.price && (
                        <>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Starting at</span>
                          <p className="text-2xl font-heading font-bold text-foreground">{service.price}</p>
                        </>
                      )}
                    </div>
                    <Button variant="subtle" size="sm" className="group/btn" asChild>
                      <a href="#contact">
                        {service.cta_text || "Get More"}
                        <ArrowRight className="ml-1 group-hover/btn:translate-x-1 transition-transform" size={16} />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
