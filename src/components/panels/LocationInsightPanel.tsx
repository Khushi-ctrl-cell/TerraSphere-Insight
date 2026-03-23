import { motion, AnimatePresence } from "framer-motion";
import { type LocationData, explainLocationAI } from "@/data/mockData";
import { X, MapPin, Leaf, Building2, Droplets, Thermometer, Brain, Sprout, Shield, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useMemo, useState } from "react";

interface Props {
  location: LocationData | null;
  onClose: () => void;
}

type Tab = "indices" | "agriculture" | "ai";

export default function LocationInsightPanel({ location, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("indices");
  const explanation = useMemo(() => location ? explainLocationAI(location) : null, [location]);

  return (
    <AnimatePresence>
      {location && (
        <motion.div
          className="glass-panel-accent p-5 w-[340px] max-h-[480px] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <h3 className="font-display text-sm font-bold neon-text-blue">{location.name}</h3>
              </div>
              <p className="hud-label text-[10px] mt-0.5">{location.state} · {location.lat.toFixed(2)}°N, {location.lon.toFixed(2)}°E</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors active:scale-95">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Risk + Confidence badges */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-display font-bold uppercase ${
              location.riskLevel === "critical" ? "bg-neon-red/15 neon-text-red" :
              location.riskLevel === "high" ? "bg-neon-orange/15 neon-text-orange" :
              "bg-neon-green/15 neon-text-green"
            }`}>
              {location.riskLevel === "critical" && <span className="w-1.5 h-1.5 rounded-full bg-neon-red animate-blink-alert" />}
              {location.riskLevel} risk
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-display font-bold bg-primary/10 neon-text-blue">
              <Shield className="w-2.5 h-2.5" /> {location.confidence}% conf.
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mb-3">
            {(["indices", ...(location.agriculture ? ["agriculture"] : []), "ai"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-2 py-1 rounded text-[10px] font-display font-bold uppercase transition-colors active:scale-95 ${
                  tab === t ? "bg-primary/20 neon-text-blue" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "indices" ? "Science" : t === "agriculture" ? "Agri" : "AI Why"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "indices" && (
            <div>
              {/* Scientific Indices — computed from bands */}
              <div className="hud-label mb-2">Computed Indices (Landsat 8 Bands)</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <IndexCard label="NDVI" value={location.ndvi} good={location.ndvi > 0.5} formula="(B5−B4)/(B5+B4)" />
                <IndexCard label="NDWI" value={location.ndwi} good={location.ndwi > 0} formula="(B3−B5)/(B3+B5)" />
                <IndexCard label="LST" value={location.lst} good={location.lst < 35} unit="°C" />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <IndexCard label="SAVI" value={location.savi} good={location.savi > 0.4} formula="(1+L)(NIR−R)/(NIR+R+L)" />
                <IndexCard label="EVI" value={location.evi} good={location.evi > 0.3} formula="G(NIR−R)/(NIR+C₁R−C₂B+L)" />
              </div>

              {/* Raw bands */}
              <div className="hud-label mb-2">Band Reflectance</div>
              <div className="grid grid-cols-3 gap-1 mb-3">
                {(["blue", "green", "red", "nir", "swir1", "tirs"] as const).map(b => (
                  <div key={b} className="text-center p-1 rounded border border-border/30 bg-muted/20">
                    <div className="font-mono text-[8px] text-muted-foreground uppercase">{b}</div>
                    <div className="font-mono text-[10px] text-foreground/80">{location.bands[b]}</div>
                  </div>
                ))}
              </div>

              {/* Land Cover */}
              <div className="hud-label mb-2">Land Cover</div>
              <div className="space-y-1.5 mb-3">
                <MetricBar icon={<Leaf className="w-3 h-3" />} label="Vegetation" value={location.vegetation} color="bg-neon-green" />
                <MetricBar icon={<Building2 className="w-3 h-3" />} label="Urban" value={location.urban} color="bg-neon-purple" />
                <MetricBar icon={<Droplets className="w-3 h-3" />} label="Water" value={location.water} color="bg-neon-blue" />
                {location.barren > 0 && <MetricBar icon={<Thermometer className="w-3 h-3" />} label="Barren" value={location.barren} color="bg-neon-orange" />}
              </div>

              {/* NDVI Trend */}
              <div className="hud-label mb-1">NDVI Trend (2020–2025)</div>
              <div className="flex items-end gap-[3px] h-8 mb-1">
                {location.historicalNDVI.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-neon-green transition-all"
                    style={{ height: `${(v / 1) * 100}%`, opacity: 0.4 + (i / location.historicalNDVI.length) * 0.6 }}
                  />
                ))}
              </div>
              <div className="flex justify-between font-mono text-[8px] text-muted-foreground">
                <span>2020: {location.historicalNDVI[0]}</span>
                <span>2025: {location.historicalNDVI[location.historicalNDVI.length - 1]}</span>
              </div>
            </div>
          )}

          {tab === "agriculture" && location.agriculture && (
            <div>
              <div className="hud-label mb-2">
                <Sprout className="w-3 h-3 inline mr-1" />
                Agriculture Intelligence
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded border border-border/40 bg-muted/20 p-2">
                  <div className="font-mono text-[9px] text-muted-foreground">Crop</div>
                  <div className="font-display text-[11px] font-bold text-foreground/90">{location.agriculture.cropType}</div>
                </div>
                <div className="rounded border border-border/40 bg-muted/20 p-2">
                  <div className="font-mono text-[9px] text-muted-foreground">Growth Stage</div>
                  <div className="font-display text-[11px] font-bold text-foreground/90">{location.agriculture.growthStage}</div>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <MetricBar icon={<Leaf className="w-3 h-3" />} label="Crop Health" value={location.agriculture.cropHealthScore} color="bg-neon-green" />
                <MetricBar icon={<Droplets className="w-3 h-3" />} label="Soil Moisture" value={Math.round(location.agriculture.soilMoisture * 100)} color="bg-neon-blue" />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded border border-border/40 bg-muted/20 p-2">
                  <div className="font-mono text-[9px] text-muted-foreground">Irrigation Need</div>
                  <div className={`font-display text-[11px] font-bold uppercase ${
                    location.agriculture.irrigationNeed === "critical" ? "neon-text-red" :
                    location.agriculture.irrigationNeed === "high" ? "neon-text-orange" :
                    "neon-text-green"
                  }`}>{location.agriculture.irrigationNeed}</div>
                </div>
                <div className="rounded border border-border/40 bg-muted/20 p-2">
                  <div className="font-mono text-[9px] text-muted-foreground">Yield Forecast</div>
                  <div className="font-display text-[11px] font-bold neon-text-blue">{location.agriculture.yieldPrediction} t/ha</div>
                </div>
              </div>

              <div className="hud-label mb-1">Decision Support</div>
              <div className="rounded border border-neon-green/20 bg-neon-green/5 p-2.5">
                <p className="text-[11px] text-foreground/80 leading-relaxed font-body">{location.agriculture.recommendation}</p>
              </div>
            </div>
          )}

          {tab === "ai" && explanation && (
            <div>
              <div className="hud-label mb-2">
                <Brain className="w-3 h-3 inline mr-1" />
                Explainable AI Analysis
              </div>
              <p className="text-[11px] text-foreground/80 leading-relaxed font-body mb-3">{explanation.summary}</p>

              <div className="hud-label mb-1.5">Contributing Factors</div>
              <div className="space-y-1.5 mb-3">
                {explanation.factors.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 rounded border border-border/30 bg-muted/15 p-2">
                    <span className="mt-0.5">
                      {f.impact === "negative" ? <TrendingDown className="w-3 h-3 text-neon-red" /> :
                       f.impact === "positive" ? <TrendingUp className="w-3 h-3 text-neon-green" /> :
                       <Minus className="w-3 h-3 text-muted-foreground" />}
                    </span>
                    <div>
                      <div className="font-display text-[10px] font-bold text-foreground/90">
                        {f.factor}
                        <span className="ml-1 font-mono text-[8px] text-muted-foreground">w={f.weight}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-tight">{f.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hud-label mb-1">Decision Support</div>
              <div className="rounded border border-primary/20 bg-primary/5 p-2 mb-3">
                <p className="text-[11px] text-foreground/80 font-body">{explanation.decisionSupport}</p>
              </div>

              <div className="hud-label mb-1">Methodology</div>
              <p className="text-[9px] text-muted-foreground font-mono leading-relaxed">{explanation.methodology}</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IndexCard({ label, value, good, formula, unit }: { label: string; value: number; good: boolean; formula?: string; unit?: string }) {
  return (
    <div className="rounded border border-border/50 bg-muted/30 p-2 text-center">
      <div className="font-display text-[10px] text-muted-foreground">{label}</div>
      <div className={`font-mono text-sm font-bold ${good ? "neon-text-green" : "neon-text-orange"}`}>
        {typeof value === "number" ? (value % 1 === 0 ? value : value.toFixed(3)) : value}{unit}
      </div>
      {formula && <div className="font-mono text-[7px] text-muted-foreground mt-0.5">{formula}</div>}
    </div>
  );
}

function MetricBar({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-mono text-[10px] w-20 text-muted-foreground">{label}</span>
      <div className="metric-bar flex-1">
        <motion.div
          className={`metric-bar-fill ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="font-mono text-xs w-8 text-right text-foreground/80">{value}%</span>
    </div>
  );
}
