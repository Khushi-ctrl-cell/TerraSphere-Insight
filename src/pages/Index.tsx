import EarthGlobe from "@/components/earth/EarthGlobe";
import TopBar from "@/components/panels/TopBar";
import HealthScorePanel from "@/components/panels/HealthScorePanel";
import AlertsPanel from "@/components/panels/AlertsPanel";
import LocationInsightPanel from "@/components/panels/LocationInsightPanel";
import PredictionPanel from "@/components/panels/PredictionPanel";
import MetricsPanel from "@/components/panels/MetricsPanel";
import TimeSlider from "@/components/panels/TimeSlider";
import TimeSeriesChart from "@/components/panels/TimeSeriesChart";
import ResearchPanel from "@/components/panels/ResearchPanel";
import UseCaseSelector from "@/components/panels/UseCaseSelector";
import RoleSelector from "@/components/panels/RoleSelector";
import SimulationEngine from "@/components/panels/SimulationEngine";
import DecisionCenter from "@/components/panels/DecisionCenter";
import ReportPanel from "@/components/panels/ReportPanel";
import { AppProvider, useApp } from "@/contexts/AppContext";

export default function Index() {
  return (
    <AppProvider>
      <DashboardLayout />
    </AppProvider>
  );
}

function DashboardLayout() {
  const { selectedLocation, setSelectedLocation, timeYear, setTimeYear } = useApp();

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-background">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* 3D Globe */}
      <div className="absolute inset-0">
        <EarthGlobe onLocationClick={setSelectedLocation} timeYear={timeYear} />
      </div>

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full flex flex-col p-3 gap-2">
          {/* Top row */}
          <div className="pointer-events-auto">
            <TopBar />
          </div>

          {/* Mode + Role selectors */}
          <div className="flex gap-2 pointer-events-auto z-10">
            <UseCaseSelector />
            <RoleSelector />
          </div>

          {/* Main content area */}
          <div className="flex-1 flex gap-3 min-h-0">
            {/* Left column */}
            <div className="flex flex-col gap-2 pointer-events-auto z-10">
              <HealthScorePanel />
              <MetricsPanel />
              <SimulationEngine />
            </div>

            {/* Center - spacer for globe */}
            <div className="flex-1" />

            {/* Right column */}
            <div className="flex flex-col gap-2 pointer-events-auto z-10">
              <DecisionCenter />
              <AlertsPanel />
              <PredictionPanel targetYear={timeYear > 2025 ? timeYear : 2030} />
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-end gap-3">
            <div className="pointer-events-auto z-10">
              <TimeSeriesChart />
            </div>
            <div className="flex-1 flex flex-col gap-2 pointer-events-auto z-10">
              <TimeSlider year={timeYear} onChange={setTimeYear} />
              <div className="flex justify-end">
                <ResearchPanel />
              </div>
            </div>
            <div className="pointer-events-auto z-10">
              <LocationInsightPanel location={selectedLocation} onClose={() => setSelectedLocation(null)} />
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportPanel />
    </div>
  );
}
