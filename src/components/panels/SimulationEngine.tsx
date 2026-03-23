import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { useMemo } from "react";
import { indianLocations, calculateNDVI, calculateNDWI, calculateLST } from "@/data/mockData";
import { Sliders, RotateCcw, Zap } from "lucide-react";

export default function SimulationEngine() {
  const { simulation, setSimulation, role } = useApp();
  const isActive = simulation.urbanGrowth > 0 || simulation.vegetationLoss > 0 || simulation.temperatureRise > 0;

  // Compute simulated results from current data + simulation params
  const result = useMemo(() => {
    const avgLoc = indianLocations[0]; // Use Bhopal as reference
    const bands = { ...avgLoc.bands };

    // Adjust bands based on simulation
    const nirAdjust = 1 - (simulation.vegetationLoss / 100) * 0.4;
    const redAdjust = 1 + (simulation.urbanGrowth / 100) * 0.3;
    const adjustedNIR = bands.nir * nirAdjust;
    const adjustedRed = bands.red * redAdjust;
    const adjustedGreen = bands.green * (1 - simulation.vegetationLoss / 200);
    const adjustedTirs = bands.tirs + simulation.temperatureRise * 2.5;

    const ndvi = calculateNDVI(adjustedNIR, adjustedRed);
    const ndwi = calculateNDWI(adjustedGreen, adjustedNIR);
    const lst = calculateLST(adjustedTirs, 0.97);

    const baseNDVI = calculateNDVI(bands.nir, bands.red);
    const baseLST = calculateLST(bands.tirs, 0.97);

    const forestLoss = simulation.vegetationLoss + simulation.urbanGrowth * 0.5;
    const tempRise = lst - baseLST;

    const waterStress: "low" | "moderate" | "high" | "critical" =
      ndwi < -0.4 ? "critical" : ndwi < -0.2 ? "high" : ndwi < 0 ? "moderate" : "low";

    const healthScore = Math.round(Math.max(0, Math.min(100,
      ndvi * 80 + (40 - Math.max(0, lst - 30)) * 1.2
    )));

    const impacts: string[] = [];
    if (forestLoss > 10) impacts.push(`Forest Loss: -${Math.round(forestLoss)}%`);
    if (tempRise > 0.5) impacts.push(`Temperature Rise: +${tempRise.toFixed(1)}°C`);
    if (waterStress === "high" || waterStress === "critical") impacts.push(`Water Stress: ${waterStress.toUpperCase()}`);
    if (ndvi < 0.3) impacts.push(`Vegetation Critical: NDVI ${ndvi.toFixed(3)}`);
    if (simulation.urbanGrowth > 20) impacts.push(`Urban Heat Island: +${(simulation.urbanGrowth * 0.05).toFixed(1)}°C`);

    return { ndvi, ndwi, lst, healthScore, forestLoss, waterStress, impacts, tempRise, baseNDVI };
  }, [simulation]);

  const reset = () => setSimulation({ urbanGrowth: 0, vegetationLoss: 0, temperatureRise: 0 });

  return (
    <motion.div
      className="glass-panel-accent p-4 w-72"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          <span className="hud-label">What-If Simulation</span>
        </div>
        {isActive && (
          <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors active:scale-95">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-4">
        <SimSlider
          label="Urban Growth"
          value={simulation.urbanGrowth}
          max={50}
          unit="%"
          color="neon-purple"
          onChange={(v) => setSimulation({ ...simulation, urbanGrowth: v })}
        />
        <SimSlider
          label="Vegetation Loss"
          value={simulation.vegetationLoss}
          max={80}
          unit="%"
          color="neon-orange"
          onChange={(v) => setSimulation({ ...simulation, vegetationLoss: v })}
        />
        <SimSlider
          label="Temp. Increase"
          value={simulation.temperatureRise}
          max={5}
          unit="°C"
          step={0.1}
          color="neon-red"
          onChange={(v) => setSimulation({ ...simulation, temperatureRise: v })}
        />
      </div>

      {/* Results */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-border/30 pt-3 space-y-2"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="w-3 h-3 text-neon-orange" />
            <span className="hud-label text-[9px]">Simulation Impact</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ResultBox label="NDVI" value={result.ndvi.toFixed(3)} bad={result.ndvi < 0.3} />
            <ResultBox label="LST" value={`${result.lst.toFixed(1)}°C`} bad={result.lst > 38} />
            <ResultBox label="Health" value={`${result.healthScore}/100`} bad={result.healthScore < 40} />
            <ResultBox label="Water" value={result.waterStress} bad={result.waterStress === "high" || result.waterStress === "critical"} />
          </div>

          {result.impacts.length > 0 && (
            <div className="rounded border border-neon-red/20 bg-neon-red/5 p-2 mt-2">
              {result.impacts.map((imp, i) => (
                <p key={i} className="text-[10px] font-mono neon-text-red leading-relaxed">{imp}</p>
              ))}
            </div>
          )}

          {role !== "scientist" && (
            <div className="rounded border border-primary/20 bg-primary/5 p-2">
              <p className="text-[10px] text-foreground/80 font-body">
                {result.healthScore < 30
                  ? "⚠️ Critical scenario. Immediate policy intervention needed — restrict urban expansion, mandate afforestation."
                  : result.healthScore < 60
                  ? "⚡ Moderate risk. Increase green cover targets by 15%, enforce wetland protection policies."
                  : "✅ Manageable scenario. Continue current conservation practices."}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function SimSlider({ label, value, max, unit, step = 1, color, onChange }: {
  label: string; value: number; max: number; unit: string; step?: number; color: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono text-[10px] text-muted-foreground">{label}</span>
        <span className={`font-mono text-[10px] font-bold ${value > 0 ? `neon-text-${color === "neon-purple" ? "purple" : color === "neon-orange" ? "orange" : "red"}` : "text-muted-foreground"}`}>
          {step < 1 ? value.toFixed(1) : value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none rounded-full bg-muted cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:shadow-[0_0_8px_hsl(var(--neon-blue))]
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}

function ResultBox({ label, value, bad }: { label: string; value: string; bad: boolean }) {
  return (
    <div className="rounded border border-border/40 bg-muted/20 p-1.5 text-center">
      <div className="font-mono text-[8px] text-muted-foreground uppercase">{label}</div>
      <div className={`font-display text-[11px] font-bold ${bad ? "neon-text-red" : "neon-text-green"}`}>{value}</div>
    </div>
  );
}
