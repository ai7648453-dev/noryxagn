import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Target, Lightbulb, Award } from "lucide-react";

const values = [
  { icon: Target, title: "Results-Driven", desc: "Every decision is backed by data and focused on measurable business outcomes." },
  { icon: Lightbulb, title: "AI-First Approach", desc: "We leverage the latest AI technology to build smarter, faster, and more efficient solutions." },
  { icon: Users, title: "Client-Centric", desc: "Your success is our mission. We partner closely with every client to deliver beyond expectations." },
  { icon: Award, title: "Premium Quality", desc: "We don't cut corners. Every project is built to the highest standards of design and performance." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 relative overflow-hidden noise-overlay">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-6">
                About NORYX
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                Building the Future of <span className="text-gradient-neon">Digital Business</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                NORYX is a premium AI-powered digital agency helping businesses worldwide scale through intelligent websites, automation, and data-driven strategies. We combine cutting-edge technology with creative excellence to deliver results that matter.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                  Our <span className="text-gradient-neon">Mission</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We believe every business deserves access to the power of AI. Our mission is to democratize intelligent digital solutions — making them accessible, affordable, and impactful for businesses of all sizes.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  From startups to enterprises, we build systems that don't just look good — they drive revenue, automate operations, and create sustainable competitive advantages.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { value: "150+", label: "Projects Completed" },
                  { value: "50+", label: "Global Clients" },
                  { value: "98%", label: "Client Retention" },
                  { value: "5+", label: "Years of Excellence" },
                ].map((s) => (
                  <div key={s.label} className="glass-card rounded-2xl p-6 text-center">
                    <p className="text-3xl font-heading font-bold text-gradient-neon">{s.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                Our <span className="text-gradient-neon">Values</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="glass-card border-glow rounded-2xl p-8 text-center group hover:bg-card/90 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="text-primary" size={28} />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
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

export default About;
