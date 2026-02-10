import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCollection, addDocument } from "@/hooks/useFirestore";
import { PageLoader, SkeletonCard } from "@/components/LoadingSkeleton";
import { X, CalendarDays, Clock, Phone, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Court {
  id: string;
  name: string;
  description: string;
  image: string;
  available: boolean;
  order?: number;
}

const Courts = () => {
  const { data: courts, loading } = useCollection<Court>("courts", "order");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  return (
    <div className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold gold-text mb-4">
            Our Courts
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Select a court to view details and book your session
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : courts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courts.map((court, i) => (
              <motion.div
                key={court.id}
                className="bg-card border border-border rounded-xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all duration-500 relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedCourt(court)}
              >
                {court.image && (
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={court.image}
                      alt={court.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${court.available
                          ? "bg-primary text-primary-foreground"
                          : "bg-destructive text-destructive-foreground"
                        }`}>
                        {court.available ? "Book Now" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                    {court.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{court.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">
            Courts information coming soon.
          </p>
        )}
      </div>

      <AnimatePresence>
        {selectedCourt && (
          <BookingModal court={selectedCourt} onClose={() => setSelectedCourt(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

function BookingModal({ court, onClose }: { court: Court; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time) {
      toast.error("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      await addDocument("bookings", { ...form, court: court.name, status: "pending" });
      toast.success("Booking submitted!");

      // WhatsApp confirmation
      const msg = encodeURIComponent(
        `New VIP PADEL Booking:\nCourt: ${court.name}\nName: ${form.name}\nPhone: ${form.phone}\nDate: ${form.date}\nTime: ${form.time}`
      );
      window.open(`https://wa.me/201557060450?text=${msg}`, "_blank");

      onClose();
    } catch {
      toast.error("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border shadow-2xl flex flex-col md:flex-row relative"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-background/50 rounded-full hover:bg-background transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Side */}
        <div className="w-full md:w-2/5 h-48 md:h-auto relative">
          <img src={court.image} alt={court.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:bg-gradient-to-r" />
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
            <h2 className="text-3xl font-heading font-bold gold-text drop-shadow-md">{court.name}</h2>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex-1 p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <CheckCircle size={20} className="text-primary" /> Booking Details
            </h3>
            <p className="text-muted-foreground text-sm">{court.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                  <Input
                    type="date"
                    className="pl-9 bg-muted/50 border-border"
                    required
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                  <Input
                    type="time"
                    className="pl-9 bg-muted/50 border-border"
                    required
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                <Input
                  placeholder="Enter your name"
                  className="pl-9 bg-muted/50 border-border"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                <Input
                  placeholder="01xxxxxxxxx"
                  className="pl-9 bg-muted/50 border-border"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="hero" className="w-full" disabled={!court.available || submitting}>
                {submitting ? "Processing..." : court.available ? "Confirm Booking & Open WhatsApp" : "Currently Unavailable"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                You will be redirected to WhatsApp to confirm your reservation.
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Courts;
