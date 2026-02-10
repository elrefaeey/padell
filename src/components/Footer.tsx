import { Lock } from "lucide-react";
import { useState } from "react";
import AdminLoginModal from "./AdminLoginModal";

const Footer = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleDeveloperClick = () => {
    const msg = encodeURIComponent("أنا جاي من ويب سايت VIP PADEL ممكن التفاصيل");
    window.open(`https://wa.me/2001092940685?text=${msg}`, "_blank");
  };

  return (
    <>
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg font-heading gold-text font-bold">VIP PADEL</p>
            <p className="text-sm text-muted-foreground">
              Developed by{" "}
              <button
                onClick={handleDeveloperClick}
                className="text-primary hover:underline transition-colors"
              >
                Ahmed Elrefaey
              </button>
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
              aria-label="Admin login"
            >
              <Lock size={14} />
            </button>
          </div>
        </div>
      </footer>
      <AdminLoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Footer;
