import { motion } from "framer-motion";
import { Lightbulb, Wrench, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CaseStudies = () => {
  const { data: caseStudies = [], isLoading } = useQuery({
    queryKey: ["case_studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 w-48 bg-muted/50 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-muted/30 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (caseStudies.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-gold border border-gold/30 rounded-full bg-gold/5 mb-6">
            Case Studies
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Real Problems. <span className="text-gradient-gold">Real Results.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dive deeper into how we approach challenges and deliver measurable outcomes.
          </p>
        </motion.div>

        {/* Case studies list */}
        <div className="space-y-12">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-8 md:p-10 rounded-2xl"
            >
              {/* Title and client */}
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  {study.title}
                </h3>
                {study.client_name && (
                  <p className="text-gold text-sm uppercase tracking-widest">
                    {study.client_name}
                  </p>
                )}
              </div>

              {/* Problem, Solution, Result grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Problem */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <Lightbulb className="text-red-400" size={20} />
                    </div>
                    <h4 className="font-heading font-semibold text-foreground">The Problem</h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {study.problem}
                  </p>
                </div>

                {/* Solution */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Wrench className="text-blue-400" size={20} />
                    </div>
                    <h4 className="font-heading font-semibold text-foreground">Our Solution</h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {study.solution}
                  </p>
                </div>

                {/* Result */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="text-green-400" size={20} />
                    </div>
                    <h4 className="font-heading font-semibold text-foreground">The Result</h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {study.result}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
