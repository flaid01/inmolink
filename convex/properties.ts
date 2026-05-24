import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    type: v.optional(v.union(v.literal("sale"), v.literal("rent"))),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    minBedrooms: v.optional(v.number()),
    minSquareMeters: v.optional(v.number()),
    bounds: v.optional(v.object({
      north: v.number(),
      south: v.number(),
      east: v.number(),
      west: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("properties").withIndex("by_status", (q) => 
      q.eq("status", "active")
    );

    const properties = await query.collect();

    let filtered = properties;

    if (args.type) {
      filtered = filtered.filter(p => p.type === args.type);
    }

    if (args.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= args.minPrice!);
    }

    if (args.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= args.maxPrice!);
    }

    if (args.minBedrooms !== undefined) {
      filtered = filtered.filter(p => p.bedrooms >= args.minBedrooms!);
    }

    if (args.minSquareMeters !== undefined) {
      filtered = filtered.filter(p => p.squareMeters >= args.minSquareMeters!);
    }

    if (args.bounds) {
      filtered = filtered.filter(p => 
        p.latitude >= args.bounds!.south &&
        p.latitude <= args.bounds!.north &&
        p.longitude >= args.bounds!.west &&
        p.longitude <= args.bounds!.east
      );
    }

    // Get agent info for each property
    const propertiesWithDetails = await Promise.all(
      filtered.map(async (property) => {
        const agent = await ctx.db.get(property.agentId);
        
        // Get image URLs from the images array in the property
        const imageUrls = await Promise.all(
          property.images.map(async (imageId) => await ctx.storage.getUrl(imageId))
        );

        return {
          ...property,
          agent: agent ? { 
            name: agent.name || "Unknown Agent", 
            email: agent.email || "", 
            verified: true // Default to true since we don't have this field in auth users
          } : null,
          images: imageUrls.filter(Boolean),
        };
      })
    );

    return propertiesWithDetails;
  },
});

export const getById = query({
  args: { id: v.id("properties") },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.id);
    if (!property) return null;

    const agent = await ctx.db.get(property.agentId);
    
    // Get image URLs from the images array in the property
    const imageUrls = await Promise.all(
      property.images.map(async (imageId) => await ctx.storage.getUrl(imageId))
    );

    return {
      ...property,
      agent: agent ? { 
        name: agent.name || "Unknown Agent", 
        email: agent.email || "", 
        verified: true, // Default to true
        phone: agent.phone || ""
      } : null,
      images: imageUrls.filter(Boolean),
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    type: v.union(v.literal("sale"), v.literal("rent")),
    latitude: v.number(),
    longitude: v.number(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    squareMeters: v.number(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    parking: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const pricePerSquareMeter = Math.round(args.price / args.squareMeters);

    return await ctx.db.insert("properties", {
      ...args,
      agentId: userId,
      status: "active",
      views: 0,
      featured: false,
      pricePerSquareMeter,
      images: [], // Empty array initially
    });
  },
});

export const createFromImport = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    type: v.union(v.literal("sale"), v.literal("rent")),
    status: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    neighborhood: v.optional(v.string()),
    squareMeters: v.number(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    parking: v.number(),
    pricePerSquareMeter: v.number(),
    amenities: v.array(v.string()),
    featured: v.boolean(),
    views: v.number(),
  },
  handler: async (ctx, args) => {
    // Try to get current user, otherwise find the first agent
    let agentId = await getAuthUserId(ctx);
    
    if (!agentId) {
      const firstAgent = await ctx.db.query("users").first();
      if (firstAgent) {
        agentId = firstAgent._id;
      } else {
        // Create a system agent if none exists
        agentId = await ctx.db.insert("users", {
          name: "Sistema InmoLink",
          email: "system@inmolink.com",
        });
      }
    }

    return await ctx.db.insert("properties", {
      ...args,
      status: "active",
      agentId: agentId!,
      images: [],
    });
  },
});

export const incrementViews = mutation({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) throw new Error("Property not found");

    await ctx.db.patch(args.propertyId, {
      views: property.views + 1,
    });

    // Also create a view record for analytics
    const userId = await getAuthUserId(ctx);
    await ctx.db.insert("propertyViews", {
      propertyId: args.propertyId,
      userId: userId || undefined,
    });
  },
});

export const search = query({
  args: {
    query: v.string(),
    type: v.optional(v.union(v.literal("sale"), v.literal("rent"))),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("properties")
      .withSearchIndex("search_properties", (q) => {
        let search = q.search("title", args.query);
        if (args.type) {
          search = search.eq("type", args.type);
        }
        if (args.city) {
          search = search.eq("city", args.city);
        }
        return search.eq("status", "active");
      })
      .take(20);

    // Get agent info for each property
    const propertiesWithDetails = await Promise.all(
      results.map(async (property) => {
        const agent = await ctx.db.get(property.agentId);
        
        // Get image URLs from the images array in the property
        const imageUrls = await Promise.all(
          property.images.map(async (imageId) => await ctx.storage.getUrl(imageId))
        );

        return {
          ...property,
          agent: agent ? { 
            name: agent.name || "Unknown Agent", 
            email: agent.email || "", 
            verified: true
          } : null,
          images: imageUrls.filter(Boolean),
        };
      })
    );

    return propertiesWithDetails;
  },
});
