import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const Referral = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <div className="glass-card rounded-3xl p-10 md:p-16 text-center relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gold/10 blur-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-8">
                <Gift className="text-gold" size={32} />
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                Refer a Client. <span className="text-gradient-gold">Earn Cash.</span>
              </h2>
              
              <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
                Know someone who needs a website or digital upgrade? Refer them to NORYX 
                and earn a cash reward for every successful project.
              </p>
              
              <Button variant="hero" size="xl" className="group" asChild>
                <a href="#contact">
                  Become a Partner
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

export default Referral;
