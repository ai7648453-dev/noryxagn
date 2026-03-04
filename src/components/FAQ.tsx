import { motion } from "framer-motion";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number | null;
  is_enabled: boolean;
}

const FALLBACK_FAQS: FAQItem[] = [
  {
    id: "fallback-1",
    question: "Do you carry hard-to-find electronic parts?",
    answer:
      "Yes — we source hard-to-find and specialized electronic components based on your requirements.",
    display_order: 1,
    is_enabled: true,
  },
  {
    id: "fallback-2",
    question: "Do you offer bulk pricing?",
    answer:
      "Absolutely. We provide volume-based pricing for bulk orders and long-term supply partnerships.",
    display_order: 2,
    is_enabled: true,
  },
];

const FAQ = () => {
  const queryClient = useQueryClient();

  const {
    data: faqs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_enabled", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data ?? []) as FAQItem[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("faq-live-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "faqs" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["faqs"] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const displayFaqs = faqs.length > 0 ? faqs : isError ? FALLBACK_FAQS : [];

  return (
    <section id="faq" className="section-padding">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-gold border border-gold/30 rounded-full bg-gold/5 mb-6">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="max-w-3xl mx-auto text-center text-muted-foreground">
            Loading FAQs...
          </div>
        ) : displayFaqs.length === 0 ? (
          <div className="max-w-3xl mx-auto text-center text-muted-foreground">
            No FAQs available yet.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {displayFaqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${index}`}
                  className="rounded-xl px-6 border border-border/40 bg-card/40 backdrop-blur-sm data-[state=open]:bg-card/70 data-[state=open]:border-gold/30 transition-colors"
                >
                  <AccordionTrigger className="text-left font-heading font-semibold text-base md:text-lg text-foreground hover:text-gold transition-colors hover:no-underline py-5 cursor-pointer gap-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {isError && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Showing fallback FAQs while reconnecting to live data.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FAQ;
