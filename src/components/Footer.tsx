import noryxLogo from "@/assets/noryx-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <a href="/" className="flex items-center">
            <img src={noryxLogo} alt="NORYX" className="h-14 w-auto" />
          </a>

          <nav className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Case Studies", href: "/case-studies" },
              { label: "FAQ", href: "/faq" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {item.label}
              </a>
            ))}
          </nav>

          <p className="text-sm text-muted-foreground md:text-right">
            © {currentYear} NORYX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
