import { motion } from "framer-motion";
import { useCollection } from "@/hooks/useFirestore";
import { SkeletonCard } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface Offer {
  title: string;
  description: string;
  badge: string;
  price?: string;
  features?: string[];
  image?: string;
  order?: number;
}

const badgeColors: Record<string, string> = {
  "50% OFF": "bg-destructive text-destructive-foreground",
  "Group Offer": "bg-secondary text-secondary-foreground",
  "Early Bird": "bg-primary text-primary-foreground",
  "VIP Membership": "gold-gradient text-primary-foreground",
};

const Offers = () => {
  const { data: offers, loading } = useCollection<Offer>("offers", "order");

  return (
    <div className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold gold-text mb-4">
            Special Offers
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Exclusive deals crafted for our premium members
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {offers.map((offer, i) => (
              <motion.div
                key={offer.id}
                className="bg-card border border-border rounded-xl p-8 relative overflow-hidden hover:border-primary/30 hover:gold-glow transition-all duration-500 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {offer.badge && (
                  <span
                    className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full ${badgeColors[offer.badge] || "bg-primary text-primary-foreground"
                      }`}
                  >
                    {offer.badge}
                  </span>
                )}
                <Sparkles className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-2xl font-heading font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {offer.title}
                </h3>
                {offer.price && (
                  <p className="text-3xl font-bold gold-text mb-3">{offer.price}</p>
                )}
                <p className="text-muted-foreground mb-6">{offer.description}</p>
                {offer.features && offer.features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {offer.features.map((f, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link to="/courts">
                  <Button variant="outline-gold" className="w-full">
                    Book Now
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">
            Offers coming soon. Check back later!
          </p>
        )}
      </div>
    </div>
  );
};

export default Offers;
