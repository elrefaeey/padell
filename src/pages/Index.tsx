import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDocument, useCollection } from "@/hooks/useFirestore";
import { Button } from "@/components/ui/button";
import { PageLoader, SkeletonCard } from "@/components/LoadingSkeleton";
import { Trophy, Users, Clock, Star } from "lucide-react";
import heroImage from "@/assets/hero-padel.jpg";

interface HomeContent {
  title: string;
  subtitle: string;
  ctaText: string;
  heroImage?: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  order?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  trophy: <Trophy className="w-8 h-8 text-primary" />,
  users: <Users className="w-8 h-8 text-primary" />,
  clock: <Clock className="w-8 h-8 text-primary" />,
  star: <Star className="w-8 h-8 text-primary" />,
};

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
};

const Index = () => {
  const { data: home, loading: homeLoading } = useDocument<HomeContent>("siteContent", "home");
  const { data: features, loading: featuresLoading } = useCollection<Feature>("features", "order");

  const title = home?.title || "Welcome to VIP PADEL";
  const subtitle = home?.subtitle || "The ultimate premium padel experience";
  const ctaText = home?.ctaText || "Book Now";
  const bgImage = home?.heroImage || heroImage;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />

        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 gold-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-foreground/70 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Link to="/courts">
              <Button variant="hero" size="xl">
                {ctaText}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.h2
            className="text-3xl md:text-5xl font-heading font-bold text-center mb-16 gold-text"
            {...fadeUp}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
          >
            Why VIP PADEL?
          </motion.h2>

          {featuresLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : features.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.id}
                  className="bg-card border border-border rounded-xl p-8 text-center hover:border-primary/30 hover:gold-glow transition-all duration-500 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <div className="mb-4 flex justify-center">
                    {iconMap[feature.icon] || <Star className="w-8 h-8 text-primary" />}
                  </div>
                  <h3 className="text-lg font-heading font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Content coming soon. Stay tuned!
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
