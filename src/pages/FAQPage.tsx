import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import { motion } from "framer-motion";

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="pt-32 pb-8 relative overflow-hidden noise-overlay">
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-primary border border-primary/30 rounded-full bg-primary/5 mb-6">
                FAQ
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                Got <span className="text-gradient-neon">Questions?</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Find answers to the most common questions about our services, process, and pricing.
              </p>
            </motion.div>
          </div>
        </section>
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
