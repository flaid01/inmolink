import { useState, useEffect } from "react";

interface FilterPanelProps {
  filters: {
    type?: "sale" | "rent";
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    minBedrooms?: number;
    minSquareMeters?: number;
  };
  onFiltersChange: (filters: any) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const [localLocation, setLocalLocation] = useState(filters.location || "");

  // Sync local state when filters.location changes externally (e.g. Clear Filters)
  useEffect(() => {
    setLocalLocation(filters.location || "");
  }, [filters.location]);

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === "" ? undefined : value,
    });
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateFilter("location", localLocation);
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 shadow-lg border-r dark:border-gray-800 h-full overflow-y-auto transition-colors">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Filtros</h2>
        
        <div className="space-y-6">
          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de operación
            </label>
            <select
              value={filters.type || ""}
              onChange={(e) => updateFilter("type", e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="sale">Venta</option>
              <option value="rent">Renta</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ubicación
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ciudad, zona o dirección..."
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value)}
                onKeyDown={handleLocationKeyDown}
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 ml-1">Presiona Enter para buscar</p>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rango de precio
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={filters.minPrice || ""}
                onChange={(e) => updateFilter("minPrice", parseInt(e.target.value))}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Máximo"
                value={filters.maxPrice || ""}
                onChange={(e) => updateFilter("maxPrice", parseInt(e.target.value))}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recámaras mínimas
            </label>
            <select
              value={filters.minBedrooms || ""}
              onChange={(e) => updateFilter("minBedrooms", parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Cualquiera</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          {/* Square Meters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Metros cuadrados mínimos
            </label>
            <input
              type="number"
              placeholder="ej. 100"
              value={filters.minSquareMeters || ""}
              onChange={(e) => updateFilter("minSquareMeters", parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => onFiltersChange({})}
            className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
