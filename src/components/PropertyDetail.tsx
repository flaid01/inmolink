import { useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet icon issues in Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock property data
const mockProperties = {
  "1": {
    _id: "1",
    title: "Casa en Juriquilla",
    description: "Hermosa casa en fraccionamiento privado con amenidades completas. Cuenta con jardín, terraza y excelente ubicación cerca de centros comerciales. Esta propiedad ofrece un estilo de vida moderno y cómodo para toda la familia.",
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
    _creationTime: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    agent: { 
      name: "María González", 
      email: "maria@inmobiliaria.com", 
      verified: true,
      phone: "+52 442 123 4567"
    },
    images: [],
  },
  "2": {
    _id: "2",
    title: "Departamento Centro Histórico",
    description: "Moderno departamento en el corazón de Querétaro. Completamente amueblado con vista a la catedral y cerca de todos los servicios. Perfecto para profesionistas que buscan comodidad y ubicación privilegiada.",
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
    _creationTime: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    agent: { 
      name: "María González", 
      email: "maria@inmobiliaria.com", 
      verified: true,
      phone: "+52 442 123 4567"
    },
    images: [],
  },
  "3": {
    _id: "3",
    title: "Casa en Milenio III",
    description: "Amplia casa familiar en zona residencial exclusiva. Cuenta con alberca, jardín amplio y acabados de lujo. Ideal para familias que buscan espacio, comodidad y exclusividad en una de las mejores zonas de Querétaro.",
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
    _creationTime: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
    agent: { 
      name: "María González", 
      email: "maria@inmobiliaria.com", 
      verified: true,
      phone: "+52 442 123 4567"
    },
    images: [],
  },
  "4": {
    _id: "4",
    title: "Townhouse en Zibatá",
    description: "Moderna casa en condominio horizontal con áreas verdes y seguridad 24/7. Perfecta para familias jóvenes que buscan un ambiente seguro y tranquilo con todas las comodidades modernas.",
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
    _creationTime: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
    agent: { 
      name: "María González", 
      email: "maria@inmobiliaria.com", 
      verified: true,
      phone: "+52 442 123 4567"
    },
    images: [],
  },
  "5": {
    _id: "5",
    title: "Loft en Zona Dorada",
    description: "Elegante loft tipo industrial con techos altos y diseño contemporáneo. Ideal para profesionistas que aprecian el diseño moderno y la funcionalidad en una ubicación privilegiada.",
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
    _creationTime: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    agent: { 
      name: "María González", 
      email: "maria@inmobiliaria.com", 
      verified: true,
      phone: "+52 442 123 4567"
    },
    images: [],
  },
};

export function PropertyDetail({ 
  propertyId, 
  onBack,
  selectedProperties,
  onPropertiesSelect
}: {
  propertyId: string;
  onBack: () => void;
  selectedProperties: string[];
  onPropertiesSelect: (ids: string[]) => void;
}) {
  const property = mockProperties[propertyId as keyof typeof mockProperties];
  const isFavorite = false; // Mock favorite state

  useEffect(() => {
    // Mock increment views
    console.log(`Incrementing views for property ${propertyId}`);
  }, [propertyId]);

  const togglePropertySelection = () => {
    if (selectedProperties.includes(propertyId)) {
      onPropertiesSelect(selectedProperties.filter(id => id !== propertyId));
    } else if (selectedProperties.length < 4) {
      onPropertiesSelect([...selectedProperties, propertyId]);
    }
  };

  const handleToggleFavorite = async () => {
    console.log(`Toggling favorite for property ${propertyId}`);
  };

  if (!property) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Propiedad no encontrada
          </h2>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Volver al mapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-2"
          >
            ← Volver al mapa
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <p className="text-gray-600 mt-1">{property.address}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full ${
                  isFavorite 
                    ? "bg-red-100 text-red-600" 
                    : "bg-gray-100 text-gray-400 hover:text-red-500"
                }`}
              >
                {isFavorite ? "❤️" : "🤍"}
              </button>
              <button
                onClick={togglePropertySelection}
                className={`px-4 py-2 rounded-md font-medium ${
                  selectedProperties.includes(propertyId)
                    ? "bg-orange-100 text-orange-700 border border-orange-300"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                disabled={!selectedProperties.includes(propertyId) && selectedProperties.length >= 4}
              >
                {selectedProperties.includes(propertyId) 
                  ? "✓ En comparación" 
                  : selectedProperties.length >= 4 
                    ? "Máximo 4 propiedades"
                    : "+ Agregar a comparación"
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-8xl">🏠</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🛏️</div>
                  <div className="font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Recámaras</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🚿</div>
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Baños</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">📐</div>
                  <div className="font-semibold">{property.squareMeters}</div>
                  <div className="text-sm text-gray-600">m²</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🚗</div>
                  <div className="font-semibold">{property.parking}</div>
                  <div className="text-sm text-gray-600">Estacionamientos</div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ubicación</h2>
              <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                <MapContainer 
                  center={[property.latitude, property.longitude]} 
                  zoom={15} 
                  className="w-full h-full"
                  zoomControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  <Marker position={[property.latitude, property.longitude]} />
                </MapContainer>
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <span className="mr-1">📍</span> {property.address}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ${property.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  ${property.pricePerSquareMeter}/m²
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  property.type === "sale" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {property.type === "sale" ? "En Venta" : "En Renta"}
                </div>
              </div>
            </div>

            {/* Agent Card */}
            {property.agent && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Agente Inmobiliario
                </h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {property.agent.name}
                      {property.agent.verified && (
                        <span className="ml-2 text-green-600">✓</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{property.agent.email}</div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Contactar Agente
                </button>
                {property.agent.phone && (
                  <button className="w-full mt-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                    📞 {property.agent.phone}
                  </button>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vistas</span>
                  <span className="font-medium">{property.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Publicado</span>
                  <span className="font-medium">
                    {new Date(property._creationTime).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
