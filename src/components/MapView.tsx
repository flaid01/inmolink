import { useState, useEffect } from "react";
import { FilterPanel } from "./FilterPanel";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet icon issues in Vite/Webpack
// (though we'll use custom divIcon, it's good to have standard ones working)
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

// Mock properties data
const mockProperties = [
  {
    _id: "1",
    title: "Casa en Juriquilla",
    description: "Hermosa casa en fraccionamiento privado con amenidades completas.",
    price: 3500000,
    type: "sale" as const,
    latitude: 20.5888,
    longitude: -100.4468,
    address: "Av. Paseo de la República 123, Juriquilla, Querétaro",
    squareMeters: 180,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    views: 45,
    featured: true,
    pricePerSquareMeter: 19444,
    agent: { name: "María González", email: "maria@inmobiliaria.com", verified: true },
    images: [],
  },
  {
    _id: "2",
    title: "Departamento Centro Histórico",
    description: "Moderno departamento en el corazón de Querétaro.",
    price: 15000,
    type: "rent" as const,
    latitude: 20.5931,
    longitude: -100.3931,
    address: "Calle Corregidora 45, Centro Histórico, Querétaro",
    squareMeters: 85,
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    views: 32,
    featured: false,
    pricePerSquareMeter: 176,
    agent: { name: "María González", email: "maria@inmobiliaria.com", verified: true },
    images: [],
  },
  {
    _id: "3",
    title: "Casa en Milenio III",
    description: "Amplia casa familiar en zona residencial exclusiva.",
    price: 5200000,
    type: "sale" as const,
    latitude: 20.6197,
    longitude: -100.4306,
    address: "Blvd. Milenio 789, Milenio III, Querétaro",
    squareMeters: 250,
    bedrooms: 4,
    bathrooms: 3,
    parking: 3,
    views: 67,
    featured: true,
    pricePerSquareMeter: 20800,
    agent: { name: "María González", email: "maria@inmobiliaria.com", verified: true },
    images: [],
  },
  {
    _id: "4",
    title: "Townhouse en Zibatá",
    description: "Moderna casa en condominio horizontal con áreas verdes.",
    price: 2800000,
    type: "sale" as const,
    latitude: 20.5234,
    longitude: -100.2456,
    address: "Paseo de Zibatá 456, El Marqués, Querétaro",
    squareMeters: 140,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    views: 28,
    featured: false,
    pricePerSquareMeter: 20000,
    agent: { name: "María González", email: "maria@inmobiliaria.com", verified: true },
    images: [],
  },
  {
    _id: "5",
    title: "Loft en Zona Dorada",
    description: "Elegante loft tipo industrial con techos altos.",
    price: 18000,
    type: "rent" as const,
    latitude: 20.6089,
    longitude: -100.4103,
    address: "Av. Constituyentes 234, Zona Dorada, Querétaro",
    squareMeters: 95,
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
    views: 19,
    featured: false,
    pricePerSquareMeter: 189,
    agent: { name: "María González", email: "maria@inmobiliaria.com", verified: true },
    images: [],
  },
];

export function MapView({ 
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

  // Custom marker function
  const createCustomIcon = (price: number) => {
    const priceText = price > 1000000 ? `${(price / 1000000).toFixed(1)}M` : `${Math.round(price / 1000)}K`;
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all whitespace-nowrap border-2 border-white">
          $${priceText}
        </div>
      `,
      iconSize: [50, 24],
      iconAnchor: [25, 12],
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
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
          {/* Tile Layer "Without Relief" (CartoDB Positron) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
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
                <div className="p-1">
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
                  className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 min-w-[320px] max-w-[320px] cursor-pointer hover:shadow-2xl transition-all border border-gray-100"
                  onClick={() => onPropertySelect(property._id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 truncate pr-2">
                      {property.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePropertySelection(property._id);
                      }}
                      className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                        selectedProperties.includes(property._id)
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {selectedProperties.includes(property._id) ? "✓" : "+"}
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-green-600">
                      ${property.price.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{property.bedrooms} rec</span>
                      <span>•</span>
                      <span>{property.bathrooms} baños</span>
                      <span>•</span>
                      <span>{property.squareMeters}m²</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {property.address}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        ${property.pricePerSquareMeter}/m²
                      </span>
                      {property.featured && (
                        <span className="text-[10px] uppercase tracking-wider font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                          Destacado
                        </span>
                      )}
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
