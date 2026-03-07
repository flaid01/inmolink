import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Properties table - Core property information
  properties: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    type: v.union(v.literal("sale"), v.literal("rent")),
    status: v.union(
      v.literal("active"), 
      v.literal("pending"), 
      v.literal("sold"), 
      v.literal("rented"),
      v.literal("inactive")
    ),
    
    // Location data
    latitude: v.number(),
    longitude: v.number(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    
    // Property details
    squareMeters: v.number(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    parking: v.number(),
    yearBuilt: v.optional(v.number()),
    lotSize: v.optional(v.number()),
    
    // Pricing
    pricePerSquareMeter: v.number(),
    maintenanceFee: v.optional(v.number()),
    propertyTax: v.optional(v.number()),
    
    // Features and amenities
    features: v.optional(v.array(v.string())), // ["pool", "garden", "gym", etc.]
    amenities: v.optional(v.array(v.string())), // ["security", "parking", "elevator", etc.]
    
    // Media
    images: v.array(v.id("_storage")), // Array of storage IDs for images
    virtualTourUrl: v.optional(v.string()),
    floorPlanUrl: v.optional(v.string()),
    
    // Agent/Owner information
    agentId: v.id("users"), // Reference to the agent/owner
    
    // Metadata
    views: v.number(),
    featured: v.boolean(),
    publishedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
  })
    .index("by_agent", ["agentId"])
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_price", ["price"])
    .index("by_location", ["city", "state"])
    .index("by_featured", ["featured"])
    .index("by_type_and_status", ["type", "status"])
    .searchIndex("search_properties", {
      searchField: "title",
      filterFields: ["type", "status", "city", "agentId"]
    }),

  // User favorites
  favorites: defineTable({
    userId: v.id("users"),
    propertyId: v.id("properties"),
  })
    .index("by_user", ["userId"])
    .index("by_property", ["propertyId"])
    .index("by_user_and_property", ["userId", "propertyId"]),

  // Property comparisons
  comparisons: defineTable({
    userId: v.id("users"),
    name: v.string(),
    propertyIds: v.array(v.id("properties")),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"]),

  // Property inquiries/leads
  inquiries: defineTable({
    propertyId: v.id("properties"),
    userId: v.optional(v.id("users")), // Optional for anonymous inquiries
    agentId: v.id("users"), // Agent receiving the inquiry
    
    // Contact information (for anonymous users)
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    
    // Inquiry details
    message: v.string(),
    inquiryType: v.union(
      v.literal("viewing"), 
      v.literal("info"), 
      v.literal("offer"),
      v.literal("general")
    ),
    
    // Status tracking
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("closed")
    ),
    
    // Scheduling
    preferredDate: v.optional(v.number()),
    scheduledDate: v.optional(v.number()),
    
    // Agent notes
    agentNotes: v.optional(v.string()),
    followUpDate: v.optional(v.number()),
  })
    .index("by_property", ["propertyId"])
    .index("by_agent", ["agentId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_agent_and_status", ["agentId", "status"]),

  // Property views/analytics
  propertyViews: defineTable({
    propertyId: v.id("properties"),
    userId: v.optional(v.id("users")), // Optional for anonymous views
    sessionId: v.optional(v.string()), // For tracking anonymous sessions
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    viewDuration: v.optional(v.number()), // Time spent viewing in seconds
  })
    .index("by_property", ["propertyId"])
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),

  // Saved searches
  savedSearches: defineTable({
    userId: v.id("users"),
    name: v.string(),
    
    // Search criteria
    type: v.optional(v.union(v.literal("sale"), v.literal("rent"))),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    minBedrooms: v.optional(v.number()),
    maxBedrooms: v.optional(v.number()),
    minBathrooms: v.optional(v.number()),
    minSquareMeters: v.optional(v.number()),
    maxSquareMeters: v.optional(v.number()),
    
    // Location filters
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    neighborhoods: v.optional(v.array(v.string())),
    
    // Feature filters
    features: v.optional(v.array(v.string())),
    amenities: v.optional(v.array(v.string())),
    
    // Notification settings
    emailAlerts: v.boolean(),
    alertFrequency: v.union(
      v.literal("immediate"),
      v.literal("daily"),
      v.literal("weekly")
    ),
    lastAlertSent: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_alerts", ["emailAlerts"]),

  // Property reviews/ratings (for agents)
  reviews: defineTable({
    propertyId: v.id("properties"),
    agentId: v.id("users"), // Agent being reviewed
    reviewerId: v.id("users"), // User leaving the review
    
    rating: v.number(), // 1-5 stars
    title: v.optional(v.string()),
    comment: v.optional(v.string()),
    
    // Review categories
    communication: v.optional(v.number()), // 1-5 rating
    professionalism: v.optional(v.number()),
    knowledge: v.optional(v.number()),
    responsiveness: v.optional(v.number()),
    
    // Moderation
    approved: v.boolean(),
    flagged: v.boolean(),
  })
    .index("by_property", ["propertyId"])
    .index("by_agent", ["agentId"])
    .index("by_reviewer", ["reviewerId"])
    .index("by_approved", ["approved"]),

  // Notifications
  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("inquiry"),
      v.literal("favorite_update"),
      v.literal("search_alert"),
      v.literal("review"),
      v.literal("system")
    ),
    title: v.string(),
    message: v.string(),
    
    // Related entities
    propertyId: v.optional(v.id("properties")),
    inquiryId: v.optional(v.id("inquiries")),
    
    // Status
    read: v.boolean(),
    actionUrl: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "read"])
    .index("by_type", ["type"]),

  // Agent/User profiles (extends the auth users table)
  userProfiles: defineTable({
    userId: v.id("users"),
    
    // Profile information
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatar: v.optional(v.id("_storage")),
    
    // Contact information
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    website: v.optional(v.string()),
    
    // Professional information (for agents)
    licenseNumber: v.optional(v.string()),
    agency: v.optional(v.string()),
    specialties: v.optional(v.array(v.string())),
    experience: v.optional(v.number()), // Years of experience
    
    // Verification status
    phoneVerified: v.boolean(),
    licenseVerified: v.boolean(),
    
    // Preferences
    language: v.optional(v.string()),
    timezone: v.optional(v.string()),
    emailNotifications: v.boolean(),
    smsNotifications: v.boolean(),
    
    // Statistics (for agents)
    totalListings: v.number(),
    activeListing: v.number(),
    totalSales: v.number(),
    averageRating: v.optional(v.number()),
    totalReviews: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_license", ["licenseNumber"])
    .index("by_agency", ["agency"]),

  // Property documents/attachments
  propertyDocuments: defineTable({
    propertyId: v.id("properties"),
    agentId: v.id("users"),
    
    name: v.string(),
    type: v.union(
      v.literal("contract"),
      v.literal("deed"),
      v.literal("inspection"),
      v.literal("appraisal"),
      v.literal("disclosure"),
      v.literal("other")
    ),
    fileId: v.id("_storage"),
    fileSize: v.number(),
    mimeType: v.string(),
    
    // Access control
    isPublic: v.boolean(), // Whether clients can see this document
    requiresAuth: v.boolean(), // Whether user needs to be logged in
  })
    .index("by_property", ["propertyId"])
    .index("by_agent", ["agentId"])
    .index("by_type", ["type"])
    .index("by_public", ["isPublic"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
