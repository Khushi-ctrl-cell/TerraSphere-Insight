import { motion } from "framer-motion";
import { useApp, useCaseConfig, type UseCase } from "@/contexts/AppContext";

export default function UseCaseSelector() {
  const { useCase, setUseCase } = useApp();

  return (
    <motion.div
      className="glass-panel px-3 py-2 flex items-center gap-1"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <span className="hud-label text-[9px] mr-1">MODE</span>
      {(Object.entries(useCaseConfig) as [UseCase, typeof useCaseConfig[UseCase]][]).map(([key, cfg]) => (
        <button
          key={key}
          onClick={() => setUseCase(key)}
          className={`px-2 py-1 rounded text-[10px] font-display font-bold uppercase transition-all active:scale-95 ${
            useCase === key
              ? `bg-${cfg.color}/20 neon-text-${cfg.color === "neon-green" ? "green" : cfg.color === "neon-orange" ? "orange" : cfg.color === "neon-purple" ? "purple" : "blue"}`
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="mr-1">{cfg.icon}</span>
          {cfg.label}
        </button>
      ))}
    </motion.div>
  );
}
