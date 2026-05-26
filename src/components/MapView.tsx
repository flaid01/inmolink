import { useState, useEffect } from "react";
import { FilterPanel } from "./FilterPanel";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useTheme } from "./ThemeProvider";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet icon issues in Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to update map view
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function MapView({ 
  onPropertySelect,
  selectedProperties,
  onPropertiesSelect
}: {
  onPropertySelect: (id: string) => void;
  selectedProperties: string[];
  onPropertiesSelect: (ids: string[]) => void;
}) {
  const { theme } = useTheme();
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

  // Custom marker function
  const createCustomIcon = (price: number) => {
    const priceText = price > 1000000 ? `${(price / 1000000).toFixed(1)}M` : `${Math.round(price / 1000)}K`;
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all whitespace-nowrap border-2 border-white dark:border-gray-800">
          $${priceText}
        </div>
      `,
      iconSize: [50, 24],
      iconAnchor: [25, 12],
    });
  };

  if (properties === undefined) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="text-xl text-gray-600 dark:text-gray-400">Cargando mapa y propiedades...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden transition-colors">
      {/* Filter Panel */}
      <FilterPanel filters={filters} onFiltersChange={setFilters} />

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer 
          center={[20.5888, -100.3899]} 
          zoom={13} 
          className="w-full h-full"
          zoomControl={false}
        >
          {/* Tile Layer themed based on selection */}
          <TileLayer
            key={theme} // Force re-render when theme changes to update tiles
            url={theme === "dark" 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          <MapController center={[20.5888, -100.3899]} zoom={13} />

          {properties.map((property) => (
            <Marker 
              key={property._id} 
              position={[property.latitude, property.longitude]}
              icon={createCustomIcon(property.price)}
              eventHandlers={{
                click: () => onPropertySelect(property._id),
              }}
            >
              <Popup>
                <div className="p-1 dark:text-gray-900">
                  <h3 className="font-semibold text-sm leading-tight">{property.title}</h3>
                  <p className="text-green-600 font-bold text-base mt-1">${property.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {property.bedrooms} rec • {property.bathrooms} baños • {property.squareMeters}m²
                  </p>
                  <button 
                    onClick={() => onPropertySelect(property._id)}
                    className="mt-2 w-full bg-blue-600 text-white text-xs py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Ver detalles
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Property Cards Overlay */}
        {properties.length > 0 && (
          <div className="absolute bottom-6 left-6 right-6 z-[1000]">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {properties.slice(0, 8).map((property) => (
                <div
                  key={property._id}
                  className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden min-w-[320px] max-w-[320px] cursor-pointer hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800 flex"
                  onClick={() => onPropertySelect(property._id)}
                >
                  {/* Thumbnail */}
                  <div className="w-24 bg-gray-200 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🏠</span>
                    )}
                  </div>

                  <div className="p-4 flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate pr-2 text-sm">
                        {property.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePropertySelection(property._id);
                        }}
                        className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                          selectedProperties.includes(property._id)
                            ? "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                      >
                        {selectedProperties.includes(property._id) ? "✓" : "+"}
                      </button>
                    </div>
                    
                    <div className="space-y-0.5">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${property.price.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2 text-[11px] text-gray-600 dark:text-gray-400">
                        <span>{property.bedrooms} rec</span>
                        <span>•</span>
                        <span>{property.squareMeters}m²</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-500 truncate mt-1">
                        {property.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
