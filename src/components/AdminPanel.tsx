import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

type AdminTab = "overview" | "users" | "properties" | "settings";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  
  const stats = useQuery(api.admin.getStats);
  const users = useQuery(api.admin.listUsers);
  const properties = useQuery(api.admin.listAllProperties);

  const verifyAgent = useMutation(api.admin.verifyAgent);
  const updateStatus = useMutation(api.admin.updatePropertyStatus);
  const toggleFeatured = useMutation(api.admin.toggleFeatured);
  const deleteUser = useMutation(api.admin.deleteUser);

  if (stats === undefined) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="text-xl text-gray-600 dark:text-gray-400">Cargando panel de administración...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 transition-colors flex flex-col">
        <div className="p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400 flex items-center">
            <span className="mr-2">🛡️</span> Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <AdminNavItem 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")}
            icon="📊" 
            label="Vista General" 
          />
          <AdminNavItem 
            active={activeTab === "users"} 
            onClick={() => setActiveTab("users")}
            icon="👥" 
            label="Usuarios" 
          />
          <AdminNavItem 
            active={activeTab === "properties"} 
            onClick={() => setActiveTab("properties")}
            icon="🏠" 
            label="Propiedades" 
          />
          <AdminNavItem 
            active={activeTab === "settings"} 
            onClick={() => setActiveTab("settings")}
            icon="⚙️" 
            label="Configuración" 
          />
        </nav>
        <div className="p-4 border-t dark:border-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
            InmoLink Admin v1.0
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Vista General del Sistema</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Usuarios" value={stats.totalUsers} icon="👤" color="blue" />
              <StatCard label="Total Propiedades" value={stats.totalProperties} icon="🏠" color="green" />
              <StatCard label="Total Consultas" value={stats.totalInquiries} icon="💬" color="purple" />
              <StatCard label="Pendientes Verificación" value={stats.pendingVerifications} icon="⏳" color="yellow" />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border dark:border-gray-800 transition-colors">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Actividad Reciente</h2>
              <div className="text-center py-12 text-gray-500">
                Gráficas de actividad en desarrollo...
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestión de Usuarios</h1>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border dark:border-gray-800 transition-colors">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verificación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {users?.map(user => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => verifyAgent({ userId: user._id, status: !user.profile?.licenseVerified })}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            user.profile?.licenseVerified 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {user.profile?.licenseVerified ? "✓ Verificado" : "⏳ Pendiente"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => {
                            if(confirm("¿Seguro que deseas eliminar este usuario?")) deleteUser({ userId: user._id });
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "properties" && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Moderación de Propiedades</h1>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border dark:border-gray-800 transition-colors">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destacado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {properties?.map(p => (
                    <tr key={p._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 max-w-xs truncate">{p.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{p.agentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select 
                          value={p.status}
                          onChange={(e) => updateStatus({ propertyId: p._id, status: e.target.value as any })}
                          className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-xs rounded-lg p-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="active">Activa</option>
                          <option value="pending">Pendiente</option>
                          <option value="sold">Vendida</option>
                          <option value="rented">Rentada</option>
                          <option value="inactive">Inactiva</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => toggleFeatured({ propertyId: p._id, featured: !p.featured })}
                          className={`text-xl transition-all ${p.featured ? "scale-110 grayscale-0" : "grayscale opacity-30 hover:opacity-100"}`}
                        >
                          ⭐
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <button className="hover:underline">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Configuración del Sistema</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border dark:border-gray-800 transition-colors">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Mantenimiento de Datos</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Estas acciones afectan a toda la base de datos.</p>
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                    Re-indexar Búsqueda
                  </button>
                  <button className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md transition-colors">
                    Limpiar Vistas de Sesión
                  </button>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border dark:border-gray-800 transition-colors">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Límites de la Plataforma</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Máximo imágenes por propiedad</span>
                    <input type="number" defaultValue={20} className="w-16 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 text-center" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Días de vigencia de anuncio</span>
                    <input type="number" defaultValue={30} className="w-16 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 text-center" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminNavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: number, icon: string, color: string }) {
  const colors: any = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border dark:border-gray-800 transition-colors">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );
}
