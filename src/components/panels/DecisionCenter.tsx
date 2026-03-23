import { motion } from "framer-motion";
import { useApp, useCaseConfig } from "@/contexts/AppContext";
import { indianLocations, generateSmartAlerts, explainLocationAI } from "@/data/mockData";
import { useMemo } from "react";
import { Brain, Shield, Zap, Target } from "lucide-react";

export default function DecisionCenter() {
  const { useCase, role, selectedLocation } = useApp();
  const loc = selectedLocation ?? indianLocations[0];
  const alerts = useMemo(() => generateSmartAlerts(indianLocations), []);
  const ai = useMemo(() => explainLocationAI(loc), [loc]);

  // Mode-specific recommendations
  const recommendations = useMemo(() => {
    const base = ai.factors.filter(f => f.impact === "negative").map(f => f.detail);
    const modeRecs: Record<string, string[]> = {
      agriculture: [
        loc.agriculture ? `${loc.agriculture.cropType}: ${loc.agriculture.recommendation}` : "Monitor soil moisture levels weekly.",
        loc.ndvi < 0.4 ? "Switch to drought-resistant crop varieties." : "Maintain current irrigation schedule.",
        `Yield forecast: ${loc.agriculture?.yieldPrediction ?? "N/A"} t/ha — ${loc.agriculture && loc.agriculture.yieldPrediction < 2.5 ? "below optimal" : "within range"}.`,
      ],
      drought: [
        loc.ndwi < -0.2 ? "Activate water conservation measures immediately." : "Water levels adequate — continue monitoring.",
        loc.lst > 38 ? "Deploy heat advisory for affected populations." : "Temperature within acceptable range.",
        "Assess reservoir levels and groundwater tables.",
      ],
      urban: [
        loc.urban > 50 ? "Enforce green building norms for new construction." : "Urban density manageable.",
        loc.ndvi < 0.25 ? "Mandate urban forest development — target +15% green cover." : "Green cover adequate.",
        "Monitor air quality index in high-density zones.",
      ],
      flood: [
        loc.ndwi > 0.1 ? "Pre-position relief supplies. Issue early warnings." : "Water levels normal.",
        "Monitor embankment integrity along river channels.",
        "Ensure drainage infrastructure maintenance before monsoon.",
      ],
    };
    return modeRecs[useCase] ?? base;
  }, [useCase, loc, ai]);

  const priorityAlert = alerts[0];
  const confidence = Math.round(75 + Math.random() * 20);
  const impactLevel = loc.riskLevel === "critical" ? "Critical" : loc.riskLevel === "high" ? "High" : "Moderate";

  return (
    <motion.div
      className="glass-panel-accent p-4 w-72"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-primary" />
        <span className="hud-label">AI Decision Center</span>
        <span className="ml-auto font-mono text-[9px] neon-text-blue">{useCaseConfig[useCase].label}</span>
      </div>

      {/* Priority Alert */}
      {priorityAlert && (
        <div className={`rounded border p-2.5 mb-3 ${
          priorityAlert.severity === "critical" ? "border-neon-red/30 bg-neon-red/5" : "border-neon-orange/20 bg-neon-orange/5"
        }`}>
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="w-3 h-3 text-neon-red" />
            <span className="font-display text-[10px] font-bold uppercase neon-text-red">Priority Alert</span>
          </div>
          <p className="text-[10px] text-foreground/80 font-body leading-tight">{priorityAlert.message}</p>
        </div>
      )}

      {/* Risk + Confidence */}
      <div className="flex gap-2 mb-3">
        <div className={`flex-1 rounded border p-2 text-center ${
          loc.riskLevel === "critical" ? "border-neon-red/30" : "border-border/40"
        }`}>
          <div className="font-mono text-[8px] text-muted-foreground">RISK</div>
          <div className={`font-display text-xs font-bold uppercase ${
            loc.riskLevel === "critical" ? "neon-text-red" :
            loc.riskLevel === "high" ? "neon-text-orange" : "neon-text-green"
          }`}>{loc.riskLevel}</div>
        </div>
        <div className="flex-1 rounded border border-border/40 p-2 text-center">
          <div className="font-mono text-[8px] text-muted-foreground">CONFIDENCE</div>
          <div className="font-display text-xs font-bold neon-text-blue">{confidence}%</div>
        </div>
        <div className="flex-1 rounded border border-border/40 p-2 text-center">
          <div className="font-mono text-[8px] text-muted-foreground">IMPACT</div>
          <div className={`font-display text-xs font-bold ${impactLevel === "Critical" ? "neon-text-red" : impactLevel === "High" ? "neon-text-orange" : "neon-text-green"}`}>{impactLevel}</div>
        </div>
      </div>

      {/* Ranked Recommendations */}
      <div className="hud-label text-[9px] mb-2 flex items-center gap-1">
        <Target className="w-3 h-3" />
        Recommendations
      </div>
      <div className="space-y-1.5">
        {recommendations.slice(0, 3).map((rec, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-2 rounded border border-border/30 bg-muted/15 p-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <span className="font-display text-[9px] font-bold neon-text-blue mt-0.5">#{i + 1}</span>
            <p className="text-[10px] text-foreground/80 font-body leading-tight">{rec}</p>
          </motion.div>
        ))}
      </div>

      {/* Simple explanation for farmer role */}
      {role === "farmer" && (
        <div className="mt-3 rounded border border-neon-green/20 bg-neon-green/5 p-2.5">
          <p className="text-[11px] text-foreground/80 font-body leading-relaxed">
            {useCase === "agriculture"
              ? `💡 ${loc.agriculture ? `Your ${loc.agriculture.cropType} needs ${loc.agriculture.irrigationNeed} irrigation. Expected yield: ${loc.agriculture.yieldPrediction} t/ha.` : "Check soil moisture and plan irrigation accordingly."}`
              : useCase === "drought"
              ? `💡 Water levels are ${loc.ndwi > 0 ? "okay" : "low"}. ${loc.ndwi < -0.2 ? "Save water and use drip irrigation." : "Continue normal water usage."}`
              : `💡 Your area is ${loc.riskLevel} risk. ${loc.riskLevel === "high" || loc.riskLevel === "critical" ? "Stay alert and follow local advisories." : "No immediate concerns."}`
            }
          </p>
        </div>
      )}
    </motion.div>
  );
}
