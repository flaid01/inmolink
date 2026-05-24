// Mock agent dashboard
export function AgentDashboard() {
  const mockStats = {
    totalProperties: 6,
    activeListings: 5,
    soldThisMonth: 2,
    totalViews: 234,
  };

  const mockProperties = [
    {
      _id: "1",
      title: "Casa en Juriquilla",
      price: 3500000,
      status: "active",
      views: 45,
      type: "sale",
    },
    {
      _id: "2",
      title: "Departamento Centro Histórico",
      price: 15000,
      status: "active",
      views: 32,
      type: "rent",
    },
    {
      _id: "3",
      title: "Casa en Milenio III",
      price: 5200000,
      status: "sold",
      views: 67,
      type: "sale",
    },
  ];

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Dashboard del Agente
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus propiedades y revisa tu rendimiento
          </p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockStats.totalProperties}</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockStats.activeListings}</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockStats.soldThisMonth}</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockStats.totalViews}</p>
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
                {mockProperties.map((property) => (
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
    </div>
  );
}
