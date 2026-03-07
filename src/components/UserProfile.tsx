import { useState } from "react";

type View = "map" | "list" | "property" | "comparison" | "dashboard" | "profile";

// Mock data
const mockUser = {
  name: "Usuario Demo",
  email: "demo@example.com",
  role: "buyer" as "buyer" | "agent",
  verified: true,
  phone: "+52 442 123 4567",
};

const mockFavorites = [
  {
    _id: "1",
    title: "Casa en Juriquilla",
    price: 3500000,
    bedrooms: 3,
    bathrooms: 2,
    image: null,
  },
  {
    _id: "3",
    title: "Casa en Milenio III",
    price: 5200000,
    bedrooms: 4,
    bathrooms: 3,
    image: null,
  },
];

const mockComparisons = [
  {
    _id: "comp1",
    name: "Casas Familiares",
    propertyIds: ["1", "3", "4"],
    _creationTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    _id: "comp2",
    name: "Opciones de Renta",
    propertyIds: ["2", "5"],
    _creationTime: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
];

export function UserProfile({ onViewChange }: { onViewChange: (view: View) => void }) {
  const [activeTab, setActiveTab] = useState<"info" | "favorites" | "comparisons">("info");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {mockUser.name}
                {mockUser.verified && <span className="ml-2 text-green-600">✓</span>}
              </h1>
              <p className="text-gray-600">{mockUser.email}</p>
              <p className="text-sm text-gray-500 capitalize">
                {mockUser.role === "agent" ? "Agente Inmobiliario" : "Comprador"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("info")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "info"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "favorites"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Favoritos ({mockFavorites.length})
              </button>
              <button
                onClick={() => setActiveTab("comparisons")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "comparisons"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Comparaciones ({mockComparisons.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {mockUser.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {mockUser.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Usuario
                    </label>
                    <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 capitalize">
                      {mockUser.role === "agent" ? "Agente Inmobiliario" : "Comprador"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado de Verificación
                    </label>
                    <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {mockUser.verified ? (
                        <span className="text-green-600">✓ Verificado</span>
                      ) : (
                        <span className="text-yellow-600">⏳ Pendiente</span>
                      )}
                    </div>
                  </div>
                  {mockUser.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                        {mockUser.phone}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                {mockFavorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockFavorites.map((property) => (
                      <div
                        key={property._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onViewChange("property")}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🏠</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {property.title}
                            </h3>
                            <p className="text-lg font-semibold text-green-600">
                              ${property.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {property.bedrooms} rec • {property.bathrooms} baños
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">❤️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes propiedades favoritas
                    </h3>
                    <p className="text-gray-600">
                      Explora propiedades y marca tus favoritas
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "comparisons" && (
              <div>
                {mockComparisons.length > 0 ? (
                  <div className="space-y-4">
                    {mockComparisons.map((comparison) => (
                      <div
                        key={comparison._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onViewChange("comparison")}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {comparison.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {comparison.propertyIds.length} propiedades
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(comparison._creationTime).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-2xl">⚖️</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">⚖️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes comparaciones guardadas
                    </h3>
                    <p className="text-gray-600">
                      Compara propiedades y guarda tus análisis
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
