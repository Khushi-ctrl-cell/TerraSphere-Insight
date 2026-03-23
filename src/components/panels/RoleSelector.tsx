import { motion } from "framer-motion";
import { useApp, roleConfig, type UserRole } from "@/contexts/AppContext";

export default function RoleSelector() {
  const { role, setRole } = useApp();

  return (
    <motion.div
      className="glass-panel px-3 py-2 flex items-center gap-1"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <span className="hud-label text-[9px] mr-1">ROLE</span>
      {(Object.entries(roleConfig) as [UserRole, typeof roleConfig[UserRole]][]).map(([key, cfg]) => (
        <button
          key={key}
          onClick={() => setRole(key)}
          className={`px-2 py-1 rounded text-[10px] font-display font-bold uppercase transition-all active:scale-95 ${
            role === key
              ? "bg-primary/20 neon-text-blue"
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
