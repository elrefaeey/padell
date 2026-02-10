import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WhatsAppButton = () => {
  const msg = encodeURIComponent("مرحبًا، أريد الاستفسار عن VIP PADEL");
  const url = `https://wa.me/2001557060450?text=${msg}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gold-gradient flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} className="text-primary-foreground" />
    </motion.a>
  );
};

export default WhatsAppButton;
