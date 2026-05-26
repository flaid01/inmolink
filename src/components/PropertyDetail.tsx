import { useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

// Fix for default Leaflet icon issues in Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const property = useQuery(api.properties.getById, { id: propertyId as Id<"properties"> });
  const isFavorite = useQuery(api.favorites.isFavorite, { propertyId: propertyId as Id<"properties"> });
  
  const addFavorite = useMutation(api.favorites.add);
  const removeFavorite = useMutation(api.favorites.remove);
  const incrementViews = useMutation(api.properties.incrementViews);

  useEffect(() => {
    if (propertyId) {
      incrementViews({ propertyId: propertyId as Id<"properties"> })
        .catch(err => console.error("Error incrementing views:", err));
    }
  }, [propertyId, incrementViews]);

  const togglePropertySelection = () => {
    if (selectedProperties.includes(propertyId)) {
      onPropertiesSelect(selectedProperties.filter(id => id !== propertyId));
    } else if (selectedProperties.length < 4) {
      onPropertiesSelect([...selectedProperties, propertyId]);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite({ propertyId: propertyId as Id<"properties"> });
        toast.success("Eliminado de favoritos");
      } else {
        await addFavorite({ propertyId: propertyId as Id<"properties"> });
        toast.success("Agregado a favoritos");
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos");
      console.error(error);
    }
  };

  if (property === undefined) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="text-xl text-gray-600 dark:text-gray-400">Cargando detalles...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Propiedad no encontrada
          </h2>
          <button
            onClick={onBack}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            ← Volver al mapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-2"
          >
            ← Volver al mapa
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{property.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{property.address}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" 
                    : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 hover:text-red-500"
                }`}
              >
                {isFavorite ? "❤️" : "🤍"}
              </button>
              <button
                onClick={togglePropertySelection}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  selectedProperties.includes(propertyId)
                    ? "bg-orange-100 text-orange-700 border border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
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
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden dark:border dark:border-gray-800">
              <div className="h-96 bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-8xl">🏠</span>
                )}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {property.images?.length || 0} fotos
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 dark:border dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Descripción</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 dark:border dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-2">🛏️</div>
                  <div className="font-semibold dark:text-gray-100">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Recámaras</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-2">🚿</div>
                  <div className="font-semibold dark:text-gray-100">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Baños</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-2">📐</div>
                  <div className="font-semibold dark:text-gray-100">{property.squareMeters}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">m²</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-2">🚗</div>
                  <div className="font-semibold dark:text-gray-100">{property.parking}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Estacionamientos</div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 dark:border dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Ubicación</h2>
              <div className="h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                <span className="mr-1">📍</span> {property.address}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 dark:border dark:border-gray-800">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  ${property.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  ${property.pricePerSquareMeter}/m²
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  property.type === "sale" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                }`}>
                  {property.type === "sale" ? "En Venta" : "En Renta"}
                </div>
              </div>
            </div>

            {/* Agent Card */}
            {property.agent && (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 dark:border dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Agente Inmobiliario
                </h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {property.agent.name}
                      {property.agent.verified && (
                        <span className="ml-2 text-green-600 dark:text-green-500">✓</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{property.agent.email}</div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                  Contactar Agente
                </button>
                {property.agent.phone && (
                  <button className="w-full mt-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    📞 {property.agent.phone}
                  </button>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 dark:border dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Vistas</span>
                  <span className="font-medium dark:text-gray-200">{property.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Publicado</span>
                  <span className="font-medium dark:text-gray-200">
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
