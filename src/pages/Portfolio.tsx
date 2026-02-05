import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import CaseStudies from "@/components/portfolio/CaseStudies";
import Testimonials from "@/components/portfolio/Testimonials";
import PortfolioCTA from "@/components/portfolio/PortfolioCTA";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PortfolioHero />
      <PortfolioGrid />
      <CaseStudies />
      <Testimonials />
      <PortfolioCTA />
      <Footer />
    </div>
  );
};

export default Portfolio;
