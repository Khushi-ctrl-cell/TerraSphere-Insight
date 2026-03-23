import { motion } from "framer-motion";
import { indianLocations, computeGlobalMetrics } from "@/data/mockData";
import { useMemo } from "react";

export default function HealthScorePanel() {
  const metrics = useMemo(() => computeGlobalMetrics(indianLocations), []);
  const score = metrics.healthScore;
  const color = score > 70 ? "neon-text-green" : score > 40 ? "neon-text-orange" : "neon-text-red";
  const strokeColor = score > 70 ? "hsl(var(--neon-green))" : score > 40 ? "hsl(var(--neon-orange))" : "hsl(var(--neon-red))";
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      className="glass-panel p-4 w-52"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="hud-label mb-3">Earth Health Index (Computed)</div>
      <div className="flex items-center justify-center">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" opacity="0.3" />
          <motion.circle
            cx="50" cy="50" r="42" fill="none"
            stroke={strokeColor}
            strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
            style={{ filter: `drop-shadow(0 0 6px ${strokeColor})` }}
          />
          <text x="50" y="46" textAnchor="middle" className={`${color} font-display text-lg`} fill="currentColor" fontSize="22" fontWeight="bold">
            {score}
          </text>
          <text x="50" y="62" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8" fontFamily="Share Tech Mono">
            / 100
          </text>
        </svg>
      </div>
      <div className="mt-3 space-y-1.5">
        <MiniMetric label="Avg NDVI" value={metrics.avgNDVI} />
        <MiniMetric label="CO₂ ppm" value={metrics.co2Level} />
        <MiniMetric label="Sea Rise mm/yr" value={metrics.seaLevelRise} />
        <MiniMetric label="Temp Anomaly °C" value={`+${metrics.globalTemp}`} />
        <MiniMetric label="Locations" value={metrics.totalLocationsMonitored} />
      </div>
    </motion.div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="hud-label text-[10px]">{label}</span>
      <span className="font-mono text-xs neon-text-blue">{value}</span>
    </div>
  );
}
