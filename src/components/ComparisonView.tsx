import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

// Spider Chart Component
function SpiderChart({ properties }: { properties: any[] }) {
  if (properties.length === 0) return null;

  const size = 300;
  const center = size / 2;
  const radius = 120;
  
  // Define categories for the spider chart
  const categories = [
    { key: 'price', label: 'Precio', normalize: (val: number, max: number) => (max - val) / max }, // Inverted: lower is better
    { key: 'squareMeters', label: 'Tamaño', normalize: (val: number, max: number) => val / max },
    { key: 'bedrooms', label: 'Recámaras', normalize: (val: number, max: number) => val / max },
    { key: 'bathrooms', label: 'Baños', normalize: (val: number, max: number) => val / max },
    { key: 'parking', label: 'Estacionamiento', normalize: (val: number, max: number) => val / max },
    { key: 'pricePerSquareMeter', label: 'Precio/m²', normalize: (val: number, max: number) => (max - val) / max }, // Inverted: lower is better
  ];

  // Calculate max values for normalization
  const maxValues = categories.reduce((acc, category) => {
    acc[category.key] = Math.max(...properties.map(p => p[category.key] || 0));
    return acc;
  }, {} as Record<string, number>);

  // Calculate normalized values for each property
  const normalizedData = properties.map(property => ({
    ...property,
    normalized: categories.map(category => {
      const value = property[category.key] || 0;
      const maxValue = maxValues[category.key];
      return maxValue > 0 ? category.normalize(value, maxValue) : 0;
    })
  }));

  // Calculate average values
  const averageValues = categories.map((category, index) => {
    const sum = normalizedData.reduce((acc, property) => acc + property.normalized[index], 0);
    return sum / normalizedData.length;
  });

  // Colors for each property
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

  // Calculate points for each category
  const getPoint = (categoryIndex: number, value: number) => {
    const angle = (categoryIndex * 2 * Math.PI) / categories.length - Math.PI / 2;
    const x = center + Math.cos(angle) * radius * value;
    const y = center + Math.sin(angle) * radius * value;
    return { x, y };
  };

  // Calculate label positions
  const getLabelPoint = (categoryIndex: number) => {
    const angle = (categoryIndex * 2 * Math.PI) / categories.length - Math.PI / 2;
    const labelRadius = radius + 30;
    const x = center + Math.cos(angle) * labelRadius;
    const y = center + Math.sin(angle) * labelRadius;
    return { x, y };
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 dark:border dark:border-gray-800 transition-colors">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
        Análisis Comparativo Visual
      </h2>
      
      <div className="flex justify-center">
        <svg width={size + 100} height={size + 100} className="overflow-visible">
          {/* Background circles */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius * scale}
              fill="none"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="1"
            />
          ))}

          {/* Category lines */}
          {categories.map((_, index) => {
            const point = getPoint(index, 1);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="1"
              />
            );
          })}

          {/* Average line (dashed) */}
          <polygon
            points={averageValues.map((value, index) => {
              const point = getPoint(index, value);
              return `${point.x},${point.y}`;
            }).join(' ')}
            fill="rgba(107, 114, 128, 0.1)"
            stroke="#6B7280"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* Property polygons */}
          {normalizedData.map((property, propertyIndex) => (
            <polygon
              key={property._id}
              points={property.normalized.map((value: number, index: number) => {
                const point = getPoint(index, value);
                return `${point.x},${point.y}`;
              }).join(' ')}
              fill={`${colors[propertyIndex % colors.length]}20`}
              stroke={colors[propertyIndex % colors.length]}
              strokeWidth="2"
            />
          ))}

          {/* Property points */}
          {normalizedData.map((property, propertyIndex) => 
            property.normalized.map((value: number, index: number) => {
              const point = getPoint(index, value);
              return (
                <circle
                  key={`${property._id}-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={colors[propertyIndex % colors.length]}
                />
              );
            })
          )}

          {/* Category labels */}
          {categories.map((category, index) => {
            const labelPoint = getLabelPoint(index);
            return (
              <text
                key={category.key}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-medium fill-gray-700 dark:fill-gray-300 transition-colors"
              >
                {category.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {normalizedData.map((property, index) => (
          <div key={property._id} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-32 transition-colors">
              {property.title}
            </span>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-gray-500" style={{ borderStyle: 'dashed', borderWidth: '1px 0' }} />
          <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">Promedio</span>
        </div>
      </div>
    </div>
  );
}

export function ComparisonView({ 
  selectedProperties,
  onPropertiesSelect,
  onPropertySelect,
  onComparisonSelect,
  selectedComparisonId
}: {
  selectedProperties: string[];
  onPropertiesSelect: (ids: string[]) => void;
  onPropertySelect: (id: string) => void;
  onComparisonSelect: (id: string | null) => void;
  selectedComparisonId: string | null;
}) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [comparisonName, setComparisonName] = useState("");

  const savedComparisons = useQuery(api.comparisons.list) || [];
  const createComparison = useMutation(api.comparisons.create);
  const deleteComparison = useMutation(api.comparisons.remove);

  const displayProperties = useQuery(api.properties.getMany, { 
    ids: selectedProperties as Id<"properties">[] 
  }) || [];

  const handleSaveComparison = async () => {
    if (comparisonName.trim() && selectedProperties.length > 0) {
      try {
        await createComparison({
          name: comparisonName.trim(),
          propertyIds: selectedProperties as Id<"properties">[],
        });
        setComparisonName("");
        setShowSaveModal(false);
        toast.success("Comparación guardada");
      } catch (error) {
        toast.error("Error al guardar la comparación");
      }
    }
  };

  const handleLoadComparison = (comparison: any) => {
    onComparisonSelect(comparison._id);
    onPropertiesSelect(comparison.propertyIds);
  };

  const handleDeleteComparison = async (comparisonId: string) => {
    try {
      await deleteComparison({ id: comparisonId as Id<"comparisons"> });
      if (selectedComparisonId === comparisonId) {
        onComparisonSelect(null);
      }
      toast.success("Comparación eliminada");
    } catch (error) {
      toast.error("Error al eliminar la comparación");
    }
  };

  const removeProperty = (propertyId: string) => {
    onPropertiesSelect(selectedProperties.filter(id => id !== propertyId));
  };

  const getBestValue = (properties: any[], field: string, isLower = true) => {
    if (properties.length === 0) return null;
    const values = properties.map(p => p[field]).filter(v => v != null);
    if (values.length === 0) return null;
    return isLower ? Math.min(...values) : Math.max(...values);
  };

  const bestPrice = getBestValue(displayProperties, 'price', true);
  const bestPricePerSqm = getBestValue(displayProperties, 'pricePerSquareMeter', true);
  const bestSize = getBestValue(displayProperties, 'squareMeters', false);

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Comparador de Propiedades
          </h1>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            {selectedProperties.length > 0 && (
              <button
                onClick={() => setShowSaveModal(true)}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
              >
                💾 Guardar Comparación
              </button>
            )}
            
            <button
              onClick={() => {
                onPropertiesSelect([]);
                onComparisonSelect(null);
              }}
              className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              🗑️ Limpiar
            </button>

            <span className="text-gray-600 dark:text-gray-400">
              {displayProperties.length} propiedades seleccionadas
            </span>
          </div>
        </div>

        {/* Saved Comparisons */}
        {savedComparisons.length > 0 && (
          <div className="mb-8 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 dark:border dark:border-gray-800 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Comparaciones Guardadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedComparisons.map((comparison) => (
                <div
                  key={comparison._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedComparisonId === comparison._id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => handleLoadComparison(comparison)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{comparison.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteComparison(comparison._id);
                      }}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {comparison.propertyIds.length} propiedades
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(comparison._creationTime).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {displayProperties.length > 0 ? (
          <div className="space-y-8">
            {/* Comparison Table */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden dark:border dark:border-gray-800 transition-colors">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 transition-colors">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Característica
                      </th>
                      {displayProperties.map((property) => (
                        <th key={property._id} className="px-6 py-3 text-center">
                          <div className="space-y-2">
                            <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                              {property.images && property.images.length > 0 ? (
                                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl">🏠</span>
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-32 mx-auto">
                              {property.title}
                            </div>
                            <div className="flex space-x-1 justify-center">
                              <button
                                onClick={() => onPropertySelect(property._id)}
                                className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors"
                              >
                                Ver
                              </button>
                              <button
                                onClick={() => removeProperty(property._id)}
                                className="text-xs bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 px-2 py-1 rounded hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 transition-colors">
                    {/* Price */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Precio
                      </td>
                      {displayProperties.map((property) => (
                        <td key={property._id} className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`text-lg font-semibold ${
                            property.price === bestPrice 
                              ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded' 
                              : 'text-gray-900 dark:text-gray-300'
                          }`}>
                            ${property.price.toLocaleString()}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Price per sqm */}
                    <tr className="bg-gray-50 dark:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Precio por m²
                      </td>
                      {displayProperties.map((property) => (
                        <td key={property._id} className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`text-sm font-medium ${
                            property.pricePerSquareMeter === bestPricePerSqm 
                              ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded' 
                              : 'text-gray-900 dark:text-gray-300'
                          }`}>
                            ${property.pricePerSquareMeter}/m²
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Square meters */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Metros cuadrados
                      </td>
                      {displayProperties.map((property) => (
                        <td key={property._id} className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`text-sm ${
                            property.squareMeters === bestSize 
                              ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded font-medium' 
                              : 'text-gray-900 dark:text-gray-300'
                          }`}>
                            {property.squareMeters} m²
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Bedrooms */}
                    <tr className="bg-gray-50 dark:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Recámaras
                      </td>
                      {displayProperties.map((property) => (
                        <td key={property._id} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-300">
                          {property.bedrooms}
                        </td>
                      ))}
                    </tr>

                    {/* Bathrooms */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Baños
                      </td>
                      {displayProperties.map((property) => (
                        <td key={property._id} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-300">
                          {property.bathrooms}
                        </td>
                      ))}
                    </tr>

                    {/* Parking */}
                    <tr className="bg-gray-50 dark:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Estacionamientos
                      </td>
                      {displayProperties.map((property) => (
                        <td key={property._id} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-300">
                          {property.parking}
                        </td>
                      ))}
                    </tr>

                    {/* Address */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Ubicación
                      </td>
                      {displayProperties.map((property) => (
                        <td key={property._id} className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-300">
                          <div className="max-w-32 mx-auto truncate">
                            {property.address}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Agent */}
                    <tr className="bg-gray-50 dark:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Agente
                      </td>
                      {displayProperties.map((property) => (
                        <td key={property._id} className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-300">
                          <div>
                            {property.agent?.name}
                            {property.agent?.verified && (
                              <span className="ml-1 text-green-600 dark:text-green-500">✓</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Spider Chart below the table */}
            <SpiderChart properties={displayProperties} />
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg shadow-md transition-colors">
            <div className="text-6xl mb-4">⚖️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No hay propiedades para comparar
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Selecciona propiedades desde el mapa o la lista para compararlas aquí
            </p>
          </div>
        )}

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border dark:border-gray-800 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Guardar Comparación
              </h3>
              <input
                type="text"
                placeholder="Nombre de la comparación"
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveComparison}
                  disabled={!comparisonName.trim()}
                  className="flex-1 bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
