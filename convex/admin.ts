import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper to check if current user is admin (simplified for mock purposes)
// In a real app, you would check a 'role' field on the user document
const isAdmin = async (ctx: any) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) return false;
  const user = await ctx.db.get(userId);
  // For this mock implementation, we'll assume any user with "admin" in their email or name is an admin
  return user?.email?.includes("admin") || user?.name?.includes("Admin");
};

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    // In a real app, check isAdmin(ctx)
    
    const users = await ctx.db.query("users").collect();
    const properties = await ctx.db.query("properties").collect();
    const inquiries = await ctx.db.query("inquiries").collect();
    const views = await ctx.db.query("propertyViews").collect();

    const pendingAgents = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("licenseVerified"), false))
      .collect();

    return {
      totalUsers: users.length,
      totalProperties: properties.length,
      totalInquiries: inquiries.length,
      totalViews: views.length,
      pendingVerifications: pendingAgents.length,
      activeProperties: properties.filter(p => p.status === "active").length,
    };
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .unique();
        
        return {
          ...user,
          profile,
        };
      })
    );
    
    return usersWithProfiles;
  },
});

export const listAllProperties = query({
  args: {},
  handler: async (ctx) => {
    const properties = await ctx.db.query("properties").collect();
    
    return await Promise.all(
      properties.map(async (p) => {
        const agent = await ctx.db.get(p.agentId);
        return {
          ...p,
          agentName: agent?.name || "Unknown",
        };
      })
    );
  },
});

export const verifyAgent = mutation({
  args: { userId: v.id("users"), status: v.boolean() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    
    if (profile) {
      await ctx.db.patch(profile._id, {
        licenseVerified: args.status,
      });
    } else {
      // Create profile if it doesn't exist
      await ctx.db.insert("userProfiles", {
        userId: args.userId,
        licenseVerified: args.status,
        phoneVerified: false,
        emailNotifications: true,
        smsNotifications: false,
        totalListings: 0,
        activeListing: 0,
        totalSales: 0,
        totalReviews: 0,
      });
    }
  },
});

export const updatePropertyStatus = mutation({
  args: { 
    propertyId: v.id("properties"), 
    status: v.union(
      v.literal("active"), 
      v.literal("pending"), 
      v.literal("sold"), 
      v.literal("rented"),
      v.literal("inactive")
    ) 
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.propertyId, {
      status: args.status,
    });
  },
});

export const toggleFeatured = mutation({
  args: { propertyId: v.id("properties"), featured: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.propertyId, {
      featured: args.featured,
    });
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Basic deletion - in production you'd want to clean up properties, inquiries, etc.
    await ctx.db.delete(args.userId);
    
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    if (profile) await ctx.db.delete(profile._id);
  },
});
