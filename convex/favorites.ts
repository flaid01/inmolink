import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const properties = await Promise.all(
      favorites.map(async (favorite) => {
        const property = await ctx.db.get(favorite.propertyId);
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
            verified: true
          } : null,
          images: imageUrls.filter(Boolean),
        };
      })
    );

    return properties.filter(Boolean);
  },
});

export const add = mutation({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already favorited
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_property", (q) => 
        q.eq("userId", userId).eq("propertyId", args.propertyId)
      )
      .unique();

    if (existing) {
      throw new Error("Property already in favorites");
    }

    return await ctx.db.insert("favorites", {
      userId,
      propertyId: args.propertyId,
    });
  },
});

export const remove = mutation({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_property", (q) => 
        q.eq("userId", userId).eq("propertyId", args.propertyId)
      )
      .unique();

    if (!favorite) {
      throw new Error("Property not in favorites");
    }

    await ctx.db.delete(favorite._id);
  },
});

export const isFavorite = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_property", (q) => 
        q.eq("userId", userId).eq("propertyId", args.propertyId)
      )
      .unique();

    return !!favorite;
  },
});
