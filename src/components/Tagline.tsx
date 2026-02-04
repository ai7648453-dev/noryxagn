import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Globe } from "lucide-react";

const Tagline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Globe className="text-gold" size={20} />
            <span className="text-sm font-medium text-gold uppercase tracking-widest">
              Working Worldwide
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold leading-relaxed text-foreground mb-6">
            A Multidisciplinary Digital Studio
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From brand foundations to conversion-driven websites, we partner with 
            ambitious businesses across industries and borders.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Tagline;
