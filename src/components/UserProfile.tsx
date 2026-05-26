import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type View = "map" | "list" | "property" | "comparison" | "dashboard" | "profile";

interface User {
  name: string;
  email: string;
  role: "agent" | "user";
  verified: boolean;
  verificationStatus: "none" | "pending" | "approved" | "rejected";
  phone?: string;
}

const mockAgentStats = {
  license: "AMPI-7890-QX",
  agency: "InmoLink Prime Realty",
  experience: "8 años",
  totalSales: 42,
  activeListings: 12,
  rating: 4.9,
};

export function UserProfile({ 
  onViewChange, 
  user,
  onPropertySelect
}: { 
  onViewChange: (view: View) => void,
  user: User,
  onPropertySelect: (id: string) => void
}) {
  const [activeTab, setActiveTab] = useState<"info" | "favorites" | "comparisons" | "professional">("info");
  
  const favorites = useQuery(api.favorites.list) || [];
  const comparisons = useQuery(api.comparisons.list) || [];

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-8 dark:border dark:border-gray-800 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-3xl">{user.role === "agent" ? "💼" : "👤"}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user.name}
                {user.verified && <span className="ml-2 text-green-600 dark:text-green-500">✓</span>}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 capitalize">
                {user.role === "agent" ? "Agente Inmobiliario Profesional" : "Cliente / Comprador"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md mb-8 dark:border dark:border-gray-800 transition-colors">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("info")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "info"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Información Personal
              </button>
              
              {user.role === "agent" && (
                <button
                  onClick={() => setActiveTab("professional")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "professional"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Perfil Profesional
              </button>
              )}

              <button
                onClick={() => setActiveTab("favorites")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "favorites"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Favoritos ({favorites.length})
              </button>
              
              <button
                onClick={() => setActiveTab("comparisons")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "comparisons"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Comparaciones ({comparisons.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre Completo
                    </label>
                    <div className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Correo Electrónico
                    </label>
                    <div className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tipo de Cuenta
                    </label>
                    <div className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 capitalize transition-colors">
                      {user.role === "agent" ? "Agente Inmobiliario" : "Comprador Individual"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estatus de Verificación
                    </label>
                    <div className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
                      {user.verified ? (
                        <span className="text-green-600 dark:text-green-500 font-medium">✓ Cuenta Verificada</span>
                      ) : (
                        <span className="text-yellow-600 dark:text-yellow-500 font-medium">⏳ Verificación en Proceso</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "professional" && user.role === "agent" && (
              <div className="space-y-8">
                {user.verificationStatus === "approved" ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Número de Licencia
                        </label>
                        <div className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-blue-50/50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-300 font-mono transition-colors">
                          {mockAgentStats.license}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Agencia / Inmobiliaria
                        </label>
                        <div className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
                          {mockAgentStats.agency}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <span className="mr-2">📊</span> Estadísticas de Desempeño
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center transition-colors">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Ventas</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockAgentStats.totalSales}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center transition-colors">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Listados</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockAgentStats.activeListings}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center transition-colors">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Rating</p>
                          <p className="text-2xl font-bold text-orange-500">{mockAgentStats.rating} ⭐</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center transition-colors">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Exp.</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockAgentStats.experience}</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-900/30">
                    <div className="text-5xl mb-4">📜</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Verificación de Agente Requerida
                    </h3>
                    <p className="max-w-md mx-auto text-gray-600 dark:text-gray-400 mb-8">
                      Para acceder a las herramientas profesionales, publicar propiedades y recibir leads, necesitamos verificar su identidad y licencia profesional.
                    </p>
                    
                    <div className="flex flex-col items-center space-y-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        Subir Documentación Profesional
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Formatos aceptados: PDF, JPG, PNG (Max. 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((property: any) => (
                      <div
                        key={property._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-800/50 transition-all cursor-pointer group"
                        onClick={() => {
                          onPropertySelect(property._id);
                          onViewChange("property");
                        }}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors relative overflow-hidden">
                            {property.images && property.images.length > 0 ? (
                              <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-2xl">🏠</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {property.title}
                            </h3>
                            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                              ${property.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
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
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No tienes propiedades favoritas
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Explora propiedades y marca tus favoritas
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "comparisons" && (
              <div>
                {comparisons.length > 0 ? (
                  <div className="space-y-4">
                    {comparisons.map((comparison: any) => (
                      <div
                        key={comparison._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-800/50 transition-all cursor-pointer flex justify-between items-center group"
                        onClick={() => onViewChange("comparison")}
                      >
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {comparison.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {comparison.propertyIds.length} propiedades en el set
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Creado el {new Date(comparison._creationTime).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">⚖️</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">⚖️</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No tienes comparaciones guardadas
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
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
