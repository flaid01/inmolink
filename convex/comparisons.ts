import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("comparisons")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("comparisons") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const comparison = await ctx.db.get(args.id);
    if (!comparison || comparison.userId !== userId) {
      return null;
    }

    const properties = await Promise.all(
      comparison.propertyIds.map(async (propertyId) => {
        const property = await ctx.db.get(propertyId);
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

    return {
      ...comparison,
      properties: properties.filter(Boolean),
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    propertyIds: v.array(v.id("properties")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("comparisons", {
      userId,
      name: args.name,
      propertyIds: args.propertyIds,
      notes: args.notes,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("comparisons"),
    name: v.optional(v.string()),
    propertyIds: v.optional(v.array(v.id("properties"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const comparison = await ctx.db.get(args.id);
    if (!comparison || comparison.userId !== userId) {
      throw new Error("Comparison not found or not authorized");
    }

    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.propertyIds !== undefined) updates.propertyIds = args.propertyIds;
    if (args.notes !== undefined) updates.notes = args.notes;

    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("comparisons") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const comparison = await ctx.db.get(args.id);
    if (!comparison || comparison.userId !== userId) {
      throw new Error("Comparison not found or not authorized");
    }

    await ctx.db.delete(args.id);
  },
});
