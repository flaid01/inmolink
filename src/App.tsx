import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { MapView } from "./components/MapView";
import { PropertyList } from "./components/PropertyList";
import { PropertyDetail } from "./components/PropertyDetail";
import { ComparisonView } from "./components/ComparisonView";
import { AgentDashboard } from "./components/AgentDashboard";
import { UserProfile } from "./components/UserProfile";
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 
                className="text-2xl font-bold text-blue-900 cursor-pointer"
                onClick={() => setCurrentView("map")}
              >
                🏠 InmoLink
              </h1>
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setCurrentView("map")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === "map" 
                      ? "bg-blue-100 text-blue-700" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Mapa
                </button>
                <button
                  onClick={() => setCurrentView("list")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === "list" 
                      ? "bg-blue-100 text-blue-700" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Lista
                </button>
                <button
                  onClick={() => setCurrentView("comparison")}
                  className={`px-3 py-2 rounded-md text-sm font-medium relative ${
                    currentView === "comparison" 
                      ? "bg-blue-100 text-blue-700" 
                      : "text-gray-600 hover:text-gray-900"
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
              <UserMenu 
                onViewChange={setCurrentView} 
                currentView={currentView}
                user={mockUser}
              />
              <div className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md text-sm">
                Modo Demo
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
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
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            currentView === "dashboard" 
              ? "bg-green-100 text-green-700" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Dashboard
        </button>
      )}
      <button
        onClick={() => onViewChange("profile")}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          currentView === "profile" 
            ? "bg-blue-100 text-blue-700" 
            : "text-gray-600 hover:text-gray-900"
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
