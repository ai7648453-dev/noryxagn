import noryxLogo from "@/assets/noryx-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img src={noryxLogo} alt="NORYX" className="h-14 w-auto" />
          </a>

          {/* Links */}
          <nav className="flex items-center gap-8">
            <a href="#process" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Process
            </a>
            <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} NORYX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
