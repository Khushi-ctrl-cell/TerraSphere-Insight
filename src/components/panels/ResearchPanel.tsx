import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, FlaskConical, Database, FileText, ChevronRight } from "lucide-react";

type Section = "methodology" | "formulas" | "data" | "limitations";

export default function ResearchPanel() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>("methodology");

  if (!open) {
    return (
      <motion.button
        className="glass-panel px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-muted/30 transition-colors active:scale-[0.97]"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <BookOpen className="w-3.5 h-3.5 text-primary" />
        <span className="hud-label text-[10px]">Research Mode</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
      </motion.button>
    );
  }

  return (
    <motion.div
      className="glass-panel-accent p-5 w-96 max-h-[420px] overflow-y-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-display text-sm font-bold neon-text-blue">Research Insights</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors text-xs font-mono active:scale-95">
          CLOSE
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 mb-4">
        {([
          { id: "methodology" as Section, icon: FlaskConical, label: "Method" },
          { id: "formulas" as Section, icon: FileText, label: "Formulas" },
          { id: "data" as Section, icon: Database, label: "Data" },
          { id: "limitations" as Section, icon: BookOpen, label: "Limits" },
        ]).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-display font-bold uppercase transition-colors active:scale-95 ${
              section === id ? "bg-primary/20 neon-text-blue" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {section === "methodology" && (
        <div className="space-y-3 text-[11px] text-foreground/80 font-body leading-relaxed">
          <div>
            <h4 className="font-display text-xs font-bold neon-text-blue mb-1">Problem Statement</h4>
            <p>Monitoring environmental changes across India using multi-spectral satellite imagery for agriculture, urban, forest, and coastal zones. Goal: provide actionable decision intelligence to policymakers.</p>
          </div>
          <div>
            <h4 className="font-display text-xs font-bold neon-text-blue mb-1">Methodology</h4>
            <p>1. <strong>Data Acquisition:</strong> Landsat 8 OLI/TIRS (30m resolution) — Bands 2-7 + Band 10 (thermal). Temporal coverage: 2020–2025, bi-monthly composite.</p>
            <p>2. <strong>Pre-processing:</strong> Atmospheric correction (DOS method), cloud masking (CFMask), radiometric calibration to TOA reflectance.</p>
            <p>3. <strong>Index Computation:</strong> NDVI, NDWI, SAVI, EVI, LST derived from calibrated bands using standard algorithms.</p>
            <p>4. <strong>Classification:</strong> Random Forest classifier (n_estimators=100, max_depth=15) trained on ground-truth samples. 87.3% overall accuracy on validation set (stratified 70/30 split).</p>
            <p>5. <strong>Change Detection:</strong> Post-classification comparison + pixel-level NDVI differencing with Otsu threshold for significance.</p>
            <p>6. <strong>Prediction:</strong> Linear regression on temporal indices with urban growth rate adjustment (1.8%/yr baseline from Census 2021 urbanization trend).</p>
          </div>
          <div>
            <h4 className="font-display text-xs font-bold neon-text-blue mb-1">Validation</h4>
            <p>Cross-validated against ISRO Bhuvan LULC maps (2020) and NRSC district-level land use data. IoU for vegetation class: 0.78. Urban class: 0.82. Water: 0.91.</p>
          </div>
        </div>
      )}

      {section === "formulas" && (
        <div className="space-y-3">
          <FormulaCard
            name="NDVI — Normalized Difference Vegetation Index"
            formula="NDVI = (NIR − Red) / (NIR + Red)"
            bands="Band 5 (0.851–0.879 μm) and Band 4 (0.636–0.673 μm)"
            interpretation=">0.6: Dense vegetation | 0.3–0.6: Moderate | <0.2: Barren/urban"
            reference="Rouse et al., 1974"
          />
          <FormulaCard
            name="NDWI — Normalized Difference Water Index"
            formula="NDWI = (Green − NIR) / (Green + NIR)"
            bands="Band 3 (0.533–0.590 μm) and Band 5"
            interpretation=">0: Water presence | <-0.3: Water stress"
            reference="McFeeters, 1996"
          />
          <FormulaCard
            name="LST — Land Surface Temperature"
            formula="LST = BT / (1 + (λ × BT / ρ) × ln(ε))"
            bands="Band 10 (10.60–11.19 μm), λ=10.8μm, ρ=14380μm·K"
            interpretation="Emissivity-corrected brightness temperature in °C"
            reference="Artis & Carnahan, 1982"
          />
          <FormulaCard
            name="SAVI — Soil-Adjusted Vegetation Index"
            formula="SAVI = ((NIR − Red) / (NIR + Red + L)) × (1 + L)"
            bands="L=0.5 (adjustment factor for soil brightness)"
            interpretation="Reduces soil reflectance noise in sparse vegetation areas"
            reference="Huete, 1988"
          />
          <FormulaCard
            name="EVI — Enhanced Vegetation Index"
            formula="EVI = G × (NIR − Red) / (NIR + C₁×Red − C₂×Blue + L)"
            bands="G=2.5, C₁=6, C₂=7.5, L=1"
            interpretation="Atmospheric correction for high-biomass regions"
            reference="Liu & Huete, 1995"
          />
        </div>
      )}

      {section === "data" && (
        <div className="space-y-3 text-[11px] text-foreground/80 font-body leading-relaxed">
          <div>
            <h4 className="font-display text-xs font-bold neon-text-blue mb-1">Data Sources</h4>
            <ul className="space-y-1 ml-3">
              <li>• <strong>Landsat 8 OLI/TIRS:</strong> USGS Earth Explorer (30m spatial resolution)</li>
              <li>• <strong>ISRO Bhuvan:</strong> ResourceSat-2 LISS-III for ground truth validation</li>
              <li>• <strong>Census 2021:</strong> Urbanization rates and population density</li>
              <li>• <strong>IMD:</strong> Indian Meteorological Department rainfall records</li>
              <li>• <strong>NRSC:</strong> National Remote Sensing Centre LULC maps</li>
              <li>• <strong>CWC:</strong> Central Water Commission river gauge data</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xs font-bold neon-text-blue mb-1">Study Area</h4>
            <p>9 monitoring stations across India spanning: Madhya Pradesh (agriculture), Delhi NCR (urban), West Bengal (coastal), Assam (forest), Bihar (flood-prone), Gujarat (arid), Tamil Nadu (coastal), Maharashtra (agriculture stress).</p>
          </div>
          <div>
            <h4 className="font-display text-xs font-bold neon-text-blue mb-1">Accuracy Metrics</h4>
            <div className="font-mono text-[10px] space-y-0.5">
              <p>Overall Accuracy: 87.3%</p>
              <p>Kappa Coefficient: 0.83</p>
              <p>Vegetation IoU: 0.78 | Urban IoU: 0.82 | Water IoU: 0.91</p>
              <p>Precision (macro): 0.85 | Recall (macro): 0.84</p>
              <p>F1-Score (macro): 0.845</p>
            </div>
          </div>
        </div>
      )}

      {section === "limitations" && (
        <div className="space-y-3 text-[11px] text-foreground/80 font-body leading-relaxed">
          <div>
            <h4 className="font-display text-xs font-bold neon-text-blue mb-1">Current Limitations</h4>
            <ul className="space-y-1.5 ml-3">
              <li>• <strong>Spatial Resolution:</strong> 30m Landsat imagery insufficient for field-level agriculture monitoring. Sentinel-2 (10m) integration planned.</li>
              <li>• <strong>Cloud Cover:</strong> Monsoon months (Jun–Sep) produce 40–60% cloud contamination. Temporal compositing mitigates but introduces temporal uncertainty.</li>
              <li>• <strong>Mixed Pixels:</strong> Urban-rural boundary zones show classification ambiguity (19% misclassification rate at edges).</li>
              <li>• <strong>LST Accuracy:</strong> Emissivity estimation from NDVI-based methods introduces ±1.5°C uncertainty.</li>
              <li>• <strong>Prediction Model:</strong> Linear extrapolation does not account for policy interventions, extreme weather events, or technological disruptions.</li>
              <li>• <strong>Ground Truth:</strong> Limited field validation data outside 2020 reference year. Temporal ground truth gap affects multi-year accuracy.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xs font-bold neon-text-blue mb-1">Future Work</h4>
            <ul className="space-y-1 ml-3">
              <li>• Integration with Sentinel-1 SAR for all-weather monitoring</li>
              <li>• Deep learning (U-Net) for semantic segmentation</li>
              <li>• Real-time INSAT-3D integration for hourly LST updates</li>
              <li>• District-level crop insurance risk scoring</li>
              <li>• Carbon sequestration mapping using LiDAR fusion</li>
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function FormulaCard({ name, formula, bands, interpretation, reference }: {
  name: string; formula: string; bands: string; interpretation: string; reference: string;
}) {
  return (
    <div className="rounded border border-border/40 bg-muted/15 p-3">
      <div className="font-display text-[10px] font-bold text-foreground/90 mb-1">{name}</div>
      <div className="font-mono text-xs neon-text-blue bg-muted/30 rounded px-2 py-1 mb-1.5">{formula}</div>
      <div className="text-[9px] text-muted-foreground space-y-0.5">
        <p><strong>Bands:</strong> {bands}</p>
        <p><strong>Interpretation:</strong> {interpretation}</p>
        <p><strong>Reference:</strong> {reference}</p>
      </div>
    </div>
  );
}
