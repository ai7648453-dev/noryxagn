import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Tagline from "@/components/Tagline";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Referral from "@/components/Referral";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Tagline />
        <Process />
        <Services />
        <Referral />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
