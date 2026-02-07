import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budget, setBudget] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const company = (form.elements.namedItem("company") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
    const { error } = await supabase.from("contact_submissions").insert({
      name, email, company: company || null, budget_range: budget || null, message,
    });
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Message sent! We'll get back to you soon.");
      form.reset();
      setBudget("");
    }
    setIsSubmitting(false);
  };

  return (
    <section id="contact" ref={ref} className="section-padding bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-gold border border-gold/30 rounded-full bg-gold/5 mb-6">
              Contact
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
              Let's Build Something{" "}
              <span className="text-gradient-gold">That Works</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Tell us about your project, your goals, and your timeline. 
              We'll review your request and get back to you with clear next steps.
            </p>

            <div className="space-y-4 text-muted-foreground">
              <p className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gold" />
                Response within 24-48 hours
              </p>
              <p className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gold" />
                Free project consultation
              </p>
              <p className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gold" />
                No commitment required
              </p>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 lg:p-10 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Name *</label>
                  <Input 
                    name="name"
                    required 
                    placeholder="Your name" 
                    className="bg-secondary/50 border-border/50 focus:border-gold/50 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email *</label>
                  <Input 
                    name="email"
                    required 
                    type="email" 
                    placeholder="your@email.com" 
                    className="bg-secondary/50 border-border/50 focus:border-gold/50 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company <span className="text-muted-foreground">(optional)</span></label>
                <Input 
                  name="company"
                  placeholder="Your company" 
                  className="bg-secondary/50 border-border/50 focus:border-gold/50 h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Budget Range *</label>
                <Select value={budget} onValueChange={setBudget}>
                  <SelectTrigger className="bg-secondary/50 border-border/50 focus:border-gold/50 h-12">
                    <SelectValue placeholder="Select your budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                    <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                    <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10000+">$10,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Project Details *</label>
                <Textarea 
                  name="message"
                  required
                  placeholder="Tell us about your project, goals, and timeline..."
                  rows={5}
                  className="bg-secondary/50 border-border/50 focus:border-gold/50 resize-none"
                />
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="xl" 
                className="w-full group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    Request a Quote
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
