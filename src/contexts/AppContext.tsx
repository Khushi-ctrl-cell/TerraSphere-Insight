import { createContext, useContext, useState, type ReactNode } from "react";
import type { LocationData } from "@/data/mockData";

// ─── Use-Case Modes ─────────────────────────────────────────────────────────
export type UseCase = "agriculture" | "drought" | "urban" | "flood";

export const useCaseConfig: Record<UseCase, {
  label: string;
  icon: string;
  color: string;
  metrics: string[];
  description: string;
}> = {
  agriculture: {
    label: "Agriculture",
    icon: "🌾",
    color: "neon-green",
    metrics: ["ndvi", "savi", "soilMoisture", "cropHealth", "yieldForecast"],
    description: "Crop health, irrigation, yield prediction",
  },
  drought: {
    label: "Drought",
    icon: "☀️",
    color: "neon-orange",
    metrics: ["ndwi", "lst", "soilMoisture", "precipitation", "waterStress"],
    description: "Water scarcity, temperature stress, aridity",
  },
  urban: {
    label: "Urban",
    icon: "🏙️",
    color: "neon-purple",
    metrics: ["lst", "urban", "ndvi", "heatIsland", "airQuality"],
    description: "Urban sprawl, heat islands, green cover",
  },
  flood: {
    label: "Flood Risk",
    icon: "🌊",
    color: "neon-blue",
    metrics: ["ndwi", "water", "elevation", "drainage", "precipitation"],
    description: "Inundation risk, water levels, drainage",
  },
};

// ─── User Roles ─────────────────────────────────────────────────────────────
export type UserRole = "scientist" | "policymaker" | "farmer";

export const roleConfig: Record<UserRole, {
  label: string;
  icon: string;
  detailLevel: "full" | "summary" | "simple";
  showFormulas: boolean;
  showBands: boolean;
  showConfidence: boolean;
  description: string;
}> = {
  scientist: {
    label: "Scientist",
    icon: "🔬",
    detailLevel: "full",
    showFormulas: true,
    showBands: true,
    showConfidence: true,
    description: "Full data, indices, bands, formulas",
  },
  policymaker: {
    label: "Policy Maker",
    icon: "📋",
    detailLevel: "summary",
    showFormulas: false,
    showBands: false,
    showConfidence: true,
    description: "Risks, recommendations, decisions",
  },
  farmer: {
    label: "Farmer",
    icon: "🌱",
    detailLevel: "simple",
    showFormulas: false,
    showBands: false,
    showConfidence: false,
    description: "Crop health, irrigation, simple advice",
  },
};

// ─── Simulation Parameters ──────────────────────────────────────────────────
export interface SimulationParams {
  urbanGrowth: number;      // % increase
  vegetationLoss: number;   // % decrease
  temperatureRise: number;  // °C increase
}

export interface SimulationResult {
  ndvi: number;
  ndwi: number;
  lst: number;
  healthScore: number;
  forestLoss: number;
  waterStress: "low" | "moderate" | "high" | "critical";
  impactSummary: string[];
}

// ─── Context ────────────────────────────────────────────────────────────────
interface AppContextType {
  useCase: UseCase;
  setUseCase: (uc: UseCase) => void;
  role: UserRole;
  setRole: (r: UserRole) => void;
  selectedLocation: LocationData | null;
  setSelectedLocation: (loc: LocationData | null) => void;
  simulation: SimulationParams;
  setSimulation: (s: SimulationParams) => void;
  timeYear: number;
  setTimeYear: (y: number) => void;
  reportOpen: boolean;
  setReportOpen: (o: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [useCase, setUseCase] = useState<UseCase>("agriculture");
  const [role, setRole] = useState<UserRole>("scientist");
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [simulation, setSimulation] = useState<SimulationParams>({
    urbanGrowth: 0,
    vegetationLoss: 0,
    temperatureRise: 0,
  });
  const [timeYear, setTimeYear] = useState(2025);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <AppContext.Provider value={{
      useCase, setUseCase,
      role, setRole,
      selectedLocation, setSelectedLocation,
      simulation, setSimulation,
      timeYear, setTimeYear,
      reportOpen, setReportOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be within AppProvider");
  return ctx;
}
