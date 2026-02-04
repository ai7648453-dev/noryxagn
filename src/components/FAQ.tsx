import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer: "Most projects take 3–6 weeks depending on scope, content readiness, and feedback cycles.",
  },
  {
    question: "Do you work with international clients?",
    answer: "Yes. NORYX works with clients worldwide using streamlined remote collaboration.",
  },
  {
    question: "What platforms do you build on?",
    answer: "We work with modern, scalable platforms and custom solutions based on your needs — always choosing what fits the project best.",
  },
  {
    question: "Can you redesign an existing website?",
    answer: "Absolutely. We frequently redesign outdated or underperforming websites.",
  },
  {
    question: "Do you provide ongoing support?",
    answer: "Yes. Maintenance, updates, and ongoing optimization are available after launch.",
  },
  {
    question: "Is SEO included?",
    answer: "We build with SEO best practices in mind. Advanced SEO services can be added if needed.",
  },
  {
    question: "Do you help with content?",
    answer: "Yes. We can assist with structure, messaging, and UX-focused copy.",
  },
  {
    question: "What do you need from us to start?",
    answer: "A clear goal, basic business information, and timely feedback during the process.",
  },
  {
    question: "How do payments work?",
    answer: "Projects are typically split into milestone payments.",
  },
];

const FAQ = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" ref={ref} className="section-padding">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 text-xs font-medium tracking-widest uppercase text-gold border border-gold/30 rounded-full bg-gold/5 mb-6">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card border-glow rounded-xl px-6 border-none data-[state=open]:bg-card/80"
              >
                <AccordionTrigger className="text-left font-heading font-medium text-foreground hover:text-gold transition-colors hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
