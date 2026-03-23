import { motion } from "framer-motion";
import { indianLocations, generateTimeSeries } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { useMemo } from "react";

export default function TimeSeriesChart() {
  const data = useMemo(() => generateTimeSeries(indianLocations), []);

  return (
    <motion.div
      className="glass-panel p-4 w-80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="hud-label mb-1">Computed Trend Analysis · 2020–2025</div>
      <div className="text-[8px] font-mono text-muted-foreground mb-2">Derived from avg. NDVI across {indianLocations.length} stations</div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="vegGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--neon-green))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--neon-green))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="urbanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--neon-purple))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--neon-purple))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="year" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))", fontFamily: "Share Tech Mono" }} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))", fontFamily: "Share Tech Mono" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 11,
                fontFamily: "Share Tech Mono",
              }}
            />
            <Area type="monotone" dataKey="vegetation" stroke="hsl(var(--neon-green))" fill="url(#vegGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="urban" stroke="hsl(var(--neon-purple))" fill="url(#urbanGrad)" strokeWidth={2} />
            <Line type="monotone" dataKey="temperature" stroke="hsl(var(--neon-orange))" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-2 justify-center">
        <Legend color="bg-neon-green" label="Vegetation %" />
        <Legend color="bg-neon-purple" label="Urban %" />
        <Legend color="bg-neon-orange" label="Temp °C" />
      </div>
    </motion.div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="font-mono text-[9px] text-muted-foreground">{label}</span>
    </div>
  );
}
