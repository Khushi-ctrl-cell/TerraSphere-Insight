import { motion } from "framer-motion";

interface Props {
  year: number;
  onChange: (year: number) => void;
}

const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

export default function TimeSlider({ year, onChange }: Props) {
  return (
    <motion.div
      className="glass-panel px-6 py-3 flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="hud-label whitespace-nowrap">Time Travel</div>
      <input
        type="range"
        min={2020}
        max={2030}
        value={year}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 appearance-none rounded-full bg-muted cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:shadow-[0_0_10px_hsl(var(--neon-blue))]
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <div className="font-display text-sm font-bold neon-text-blue tabular-nums w-12 text-right">{year}</div>
      <div className={`text-[10px] font-mono ${year > 2025 ? "neon-text-purple" : "text-muted-foreground"}`}>
        {year > 2025 ? "PREDICTED" : "OBSERVED"}
      </div>
    </motion.div>
  );
}
