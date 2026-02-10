import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/courts", label: "Courts" },
  { to: "/offers", label: "Offers" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0d0f]/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="md:hidden flex flex-col items-center pt-5 pb-4">
          <Link to="/" className="text-2xl font-heading font-bold gold-text tracking-wider mb-4">
            VIP PADEL
          </Link>
          <div className="flex items-center justify-center w-full no-scrollbar px-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-nowrap">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-1.5 text-[11px] font-bold transition-all duration-300 whitespace-nowrap outline-none flex items-center justify-center ${isActive ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabMobile"
                        className="absolute inset-[2px] bg-primary rounded-full shadow-md shadow-primary/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Layout (Standard) */}
        <div className="hidden md:flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-heading font-bold gold-text tracking-wider">
            VIP PADEL
          </Link>

          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-primary ${location.pathname === link.to ? "text-primary scale-105" : "text-foreground/70"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
