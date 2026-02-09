import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const { data: hero } = useQuery({
    queryKey: ["hero-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const heading = hero?.heading ?? "Next-Level";
  const headingHighlight = hero?.heading_highlight ?? "Digital Agency";
  const headingLine2 = hero?.heading_line2 ?? "for Modern Brands";
  const tagline = hero?.tagline ?? "Design. Strategy. Growth. Built to perform.";
  const description = hero?.description ?? "NORYX is a global digital agency creating high-impact websites, brands, and digital experiences that help businesses stand out and scale with confidence.";
  const ctaPrimaryText = hero?.cta_primary_text ?? "Start Your Project";
  const ctaPrimaryLink = hero?.cta_primary_link ?? "#contact";
  const ctaSecondaryText = hero?.cta_secondary_text ?? "View Services";
  const ctaSecondaryLink = hero?.cta_secondary_link ?? "#services";
  const videoUrl = hero?.video_url ?? "/videos/hero-bg.mp4";
  const videoEnabled = hero?.video_enabled ?? true;
  const overlayOpacity = hero?.overlay_opacity ?? 70;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {videoEnabled && videoUrl && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectFit: 'cover' }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-background" style={{ opacity: overlayOpacity / 100 }} />
      </div>
      
      {/* Gradient background effects */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gold/3 blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-gold border border-gold/30 rounded-full bg-gold/5">
              Digital Agency
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight mb-6"
          >
            <span className="text-foreground">{heading} </span>
            <span className="text-gradient-gold">{headingHighlight}</span>
            <br />
            <span className="text-foreground">{headingLine2}</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-4 font-medium"
          >
            {tagline}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground/80 mb-10 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="hero" size="xl" className="group" asChild>
              <a href={ctaPrimaryLink}>
                {ctaPrimaryText}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href={ctaSecondaryLink}>{ctaSecondaryText}</a>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-20 pt-10 border-t border-border/30"
          >
            <p className="text-sm text-muted-foreground/60 mb-6 uppercase tracking-widest">
              Trusted by ambitious brands worldwide
            </p>
            <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap opacity-50">
              {["Startups", "E-Commerce", "SaaS", "Agencies", "Enterprises"].map((item) => (
                <span key={item} className="text-sm md:text-base font-medium text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
