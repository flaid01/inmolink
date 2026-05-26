import { useState } from "react";
import { FilterPanel } from "./FilterPanel";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function PropertyList({ 
  onPropertySelect,
  selectedProperties,
  onPropertiesSelect
}: {
  onPropertySelect: (id: string) => void;
  selectedProperties: string[];
  onPropertiesSelect: (ids: string[]) => void;
}) {
  const [filters, setFilters] = useState({
    type: undefined as "sale" | "rent" | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    location: undefined as string | undefined,
    minBedrooms: undefined as number | undefined,
    minSquareMeters: undefined as number | undefined,
  });

  const properties = useQuery(api.properties.list, {
    type: filters.type,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    location: filters.location,
    minBedrooms: filters.minBedrooms,
    minSquareMeters: filters.minSquareMeters,
  });

  const togglePropertySelection = (propertyId: string) => {
    if (selectedProperties.includes(propertyId)) {
      onPropertiesSelect(selectedProperties.filter(id => id !== propertyId));
    } else if (selectedProperties.length < 4) {
      onPropertiesSelect([...selectedProperties, propertyId]);
    }
  };

  if (properties === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Cargando propiedades...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Filter Panel */}
      <FilterPanel filters={filters} onFiltersChange={setFilters} />

      {/* Properties List */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Propiedades Disponibles
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {properties.length} propiedades encontradas
            </p>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg dark:shadow-none dark:border dark:border-gray-800 transition-all cursor-pointer"
                  onClick={() => onPropertySelect(property._id)}
                >
                  {/* Image */}
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🏠</span>
                    )}
                    {property.featured && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-lg">
                        Destacado
                      </div>
                    )}
                  </div>

                  {/* Content */}

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {property.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePropertySelection(property._id);
                        }}
                        className={`ml-2 p-1 rounded transition-colors ${
                          selectedProperties.includes(property._id)
                            ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                      >
                        {selectedProperties.includes(property._id) ? "✓" : "+"}
                      </button>
                    </div>

                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                      ${property.price.toLocaleString()}
                    </p>

                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${
                      property.type === "sale" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {property.type === "sale" ? "En Venta" : "En Renta"}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="mr-4">🛏️ {property.bedrooms}</span>
                      <span className="mr-4">🚿 {property.bathrooms}</span>
                      <span>📐 {property.squareMeters}m²</span>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 truncate">
                      📍 {property.address}
                    </p>

                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                      <span>${property.pricePerSquareMeter}/m²</span>
                      <span>👁️ {property.views} vistas</span>
                    </div>

                    {property.agent && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="mr-2">👤</span>
                          <span>{property.agent.name}</span>
                          {property.agent.verified && (
                            <span className="ml-1 text-green-600 dark:text-green-500">✓</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No se encontraron propiedades
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Intenta ajustar los filtros para ver más resultados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
