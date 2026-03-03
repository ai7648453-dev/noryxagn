import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Bot, Megaphone, TrendingUp, Workflow, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Globe,
    title: "AI Website Development",
    description: "We build stunning, high-performance websites powered by AI that are optimized for speed, SEO, and conversions. Every site is custom-designed to reflect your brand and engineered to turn visitors into customers.",
    features: ["Custom UI/UX Design", "Mobile-First Development", "SEO Optimization", "AI-Powered Personalization"],
  },
  {
    icon: Bot,
    title: "AI Chatbot Systems",
    description: "Deploy intelligent chatbots that engage visitors 24/7, qualify leads automatically, answer common questions, and book appointments — all without human intervention.",
    features: ["Natural Language Processing", "Lead Qualification", "Multi-Platform Support", "Custom Training"],
  },
  {
    icon: Megaphone,
    title: "Paid Ads Management",
    description: "We create and manage data-driven ad campaigns across Google, Meta, TikTok, and LinkedIn that maximize your ROI and minimize wasted ad spend.",
    features: ["Campaign Strategy", "A/B Testing", "Audience Targeting", "Performance Analytics"],
  },
  {
    icon: TrendingUp,
    title: "Sales Funnels",
    description: "End-to-end sales funnels designed to guide prospects from awareness to purchase. We optimize every touchpoint for maximum conversion rates.",
    features: ["Landing Pages", "Email Sequences", "Retargeting", "Conversion Optimization"],
  },
  {
    icon: Workflow,
    title: "Automation Systems",
    description: "Custom automation workflows that eliminate repetitive tasks, reduce human error, and free your team to focus on high-value strategic work.",
    features: ["Workflow Design", "API Integrations", "CRM Automation", "Reporting Dashboards"],
  },
  {
    icon: Phone,
    title: "AI Calling Agents",
    description: "AI-powered voice agents that handle inbound and outbound calls, qualify leads, book appointments, and follow up with prospects automatically.",
    features: ["Natural Voice AI", "Appointment Scheduling", "Lead Scoring", "CRM Integration"],
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="pt-32 pb-20 relative overflow-hidden noise-overlay">
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center mb-20"
            >
              <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-6">
                Services
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                AI Solutions That <span className="text-gradient-neon">Drive Growth</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Comprehensive digital services designed to automate, optimize, and scale your business.
              </p>
            </motion.div>

            <div className="space-y-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="glass-card border-glow rounded-2xl p-8 lg:p-10 group hover:bg-card/90 transition-colors"
                  >
                    <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="text-primary" size={28} />
                          </div>
                          <h2 className="text-2xl font-heading font-bold text-foreground">{service.title}</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((f) => (
                            <span key={f} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{f}</span>
                          ))}
                        </div>
                      </div>
                      <Button variant="hero" size="lg" className="group/btn shrink-0" asChild>
                        <a href="#contact">
                          Get Started
                          <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={18} />
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
