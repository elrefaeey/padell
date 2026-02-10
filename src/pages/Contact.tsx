import { motion } from "framer-motion";
import { useDocument } from "@/hooks/useFirestore";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { PageLoader } from "@/components/LoadingSkeleton";

interface ContactInfo {
  whatsapp: string;
  phone: string;
  location: string;
  mapEmbed: string;
}

const Contact = () => {
  const { data: contact, loading } = useDocument<ContactInfo>("siteContent", "contact");

  const whatsapp = contact?.whatsapp || "01557060450";
  const phone = contact?.phone || "01557060450";
  const location = contact?.location || "VIP PADEL Club";
  const mapEmbed = contact?.mapEmbed || "";

  const cards = [
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      label: "WhatsApp",
      value: whatsapp,
      href: `https://wa.me/2${whatsapp}`,
    },
    {
      icon: <Phone className="w-8 h-8 text-primary" />,
      label: "Phone",
      value: phone,
      href: `tel:+2${phone}`,
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      label: "Location",
      value: location,
      href: undefined,
    },
  ];

  return (
    <div className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold gold-text mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Get in touch with VIP PADEL
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {cards.map((card, i) => (
            <motion.a
              key={card.label}
              href={card.href}
              target={card.href?.startsWith("http") ? "_blank" : undefined}
              rel={card.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="bg-card border border-border rounded-xl p-8 text-center hover:border-primary/30 hover:gold-glow transition-all duration-500 group block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="mb-4 flex justify-center">{card.icon}</div>
              <h3 className="text-lg font-heading font-semibold mb-1 text-foreground group-hover:text-primary transition-colors">
                {card.label}
              </h3>
              <p className="text-sm text-muted-foreground">{card.value}</p>
            </motion.a>
          ))}
        </div>

        {mapEmbed && (
          <motion.div
            className="rounded-xl overflow-hidden border border-border max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <iframe
              src={mapEmbed}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="VIP PADEL Location"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Contact;
