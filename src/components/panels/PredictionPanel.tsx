import { motion } from "framer-motion";
import { indianLocations, computeChangeDetections, generatePredictions, type ChangeDetection } from "@/data/mockData";
import { TrendingDown, TrendingUp, ArrowRight, Shield } from "lucide-react";
import { useMemo } from "react";

interface Props {
  targetYear: number;
}

export default function PredictionPanel({ targetYear }: Props) {
  const predictions = useMemo(() => generatePredictions(indianLocations, Math.max(targetYear, 2026)), [targetYear]);
  const changes = useMemo(() => computeChangeDetections(indianLocations), []);

  return (
    <motion.div
      className="glass-panel p-4 w-72"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="hud-label">AI Predictions · {predictions.year}</span>
        <span className="inline-flex items-center gap-1 font-mono text-[9px] neon-text-blue">
          <Shield className="w-2.5 h-2.5" /> {predictions.confidence}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <PredBox label="NDVI" value={predictions.ndvi.toFixed(3)} trend={predictions.ndvi < 0.35 ? "down" : "up"} />
        <PredBox label="Urban %" value={`${predictions.urban}%`} trend="up" />
        <PredBox label="Avg LST" value={`${predictions.temperature}°C`} trend="up" />
        <PredBox label="Health" value={`${predictions.healthScore}/100`} trend="down" />
      </div>

      <div className="text-[9px] text-muted-foreground font-mono mb-3 border-t border-border/30 pt-2">
        Model: future_ndvi = avg_ndvi − (Δurban × 0.003)<br />
        urban(t) = urban₀ × (1.018)^t · conf. decreases 5%/yr
      </div>

      <div className="hud-label mb-2">Change Detection (Computed)</div>
      <div className="space-y-1.5">
        {changes.slice(0, 4).map((cd, i) => (
          <ChangeItem key={i} cd={cd} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

function ChangeItem({ cd, index }: { cd: ChangeDetection; index: number }) {
  const severityColor =
    cd.severity === "critical" ? "border-neon-red/30 bg-neon-red/5" :
    cd.severity === "severe" ? "border-neon-orange/30 bg-neon-orange/5" :
    "border-border/40 bg-muted/20";

  return (
    <motion.div
      className={`rounded border p-2 text-[10px] ${severityColor}`}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.08 }}
    >
      <div className="flex items-center gap-1 font-display font-bold text-foreground/90">
        {cd.region}
        <span className={`ml-auto font-mono text-[9px] uppercase ${
          cd.severity === "critical" ? "neon-text-red" :
          cd.severity === "severe" ? "neon-text-orange" : "text-muted-foreground"
        }`}>{cd.severity}</span>
      </div>
      <div className="flex items-center gap-2 mt-1 font-mono">
        <span className="text-muted-foreground">{cd.before}</span>
        <ArrowRight className="w-2.5 h-2.5 text-primary" />
        <span className="text-foreground">{cd.after}</span>
        <span className={`ml-auto font-bold ${cd.changePercent < 0 ? "neon-text-red" : "neon-text-green"}`}>
          {cd.changePercent > 0 ? "+" : ""}{cd.changePercent}%
        </span>
        <span className="font-mono text-[8px] text-muted-foreground">{cd.confidence}% conf</span>
      </div>
      <p className="text-muted-foreground mt-1 font-body leading-tight">{cd.cause}</p>
    </motion.div>
  );
}

function PredBox({ label, value, trend }: { label: string; value: string; trend: "up" | "down" }) {
  return (
    <div className="rounded border border-border/40 bg-muted/20 p-2 text-center">
      <div className="font-mono text-[9px] text-muted-foreground uppercase">{label}</div>
      <div className="font-display text-sm font-bold text-foreground/90 flex items-center justify-center gap-1">
        {value}
        {trend === "up"
          ? <TrendingUp className="w-3 h-3 text-neon-red" />
          : <TrendingDown className="w-3 h-3 text-neon-red" />
        }
      </div>
    </div>
  );
}
