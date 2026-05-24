import { mutation } from "./_generated/server";
import { v } from "convex/values";

const CITIES = [
  { name: "Querétaro", state: "Querétaro", lat: 20.5888, lng: -100.3899, zoom: 13 },
  { name: "Ciudad de México", state: "CDMX", lat: 19.4326, lng: -99.1332, zoom: 12 },
  { name: "Guadalajara", state: "Jalisco", lat: 20.6597, lng: -103.3496, zoom: 12 },
  { name: "Monterrey", state: "Nuevo León", lat: 25.6866, lng: -100.3161, zoom: 12 },
  { name: "Puebla", state: "Puebla", lat: 19.0414, lng: -98.2063, zoom: 13 },
];

const NEIGHBORHOODS: Record<string, string[]> = {
  "Querétaro": ["Juriquilla", "Milenio III", "Centro Histórico", "El Campanario", "Zibatá"],
  "Ciudad de México": ["Polanco", "Condesa", "Roma Norte", "Santa Fe", "Coyoacán"],
  "Guadalajara": ["Puerta de Hierro", "Colonia Americana", "Providencia", "Zapopan", "Tlaquepaque"],
  "Monterrey": ["San Pedro Garza García", "Cumbres", "Contry", "San Jerónimo", "Barrio Antiguo"],
  "Puebla": ["Angelópolis", "Lomas de Angelópolis", "Cholula", "La Paz", "Centro"],
};

const PROPERTY_TYPES = ["sale", "rent"] as const;

export const generateRealisticData = mutation({
  args: {
    count: v.number(),
  },
  handler: async (ctx, args) => {
    // 1. Get or create a system agent
    let agentId = await ctx.db.query("users").filter(q => q.eq(q.field("name"), "Sistema InmoLink")).first();
    if (!agentId) {
      const id = await ctx.db.insert("users", {
        name: "Sistema InmoLink",
        email: "system@inmolink.com",
        phone: "+52 800 123 4567",
      });
      agentId = await ctx.db.get(id);
    }

    let createdCount = 0;

    for (let i = 0; i < args.count; i++) {
      // Pick a random city
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const neighborhood = NEIGHBORHOODS[city.name][Math.floor(Math.random() * NEIGHBORHOODS[city.name].length)];
      
      const type = PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)];
      
      // Random coordinates near the city center
      const latitude = city.lat + (Math.random() - 0.5) * 0.05;
      const longitude = city.lng + (Math.random() - 0.5) * 0.05;
      
      // Random details
      const squareMeters = 60 + Math.floor(Math.random() * 300);
      const bedrooms = 1 + Math.floor(Math.random() * 4);
      const bathrooms = 1 + Math.floor(Math.random() * 3);
      const parking = Math.floor(Math.random() * 3);
      
      // Price calculation based on city and type
      let basePrice = type === "sale" ? 1500000 : 8000;
      if (city.name === "Ciudad de México" || city.name === "Monterrey") basePrice *= 2;
      
      const price = Math.round(basePrice + Math.random() * basePrice);
      const pricePerSquareMeter = Math.round(price / squareMeters);

      const title = `${bedrooms} Recámaras en ${neighborhood}, ${city.name}`;
      const description = `Increíble oportunidad en ${neighborhood}. Esta propiedad cuenta con ${bedrooms} recámaras, ${bathrooms} baños y excelentes acabados. Ubicada en una de las mejores zonas de ${city.name}.`;

      await ctx.db.insert("properties", {
        title,
        description,
        price,
        type,
        status: "active",
        latitude,
        longitude,
        address: `Calle ${Math.floor(Math.random() * 1000)} #${Math.floor(Math.random() * 500)}, ${neighborhood}`,
        city: city.name,
        state: city.state,
        squareMeters,
        bedrooms,
        bathrooms,
        parking,
        pricePerSquareMeter,
        featured: Math.random() > 0.8,
        views: Math.floor(Math.random() * 200),
        agentId: agentId!._id,
        images: [],
        amenities: ["Seguridad 24/7", "Estacionamiento", "Elevador"].slice(0, 1 + Math.floor(Math.random() * 3)),
      });
      
      createdCount++;
    }

    return { createdCount };
  },
});
