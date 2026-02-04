import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Monitor, Palette, ShoppingCart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Monitor,
    tag: "Conversion-Focused",
    title: "Website Design & Development",
    description: "High-performance websites designed to look great, load fast, and convert visitors into customers. Built for clarity, usability, and scalability.",
    price: "$2,500",
  },
  {
    icon: Palette,
    tag: "Strategic & Distinctive",
    title: "Brand Identity & Visual Design",
    description: "Brand systems that communicate trust, personality, and value — from logos to complete visual identities that scale across platforms.",
    price: "$1,500",
  },
  {
    icon: ShoppingCart,
    tag: "Built to Sell",
    title: "E-Commerce Solutions",
    description: "Custom e-commerce experiences optimized for product discovery, checkout flow, and long-term growth — not just aesthetics.",
    price: "$3,000",
  },
  {
    icon: Users,
    tag: "User-Driven",
    title: "UI/UX & Digital Strategy",
    description: "We design intuitive user experiences backed by research, behavior, and data to improve engagement and conversion rates.",
    price: "$1,200",
  },
];

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} className="section-padding bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/3 blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
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

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group"
              >
                <div className="glass-card border-glow rounded-2xl p-8 lg:p-10 h-full transition-all duration-300 hover:bg-card/90">
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <Icon className="text-gold" size={28} />
                    </div>
                    <span className="text-xs font-medium text-gold uppercase tracking-wider bg-gold/10 px-3 py-1 rounded-full">
                      {service.tag}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-heading font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Starting at</span>
                      <p className="text-2xl font-heading font-bold text-foreground">{service.price}</p>
                    </div>
                    <Button variant="subtle" size="sm" className="group/btn" asChild>
                      <a href="#contact">
                        Get More
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
