import { useState } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function AgentDashboard() {
  const [isImporting, setIsImporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  
  const importAction = useAction(api.importData.importFromInmuebles24);
  const generateMutation = useMutation(api.seed.generateRealisticData);
  const properties = useQuery(api.properties.list, {});

  const handleImport = async () => {
    if (!searchQuery.trim()) return;
    
    setIsImporting(true);
    const promise = importAction({ query: searchQuery });
    
    toast.promise(promise, {
      loading: "Importando propiedades de Inmuebles24...",
      success: (data) => {
        setIsImporting(false);
        setShowImportModal(false);
        setSearchQuery("");
        return `Se importaron ${data.importedCount} propiedades de un total de ${data.totalFound} encontradas.`;
      },
      error: (err) => {
        setIsImporting(false);
        return `Error al importar: ${err.message}`;
      },
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateMutation({ count: 20 });
      toast.success("¡Se generaron 20 propiedades realistas en varias ciudades de México!");
    } catch (err) {
      toast.error(`Error al generar datos: ${err instanceof Error ? err.message : "Error desconocido"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const stats = {
    totalProperties: properties?.length || 0,
    activeListings: properties?.filter(p => p.status === "active").length || 0,
    soldThisMonth: 0,
    totalViews: properties?.reduce((acc, p) => acc + (p.views || 0), 0) || 0,
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Dashboard del Agente
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona tus propiedades y revisa tu rendimiento
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              {isGenerating ? "⏳ Generando..." : "✨ Generar Datos (Open Gov Context)"}
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm"
            >
              📥 Importar de Inmuebles24
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 dark:border dark:border-gray-800 transition-colors">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                🏠
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Propiedades</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 dark:border dark:border-gray-800 transition-colors">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                ✅
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.activeListings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 dark:border dark:border-gray-800 transition-colors">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                💰
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vendidas este mes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.soldThisMonth}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 dark:border dark:border-gray-800 transition-colors">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                👁️
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Vistas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalViews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden dark:border dark:border-gray-800 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mis Propiedades</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 transition-colors">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Propiedad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Vistas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 transition-colors">
                {properties?.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                          🏠
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {property.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      ${property.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.type === "sale" 
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" 
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                      }`}>
                        {property.type === "sale" ? "Venta" : "Renta"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === "active" 
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" 
                          : property.status === "sold"
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                      }`}>
                        {property.status === "active" ? "Activa" : 
                         property.status === "sold" ? "Vendida" : "Rentada"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {property.views}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Importar de Inmuebles24
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Ingresa una búsqueda (ej. "Polanco, CDMX") para traer propiedades reales de Inmuebles24 a través de Piloterr.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Búsqueda
                </label>
                <input
                  type="text"
                  placeholder="ej. Querétaro residencial"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isImporting}
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleImport}
                  disabled={isImporting || !searchQuery.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isImporting ? "⏳ Importando..." : "🚀 Iniciar Importación"}
                </button>
                <button
                  onClick={() => setShowImportModal(false)}
                  disabled={isImporting}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
