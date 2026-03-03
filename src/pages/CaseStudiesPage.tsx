import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const caseStudies = [
  {
    title: "TechFlow — SaaS Website Redesign",
    category: "Web Design",
    description: "Complete website overhaul for a B2B SaaS platform. Redesigned the landing page, pricing page, and onboarding flow — resulting in a 180% increase in trial signups.",
    results: ["180% more signups", "45% lower bounce rate", "2.5s faster load time"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    title: "Novara — E-Commerce Automation",
    category: "Automation",
    description: "Built custom automation workflows for an e-commerce brand, integrating their CRM, email marketing, and inventory systems to eliminate 30+ hours of manual work weekly.",
    results: ["30hrs saved/week", "99.5% order accuracy", "3x faster fulfillment"],
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
  },
  {
    title: "ScaleUp — AI Chatbot Deployment",
    category: "AI Chatbot",
    description: "Deployed an intelligent AI chatbot for a marketing agency that handles lead qualification, FAQ responses, and appointment booking — converting 40% more website visitors.",
    results: ["40% more conversions", "24/7 availability", "85% query resolution"],
    image: "https://images.unsplash.com/photo-1531746790095-e5485d2a2e7b?w=600&h=400&fit=crop",
  },
  {
    title: "GrowthLab — Paid Ads Strategy",
    category: "Paid Ads",
    description: "Managed multi-platform ad campaigns for a fitness brand across Meta and Google, achieving a 5.2x ROAS and reducing customer acquisition costs by 60%.",
    results: ["5.2x ROAS", "60% lower CAC", "$200K+ revenue"],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
  },
];

const CaseStudiesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="pt-32 pb-20 relative overflow-hidden noise-overlay">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center mb-20"
            >
              <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-6">
                Case Studies
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                Our <span className="text-gradient-neon">Success Stories</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Real projects, real results. See how we've helped businesses grow with AI-powered digital solutions.
              </p>
            </motion.div>

            <div className="space-y-10">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="glass-card border-glow rounded-2xl overflow-hidden group hover:bg-card/90 transition-colors"
                >
                  <div className="grid lg:grid-cols-[400px_1fr] gap-0">
                    <div className="aspect-video lg:aspect-auto overflow-hidden">
                      <img
                        src={study.image}
                        alt={study.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-8 lg:p-10 flex flex-col justify-center">
                      <span className="text-xs font-medium text-primary uppercase tracking-wider mb-2">{study.category}</span>
                      <h2 className="text-2xl font-heading font-bold text-foreground mb-3">{study.title}</h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">{study.description}</p>
                      <div className="flex flex-wrap gap-3 mb-6">
                        {study.results.map((r) => (
                          <span key={r} className="text-sm px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold">{r}</span>
                        ))}
                      </div>
                      <Button variant="subtle" size="sm" className="self-start group/btn" asChild>
                        <a href="#contact">
                          Discuss Your Project
                          <ArrowRight className="ml-1 group-hover/btn:translate-x-1 transition-transform" size={16} />
                        </a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CaseStudiesPage;
