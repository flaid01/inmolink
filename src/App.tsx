import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { MapView } from "./components/MapView";
import { PropertyList } from "./components/PropertyList";
import { PropertyDetail } from "./components/PropertyDetail";
import { ComparisonView } from "./components/ComparisonView";
import { AgentDashboard } from "./components/AgentDashboard";
import { UserProfile } from "./components/UserProfile";
import { AdminPanel } from "./components/AdminPanel";
import { ThemeToggle } from "./components/ThemeToggle";
import { MockLogin } from "./components/MockLogin";
import { useState, useEffect } from "react";

type View = "map" | "list" | "property" | "comparison" | "dashboard" | "profile" | "admin";

interface User {
  name: string;
  email: string;
  role: "agent" | "user" | "admin";
  verified: boolean;
  verificationStatus: "none" | "pending" | "approved" | "rejected";
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>("map");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedComparisonId, setSelectedComparisonId] = useState<string | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("inmolink_mock_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("inmolink_mock_user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("inmolink_mock_user");
    setCurrentView("map");
  };

  if (!user) {
    return (
      <>
        <MockLogin onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

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
                user={user}
                onLogout={handleLogout}
              />
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-sm transition-colors">
                Modo Mock
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
          user={user}
        />
      </main>
      <Toaster />
    </div>
  );
}

function UserMenu({ 
  onViewChange, 
  currentView,
  user,
  onLogout
}: { 
  onViewChange: (view: View) => void;
  currentView: View;
  user: User;
  onLogout: () => void;
}) {
  return (
    <div className="flex items-center space-x-4">
      {user.role === "admin" && (
        <button
          onClick={() => onViewChange("admin")}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentView === "admin" 
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          }`}
        >
          Admin
        </button>
      )}
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
      <button
        onClick={onLogout}
        className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        Salir
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
  onPropertiesSelect,
  user
}: {
  currentView: View;
  selectedPropertyId: string | null;
  selectedComparisonId: string | null;
  selectedProperties: string[];
  onPropertySelect: (id: string | null) => void;
  onComparisonSelect: (id: string | null) => void;
  onViewChange: (view: View) => void;
  onPropertiesSelect: (ids: string[]) => void;
  user: User;
}) {
  if (currentView === "admin") {
    return <AdminPanel />;
  }

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
    if (user.role === "agent" && user.verificationStatus !== "approved") {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl text-center border dark:border-gray-800">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Acceso Restringido</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Su cuenta de Agente está en proceso de verificación. Debe completar su perfil profesional antes de acceder al Dashboard.
            </p>
            <button 
              onClick={() => onViewChange("profile")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
            >
              Ir a Mi Perfil para Verificar
            </button>
          </div>
        </div>
      );
    }
    return <AgentDashboard />;
  }

  if (currentView === "profile") {
    return <UserProfile onViewChange={onViewChange} user={user} onPropertySelect={onPropertySelect} />;
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
