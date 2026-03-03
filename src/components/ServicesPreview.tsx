import { motion } from "framer-motion";
import { ArrowRight, Globe, Bot, Megaphone, TrendingUp, Workflow, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Globe,
    title: "AI Website Development",
    description: "Stunning, conversion-optimized websites powered by AI — built to load fast, rank high, and convert visitors into customers.",
    tag: "Most Popular",
  },
  {
    icon: Bot,
    title: "AI Chatbot Systems",
    description: "24/7 intelligent chatbots that qualify leads, answer questions, and close sales automatically for your business.",
  },
  {
    icon: Megaphone,
    title: "Paid Ads Management",
    description: "Data-driven Google, Meta, and TikTok ad campaigns that maximize your ROI and reduce wasted spend.",
  },
  {
    icon: TrendingUp,
    title: "Sales Funnels",
    description: "End-to-end sales funnels that guide prospects from first click to purchase with precision targeting.",
  },
  {
    icon: Workflow,
    title: "Automation Systems",
    description: "Eliminate repetitive tasks with custom automation workflows that save hours and reduce human error.",
  },
  {
    icon: Phone,
    title: "AI Calling Agents",
    description: "AI-powered voice agents that handle calls, book appointments, and qualify leads around the clock.",
    tag: "New",
  },
];

const ServicesPreview = () => {
  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-6">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            What We <span className="text-gradient-neon">Build</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From intelligent websites to full AI automation — we deliver solutions that drive real business growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="glass-card border-glow rounded-2xl p-8 h-full transition-all duration-300 hover:bg-card/90 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="text-primary" size={28} />
                    </div>
                    {service.tag && (
                      <span className="text-xs font-medium text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                        {service.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-heading font-semibold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1">{service.description}</p>

                  <Button variant="subtle" size="sm" className="group/btn self-start" asChild>
                    <a href="#contact">
                      Learn More
                      <ArrowRight className="ml-1 group-hover/btn:translate-x-1 transition-transform" size={16} />
                    </a>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
