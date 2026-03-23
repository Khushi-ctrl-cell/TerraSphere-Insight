import { motion, AnimatePresence } from "framer-motion";
import { useApp, useCaseConfig, roleConfig } from "@/contexts/AppContext";
import { indianLocations, computeChangeDetections, generateSmartAlerts, generatePredictions, explainLocationAI, computeGlobalMetrics } from "@/data/mockData";
import { FileText, X, Download, MapPin, Shield, AlertTriangle, TrendingDown, Brain } from "lucide-react";
import { useMemo, useRef } from "react";

export default function ReportPanel() {
  const { reportOpen, setReportOpen, useCase, role, selectedLocation, timeYear, simulation } = useApp();
  const reportRef = useRef<HTMLDivElement>(null);

  const loc = selectedLocation ?? indianLocations[0];
  const metrics = useMemo(() => computeGlobalMetrics(indianLocations), []);
  const changes = useMemo(() => computeChangeDetections(indianLocations), []);
  const alerts = useMemo(() => generateSmartAlerts(indianLocations), []);
  const predictions = useMemo(() => generatePredictions(indianLocations, 2030), []);
  const aiExplanation = useMemo(() => explainLocationAI(loc), [loc]);

  const handleDownload = () => {
    if (!reportRef.current) return;
    // Generate text-based report for download
    const lines: string[] = [
      "═══════════════════════════════════════════════════════════════",
      "          DIGITAL TWIN OF EARTH — MISSION REPORT",
      "          India Focus Module · Earth Intelligence System",
      "═══════════════════════════════════════════════════════════════",
      "",
      `Generated: ${new Date().toLocaleString("en-IN")}`,
      `Mode: ${useCaseConfig[useCase].label} | Role: ${roleConfig[role].label}`,
      "",
      "── LOCATION SUMMARY ──────────────────────────────────────────",
      `Location: ${loc.name}, ${loc.state}`,
      `Coordinates: ${loc.lat.toFixed(2)}°N, ${loc.lon.toFixed(2)}°E`,
      `Risk Level: ${loc.riskLevel.toUpperCase()}`,
      `Confidence: ${loc.confidence}%`,
      `Category: ${loc.category}`,
      "",
      "── SCIENTIFIC INDICES ─────────────────────────────────────────",
      `NDVI (Vegetation Health): ${loc.ndvi}`,
      `NDWI (Water Index): ${loc.ndwi}`,
      `LST (Land Surface Temp): ${loc.lst}°C`,
      `SAVI: ${loc.savi}`,
      `EVI: ${loc.evi}`,
      "",
      "── LAND COVER ────────────────────────────────────────────────",
      `Vegetation: ${loc.vegetation}%`,
      `Urban: ${loc.urban}%`,
      `Water: ${loc.water}%`,
      `Barren: ${loc.barren}%`,
      "",
      "── CHANGE DETECTION (2020–2025) ───────────────────────────────",
      ...changes.slice(0, 5).map(c =>
        `${c.region}: ${c.before} → ${c.after} (${c.changePercent > 0 ? "+" : ""}${c.changePercent}%) [${c.severity}]`
      ),
      "",
      "── ACTIVE ALERTS ─────────────────────────────────────────────",
      ...alerts.map(a => `[${a.severity.toUpperCase()}] ${a.location}: ${a.message}`),
      "",
      "── AI PREDICTIONS (2030) ─────────────────────────────────────",
      `NDVI: ${predictions.ndvi} | Urban: ${predictions.urban}%`,
      `Temperature: ${predictions.temperature}°C | Health Score: ${predictions.healthScore}/100`,
      `Confidence: ${predictions.confidence}%`,
      "",
      "── AI ANALYSIS ───────────────────────────────────────────────",
      aiExplanation.summary,
      "",
      "Contributing Factors:",
      ...aiExplanation.factors.map(f => `  ${f.impact === "negative" ? "▼" : f.impact === "positive" ? "▲" : "─"} ${f.factor} (w=${f.weight}): ${f.detail}`),
      "",
      "Decision Support:",
      aiExplanation.decisionSupport,
      "",
    ];

    if (simulation.urbanGrowth > 0 || simulation.vegetationLoss > 0 || simulation.temperatureRise > 0) {
      lines.push(
        "── SIMULATION PARAMETERS ─────────────────────────────────────",
        `Urban Growth: +${simulation.urbanGrowth}%`,
        `Vegetation Loss: -${simulation.vegetationLoss}%`,
        `Temperature Rise: +${simulation.temperatureRise}°C`,
        "",
      );
    }

    lines.push(
      "── GLOBAL METRICS ────────────────────────────────────────────",
      `Earth Health Index: ${metrics.healthScore}/100`,
      `Average NDVI: ${metrics.avgNDVI}`,
      `Model Accuracy: ${metrics.modelAccuracy}%`,
      `Critical Zones: ${metrics.criticalZones}`,
      "",
      "═══════════════════════════════════════════════════════════════",
      "  Methodology: Landsat 8 OLI/TIRS · Random Forest · 87.3% OA",
      "  Validated against ISRO Bhuvan LULC maps",
      "═══════════════════════════════════════════════════════════════",
    );

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EarthIntel_Report_${loc.name}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {reportOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setReportOpen(false)} />

          {/* Report */}
          <motion.div
            ref={reportRef}
            className="glass-panel-accent relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-lg font-bold neon-text-blue">Mission Report</h2>
                </div>
                <p className="hud-label text-[10px] mt-1">
                  Generated {new Date().toLocaleString("en-IN")} · {useCaseConfig[useCase].label} Mode · {roleConfig[role].label} View
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="glass-panel px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-display font-bold uppercase hover:bg-muted/30 transition-colors active:scale-95"
                >
                  <Download className="w-3 h-3" />
                  Export
                </button>
                <button onClick={() => setReportOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors active:scale-95">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Location Summary */}
            <Section title="Location Summary" icon={<MapPin className="w-3.5 h-3.5" />}>
              <div className="grid grid-cols-3 gap-2">
                <InfoCell label="Location" value={`${loc.name}, ${loc.state}`} />
                <InfoCell label="Coordinates" value={`${loc.lat.toFixed(2)}°N, ${loc.lon.toFixed(2)}°E`} />
                <InfoCell label="Category" value={loc.category} />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <InfoCell label="NDVI" value={String(loc.ndvi)} highlight={loc.ndvi < 0.3 ? "red" : "green"} />
                <InfoCell label="NDWI" value={String(loc.ndwi)} highlight={loc.ndwi < -0.3 ? "red" : "green"} />
                <InfoCell label="LST" value={`${loc.lst}°C`} highlight={loc.lst > 38 ? "red" : "green"} />
                <InfoCell label="Health" value={`${loc.healthScore}/100`} highlight={loc.healthScore < 40 ? "red" : "green"} />
              </div>
            </Section>

            {/* Risk Assessment */}
            <Section title="Risk Assessment" icon={<Shield className="w-3.5 h-3.5" />}>
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-display font-bold uppercase ${
                  loc.riskLevel === "critical" ? "bg-neon-red/15 neon-text-red" :
                  loc.riskLevel === "high" ? "bg-neon-orange/15 neon-text-orange" :
                  "bg-neon-green/15 neon-text-green"
                }`}>
                  {loc.riskLevel === "critical" && <span className="w-2 h-2 rounded-full bg-neon-red animate-blink-alert" />}
                  {loc.riskLevel} risk
                </div>
                <span className="font-mono text-xs neon-text-blue">{loc.confidence}% confidence</span>
              </div>
            </Section>

            {/* Active Alerts */}
            <Section title={`Active Alerts (${alerts.length})`} icon={<AlertTriangle className="w-3.5 h-3.5" />}>
              <div className="space-y-1.5">
                {alerts.slice(0, 4).map(a => (
                  <div key={a.id} className={`rounded border p-2 text-[11px] ${
                    a.severity === "critical" ? "border-neon-red/20 bg-neon-red/5" : "border-neon-orange/20 bg-neon-orange/5"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-display text-[10px] font-bold uppercase ${a.severity === "critical" ? "neon-text-red" : "neon-text-orange"}`}>
                        {a.severity}
                      </span>
                      <span className="font-mono text-muted-foreground">{a.location}</span>
                    </div>
                    <p className="text-foreground/80 mt-0.5 font-body">{a.message}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Change Detection */}
            <Section title="Change Detection (2020–2025)" icon={<TrendingDown className="w-3.5 h-3.5" />}>
              <div className="space-y-1">
                {changes.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] font-mono py-1 border-b border-border/20 last:border-0">
                    <span className="text-foreground/80">{c.region}</span>
                    <span className="text-muted-foreground">{c.before} → {c.after}</span>
                    <span className={c.changePercent < 0 ? "neon-text-red" : "neon-text-green"}>
                      {c.changePercent > 0 ? "+" : ""}{c.changePercent}%
                    </span>
                    <span className="text-muted-foreground text-[9px]">{c.severity}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* AI Analysis */}
            <Section title="AI Analysis" icon={<Brain className="w-3.5 h-3.5" />}>
              <p className="text-[11px] text-foreground/80 font-body leading-relaxed mb-2">{aiExplanation.summary}</p>
              <div className="rounded border border-primary/20 bg-primary/5 p-2.5">
                <p className="text-[11px] text-foreground/80 font-body">{aiExplanation.decisionSupport}</p>
              </div>
            </Section>

            {/* Predictions */}
            <Section title="2030 Predictions">
              <div className="grid grid-cols-4 gap-2">
                <InfoCell label="NDVI" value={String(predictions.ndvi)} highlight="orange" />
                <InfoCell label="Urban" value={`${predictions.urban}%`} />
                <InfoCell label="Temp" value={`${predictions.temperature}°C`} highlight="red" />
                <InfoCell label="Confidence" value={`${predictions.confidence}%`} />
              </div>
            </Section>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-border/30">
              <p className="text-[9px] text-muted-foreground font-mono text-center">
                Methodology: Landsat 8 OLI/TIRS · Random Forest (87.3% OA) · Validated vs ISRO Bhuvan LULC
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-2">
        {icon && <span className="text-primary">{icon}</span>}
        <h3 className="font-display text-xs font-bold neon-text-blue uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoCell({ label, value, highlight }: { label: string; value: string; highlight?: "red" | "green" | "orange" }) {
  const colorClass = highlight === "red" ? "neon-text-red" : highlight === "green" ? "neon-text-green" : highlight === "orange" ? "neon-text-orange" : "text-foreground/90";
  return (
    <div className="rounded border border-border/30 bg-muted/20 p-2">
      <div className="font-mono text-[8px] text-muted-foreground uppercase">{label}</div>
      <div className={`font-display text-[11px] font-bold ${colorClass}`}>{value}</div>
    </div>
  );
}
