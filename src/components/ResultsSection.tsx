import { motion } from "framer-motion";
import { TrendingUp, Zap, BarChart3, Clock } from "lucide-react";

const results = [
  {
    icon: TrendingUp,
    title: "Increase Leads",
    description: "Our AI-optimized funnels and websites consistently generate 3-5x more qualified leads than traditional methods.",
    stat: "300%",
    statLabel: "More Leads",
  },
  {
    icon: Zap,
    title: "Automate Sales",
    description: "AI chatbots and calling agents handle outreach, follow-ups, and bookings — so your sales never stops.",
    stat: "24/7",
    statLabel: "Automated",
  },
  {
    icon: BarChart3,
    title: "Improve Conversion Rates",
    description: "Data-driven design and A/B testing ensure every element of your funnel is optimized for maximum conversions.",
    stat: "2.5x",
    statLabel: "Higher Conversion",
  },
  {
    icon: Clock,
    title: "Reduce Manual Work",
    description: "Custom automation workflows eliminate repetitive tasks, freeing your team to focus on strategy and growth.",
    stat: "40hrs",
    statLabel: "Saved / Month",
  },
];

const ResultsSection = () => {
  return (
    <section className="section-padding bg-secondary/30 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-6">
            Results
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
            Real Outcomes. <span className="text-gradient-neon">Measurable Growth.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {results.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card border-glow rounded-2xl p-8 lg:p-10 flex gap-6 group hover:bg-card/90 transition-colors"
              >
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="text-primary" size={28} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-xl font-heading font-semibold text-foreground">{item.title}</h3>
                    <span className="text-2xl font-heading font-bold text-gradient-neon">{item.stat}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
