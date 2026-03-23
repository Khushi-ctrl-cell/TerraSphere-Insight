import { motion } from "framer-motion";
import { generateSmartAlerts, indianLocations, type Alert } from "@/data/mockData";
import { AlertTriangle, Droplets, Building2, Thermometer, CloudOff, Sprout, Waves, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

const iconMap: Record<Alert["type"], React.ElementType> = {
  deforestation: AlertTriangle,
  flood: Droplets,
  "urban-sprawl": Building2,
  heat: Thermometer,
  drought: CloudOff,
  "crop-stress": Sprout,
  "water-scarcity": Waves,
};

export default function AlertsPanel() {
  const alerts = useMemo(() => generateSmartAlerts(indianLocations), []);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div
      className="glass-panel p-4 w-72 max-h-80 overflow-y-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-neon-red animate-blink-alert" />
        <span className="hud-label">Smart Alerts</span>
        <span className="ml-auto font-mono text-xs neon-text-red">{alerts.length}</span>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <AlertItem
            key={alert.id}
            alert={alert}
            index={i}
            isExpanded={expanded === alert.id}
            onToggle={() => setExpanded(expanded === alert.id ? null : alert.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function AlertItem({ alert, index, isExpanded, onToggle }: {
  alert: Alert; index: number; isExpanded: boolean; onToggle: () => void;
}) {
  const Icon = iconMap[alert.type];
  const isCritical = alert.severity === "critical";
  const Toggle = isExpanded ? ChevronUp : ChevronDown;

  return (
    <motion.div
      className={`rounded-md p-2.5 border text-xs cursor-pointer transition-colors ${
        isCritical ? "border-neon-red/30 bg-neon-red/5 hover:bg-neon-red/10" : "border-neon-orange/20 bg-neon-orange/5 hover:bg-neon-orange/10"
      }`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.06, duration: 0.4 }}
      onClick={onToggle}
    >
      <div className="flex items-start gap-2">
        <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isCritical ? "text-neon-red" : "text-neon-orange"}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={`font-display text-[10px] uppercase font-bold ${isCritical ? "neon-text-red" : "neon-text-orange"}`}>
              {alert.severity}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="font-mono text-muted-foreground text-[10px] truncate">{alert.location}</span>
            <Toggle className="w-3 h-3 ml-auto text-muted-foreground shrink-0" />
          </div>
          <p className="text-foreground/80 mt-0.5 leading-tight font-body">{alert.message}</p>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 pt-2 border-t border-border/30 space-y-1.5"
            >
              <div>
                <span className="hud-label text-[8px]">Trigger Rule</span>
                <p className="font-mono text-[10px] neon-text-blue">{alert.trigger}</p>
              </div>
              <div>
                <span className="hud-label text-[8px]">Confidence</span>
                <p className="font-mono text-[10px] neon-text-green">{alert.confidence}%</p>
              </div>
              <div>
                <span className="hud-label text-[8px]">Recommended Action</span>
                <p className="text-foreground/70 text-[10px] font-body leading-tight">{alert.actionRecommended}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
