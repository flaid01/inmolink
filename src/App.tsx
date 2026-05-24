import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { MapView } from "./components/MapView";
import { PropertyList } from "./components/PropertyList";
import { PropertyDetail } from "./components/PropertyDetail";
import { ComparisonView } from "./components/ComparisonView";
import { AgentDashboard } from "./components/AgentDashboard";
import { UserProfile } from "./components/UserProfile";
import { ThemeToggle } from "./components/ThemeToggle";
import { useState } from "react";

type View = "map" | "list" | "property" | "comparison" | "dashboard" | "profile";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("map");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedComparisonId, setSelectedComparisonId] = useState<string | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  // Mock user for demo purposes
  const mockUser = {
    name: "Usuario Demo",
    email: "demo@example.com",
    role: "buyer" as const,
    verified: true,
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 
                className="text-2xl font-bold text-blue-900 dark:text-blue-400 cursor-pointer"
                onClick={() => setCurrentView("map")}
              >
                🏠 InmoLink
              </h1>
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setCurrentView("map")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === "map" 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  Mapa
                </button>
                <button
                  onClick={() => setCurrentView("list")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === "list" 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  Lista
                </button>
                <button
                  onClick={() => setCurrentView("comparison")}
                  className={`px-3 py-2 rounded-md text-sm font-medium relative transition-colors ${
                    currentView === "comparison" 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  Comparar
                  {selectedProperties.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {selectedProperties.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserMenu 
                onViewChange={setCurrentView} 
                currentView={currentView}
                user={mockUser}
              />
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-sm transition-colors">
                Modo Demo
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Content 
          currentView={currentView}
          selectedPropertyId={selectedPropertyId}
          selectedComparisonId={selectedComparisonId}
          selectedProperties={selectedProperties}
          onPropertySelect={setSelectedPropertyId}
          onComparisonSelect={setSelectedComparisonId}
          onViewChange={setCurrentView}
          onPropertiesSelect={setSelectedProperties}
        />
      </main>
      <Toaster />
    </div>
  );
}

function UserMenu({ 
  onViewChange, 
  currentView,
  user
}: { 
  onViewChange: (view: View) => void;
  currentView: View;
  user: any;
}) {
  return (
    <div className="flex items-center space-x-4">
      {user.role === "agent" && (
        <button
          onClick={() => onViewChange("dashboard")}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentView === "dashboard" 
              ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          }`}
        >
          Dashboard
        </button>
      )}
      <button
        onClick={() => onViewChange("profile")}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          currentView === "profile" 
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" 
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
      >
        Perfil
      </button>
    </div>
  );
}

function Content({ 
  currentView, 
  selectedPropertyId, 
  selectedComparisonId,
  selectedProperties,
  onPropertySelect, 
  onComparisonSelect,
  onViewChange,
  onPropertiesSelect
}: {
  currentView: View;
  selectedPropertyId: string | null;
  selectedComparisonId: string | null;
  selectedProperties: string[];
  onPropertySelect: (id: string | null) => void;
  onComparisonSelect: (id: string | null) => void;
  onViewChange: (view: View) => void;
  onPropertiesSelect: (ids: string[]) => void;
}) {
  if (currentView === "property" && selectedPropertyId) {
    return (
      <PropertyDetail 
        propertyId={selectedPropertyId}
        onBack={() => onViewChange("map")}
        selectedProperties={selectedProperties}
        onPropertiesSelect={onPropertiesSelect}
      />
    );
  }

  if (currentView === "comparison") {
    return (
      <ComparisonView 
        selectedProperties={selectedProperties}
        onPropertiesSelect={onPropertiesSelect}
        onPropertySelect={(id) => {
          onPropertySelect(id);
          onViewChange("property");
        }}
        onComparisonSelect={onComparisonSelect}
        selectedComparisonId={selectedComparisonId}
      />
    );
  }

  if (currentView === "dashboard") {
    return <AgentDashboard />;
  }

  if (currentView === "profile") {
    return <UserProfile onViewChange={onViewChange} />;
  }

  if (currentView === "list") {
    return (
      <PropertyList 
        onPropertySelect={(id) => {
          onPropertySelect(id);
          onViewChange("property");
        }}
        selectedProperties={selectedProperties}
        onPropertiesSelect={onPropertiesSelect}
      />
    );
  }

  return (
    <MapView 
      onPropertySelect={(id) => {
        onPropertySelect(id);
        onViewChange("property");
      }}
      selectedProperties={selectedProperties}
      onPropertiesSelect={onPropertiesSelect}
    />
  );
}
