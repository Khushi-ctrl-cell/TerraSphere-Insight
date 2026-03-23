import { motion } from "framer-motion";
import { Orbit, Signal, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";

export default function TopBar() {
  const [time, setTime] = useState(new Date());
  const { setReportOpen } = useApp();

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <motion.div
      className="glass-panel px-5 py-2.5 flex items-center justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-3">
        <Orbit className="w-5 h-5 text-primary" />
        <h1 className="font-display text-sm font-bold tracking-wider neon-text-blue">
          DIGITAL TWIN · EARTH
        </h1>
        <span className="hud-label text-[9px] hidden sm:inline">INDIA FOCUS MODULE</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setReportOpen(true)}
          className="glass-panel px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-display font-bold uppercase hover:bg-muted/30 transition-colors active:scale-95"
        >
          <FileText className="w-3 h-3 text-primary" />
          Report
        </button>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3 h-3 text-neon-green animate-pulse-glow" />
          <span className="font-mono text-[10px] neon-text-green">LIVE</span>
        </div>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {time.toLocaleTimeString("en-IN", { hour12: false })} IST
        </span>
      </div>
    </motion.div>
  );
}
