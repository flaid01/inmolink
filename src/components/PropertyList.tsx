import { useState } from "react";
import { FilterPanel } from "./FilterPanel";

// Mock properties data
const mockProperties = [
  {
    _id: "1",
    title: "Casa en Juriquilla",
    description: "Hermosa casa en fraccionamiento privado con amenidades completas.",
    price: 3500000,
    type: "sale" as const,
    address: "Av. Paseo de la República 123, Juriquilla, Querétaro",
    squareMeters: 180,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    views: 45,
    featured: true,
    pricePerSquareMeter: 19444,
    agent: { name: "María González", verified: true },
    images: [],
  },
  {
    _id: "2",
    title: "Departamento Centro Histórico",
    description: "Moderno departamento en el corazón de Querétaro.",
    price: 15000,
    type: "rent" as const,
    address: "Calle Corregidora 45, Centro Histórico, Querétaro",
    squareMeters: 85,
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    views: 32,
    featured: false,
    pricePerSquareMeter: 176,
    agent: { name: "María González", verified: true },
    images: [],
  },
  {
    _id: "3",
    title: "Casa en Milenio III",
    description: "Amplia casa familiar en zona residencial exclusiva.",
    price: 5200000,
    type: "sale" as const,
    address: "Blvd. Milenio 789, Milenio III, Querétaro",
    squareMeters: 250,
    bedrooms: 4,
    bathrooms: 3,
    parking: 3,
    views: 67,
    featured: true,
    pricePerSquareMeter: 20800,
    agent: { name: "María González", verified: true },
    images: [],
  },
  {
    _id: "4",
    title: "Townhouse en Zibatá",
    description: "Moderna casa en condominio horizontal con áreas verdes.",
    price: 2800000,
    type: "sale" as const,
    address: "Paseo de Zibatá 456, El Marqués, Querétaro",
    squareMeters: 140,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    views: 28,
    featured: false,
    pricePerSquareMeter: 20000,
    agent: { name: "María González", verified: true },
    images: [],
  },
  {
    _id: "5",
    title: "Loft en Zona Dorada",
    description: "Elegante loft tipo industrial con techos altos.",
    price: 18000,
    type: "rent" as const,
    address: "Av. Constituyentes 234, Zona Dorada, Querétaro",
    squareMeters: 95,
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
    views: 19,
    featured: false,
    pricePerSquareMeter: 189,
    agent: { name: "María González", verified: true },
    images: [],
  },
];

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
    minBedrooms: undefined as number | undefined,
    minSquareMeters: undefined as number | undefined,
  });

  // Filter properties based on current filters
  const properties = mockProperties.filter(property => {
    if (filters.type && property.type !== filters.type) return false;
    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;
    if (filters.minBedrooms && property.bedrooms < filters.minBedrooms) return false;
    if (filters.minSquareMeters && property.squareMeters < filters.minSquareMeters) return false;
    return true;
  });

  const togglePropertySelection = (propertyId: string) => {
    if (selectedProperties.includes(propertyId)) {
      onPropertiesSelect(selectedProperties.filter(id => id !== propertyId));
    } else if (selectedProperties.length < 4) {
      onPropertiesSelect([...selectedProperties, propertyId]);
    }
  };

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
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-4xl">🏠</span>
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
