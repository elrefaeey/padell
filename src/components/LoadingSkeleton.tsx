import { motion } from "framer-motion";

export const SkeletonCard = () => (
  <div className="bg-card rounded-lg border border-border p-6 space-y-4 animate-pulse">
    <div className="h-40 bg-muted rounded-md" />
    <div className="h-4 bg-muted rounded w-3/4" />
    <div className="h-3 bg-muted rounded w-1/2" />
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-3 bg-muted rounded" style={{ width: `${80 - i * 15}%` }} />
    ))}
  </div>
);

export const PageLoader = () => (
  <motion.div
    className="flex items-center justify-center min-h-[60vh]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </motion.div>
);
