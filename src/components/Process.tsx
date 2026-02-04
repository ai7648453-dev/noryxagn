import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Map, Rocket, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "We start by understanding your business, audience, and goals. This phase aligns strategy, expectations, and direction before any design or development begins.",
    icon: Search,
  },
  {
    number: "02",
    title: "Plan",
    description: "We define structure, user flows, content priorities, and technical requirements. Every decision is intentional and tied to performance.",
    icon: Map,
  },
  {
    number: "03",
    title: "Execute",
    description: "Design and development come together. We build, test, refine, and optimize — keeping communication clear and progress transparent.",
    icon: Rocket,
  },
  {
    number: "04",
    title: "Deliver",
    description: "Your project goes live, fully tested and ready to perform. We provide support, guidance, and next-step recommendations for growth.",
    icon: CheckCircle2,
  },
];

const Process = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="process" ref={ref} className="section-padding relative">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-gold border border-gold/30 rounded-full bg-gold/5 mb-6">
            Our Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            A Clear Process.{" "}
            <span className="text-gradient-gold">Real Results.</span>
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative"
              >
                <div className="glass-card border-glow rounded-2xl p-8 h-full transition-all duration-300 hover:bg-card/90">
                  {/* Step Number */}
                  <span className="text-5xl font-heading font-bold text-gold/20 absolute top-4 right-6">
                    {step.number}
                  </span>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                    <Icon className="text-gold" size={24} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
