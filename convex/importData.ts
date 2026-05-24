import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const importFromInmuebles24 = action({
  args: {
    query: v.string(), // e.g., "Polanco, Ciudad de México"
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.PILOTERR_API_KEY;
    if (!apiKey) {
      throw new Error("PILOTERR_API_KEY is not set in environment variables");
    }

    // 1. Fetch search results from Piloterr Inmuebles24 Search API
    const searchUrl = `https://api.piloterr.com/v1/scraper/inmuebles24/search?query=${encodeURIComponent(args.query)}&x_api_key=${apiKey}`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Piloterr API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const listings = data.results || [];

    let importedCount = 0;

    // 2. Process each listing
    for (const listing of listings.slice(0, 10)) { // Limit to 10 for now
      try {
        // Map Piloterr data to InmoLink schema
        const propertyData = {
          title: listing.title || "Propiedad de Inmuebles24",
          description: listing.description || listing.title || "Sin descripción disponible.",
          price: listing.price?.amount || 0,
          type: (listing.operation === "rent" ? "rent" : "sale") as "rent" | "sale",
          status: "active",
          latitude: listing.location?.lat || 0,
          longitude: listing.location?.lng || 0,
          address: listing.location?.address || listing.title,
          city: listing.location?.municipality || "Desconocida",
          state: listing.location?.state || "Desconocido",
          neighborhood: listing.location?.neighborhood,
          squareMeters: listing.area?.construction_m2 || 0,
          bedrooms: listing.features?.bedrooms || 0,
          bathrooms: listing.features?.bathrooms || 0,
          parking: listing.features?.parking || 0,
          pricePerSquareMeter: listing.price?.price_per_m2 || 0,
          amenities: listing.amenities || [],
          featured: false,
          views: 0,
        };

        // We need an agentId. For now, we'll use a placeholder or try to find a default agent.
        // This mutation will be called to save the property.
        await ctx.runMutation(api.properties.createFromImport, propertyData);
        importedCount++;
      } catch (err) {
        console.error(`Error importing listing ${listing.id}:`, err);
      }
    }

    return { importedCount, totalFound: listings.length };
  },
});
