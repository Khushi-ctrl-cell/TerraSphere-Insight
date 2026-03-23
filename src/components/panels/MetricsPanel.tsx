import { motion } from "framer-motion";
import { indianLocations, computeGlobalMetrics } from "@/data/mockData";
import { Satellite, Database, TreePine, Waves, Target, AlertTriangle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function MetricsPanel() {
  const metrics = useMemo(() => computeGlobalMetrics(indianLocations), []);

  return (
    <motion.div
      className="glass-panel p-4 w-52"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="hud-label mb-3">Mission Status</div>
      <div className="space-y-3">
        <LiveCounter icon={<Satellite className="w-3.5 h-3.5" />} label="Active Satellites" value={metrics.activeSatellites} />
        <LiveCounter icon={<Database className="w-3.5 h-3.5" />} label="Data Points" value={metrics.dataPointsProcessed} animated />
        <LiveCounter icon={<TreePine className="w-3.5 h-3.5" />} label="Forest Cover Δ" value={metrics.forestCoverChange} suffix="%" negative />
        <LiveCounter icon={<Waves className="w-3.5 h-3.5" />} label="Glacier Melt" value={metrics.glacierMelt} suffix=" Gt/yr" />
        <LiveCounter icon={<Target className="w-3.5 h-3.5" />} label="Model Accuracy" value={metrics.modelAccuracy} suffix="%" />
        <LiveCounter icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Critical Zones" value={metrics.criticalZones} negative={metrics.criticalZones > 0} />
      </div>
    </motion.div>
  );
}

function LiveCounter({ icon, label, value, suffix, animated, negative }: {
  icon: React.ReactNode; label: string; value: number; suffix?: string; animated?: boolean; negative?: boolean;
}) {
  const [display, setDisplay] = useState(animated ? value : value);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setDisplay(v => v + Math.floor(Math.random() * 12));
    }, 2000);
    return () => clearInterval(interval);
  }, [animated]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="hud-label text-[9px]">{label}</div>
        <div className={`font-mono text-sm tabular-nums ${negative ? "neon-text-red" : "neon-text-blue"}`}>
          {display.toLocaleString()}{suffix}
        </div>
      </div>
    </div>
  );
}
