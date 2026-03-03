import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <div className="glass-card rounded-3xl p-10 md:p-16 text-center relative">
            {/* Glow effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <Rocket className="text-primary" size={32} />
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-foreground mb-4">
                Ready to Scale <span className="text-gradient-neon">with AI?</span>
              </h2>

              <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
                Book a free strategy call and discover how AI-powered solutions can transform your business growth.
              </p>

              <Button variant="hero" size="xl" className="group" asChild>
                <a href="#contact">
                  Book Your Free Consultation
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
