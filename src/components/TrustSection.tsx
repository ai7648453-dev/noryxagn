import { motion } from "framer-motion";
import { Bot, Globe, BarChart3, Cpu } from "lucide-react";

const trustItems = [
  { icon: Bot, label: "AI Automation", desc: "Smart systems that work while you sleep" },
  { icon: Globe, label: "High-Converting Websites", desc: "Built to turn visitors into customers" },
  { icon: BarChart3, label: "Data-Driven Ads", desc: "Campaigns optimized by real performance data" },
  { icon: Cpu, label: "Scalable Systems", desc: "Infrastructure that grows with your business" },
];

const TrustSection = () => {
  return (
    <section className="py-16 md:py-20 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-muted-foreground mb-12 text-lg max-w-2xl mx-auto"
        >
          We help businesses leverage AI and modern technology to accelerate growth, automate workflows, and dominate their markets.
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card border-glow rounded-2xl p-6 text-center group hover:bg-card/90 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="text-primary" size={28} />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
