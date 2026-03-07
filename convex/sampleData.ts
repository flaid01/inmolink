import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    // Create sample users (agents and buyers)
    const agent1 = await ctx.db.insert("users", {
      name: "María González",
      email: "maria@inmobiliaria.com",
      phone: "+52 442 123 4567",
    });

    const buyer1 = await ctx.db.insert("users", {
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "+52 442 987 6543",
    });

    // Create user profiles
    await ctx.db.insert("userProfiles", {
      userId: agent1,
      firstName: "María",
      lastName: "González",
      bio: "Agente inmobiliario con 10 años de experiencia en Querétaro",
      licenseNumber: "QRO-12345",
      agency: "Inmobiliaria González",
      specialties: ["Residencial", "Comercial"],
      experience: 10,
      phoneVerified: true,
      licenseVerified: true,
      emailNotifications: true,
      smsNotifications: true,
      totalListings: 0,
      activeListing: 0,
      totalSales: 0,
      totalReviews: 0,
    });

    await ctx.db.insert("userProfiles", {
      userId: buyer1,
      firstName: "Juan",
      lastName: "Pérez",
      phoneVerified: true,
      licenseVerified: false,
      emailNotifications: true,
      smsNotifications: false,
      totalListings: 0,
      activeListing: 0,
      totalSales: 0,
      totalReviews: 0,
    });

    // Sample properties
    const properties = [
      {
        title: "Casa en Juriquilla",
        description: "Hermosa casa en fraccionamiento privado con amenidades completas.",
        price: 3500000,
        type: "sale" as const,
        latitude: 20.5888,
        longitude: -100.4468,
        address: "Av. Paseo de la República 123, Juriquilla, Querétaro",
        city: "Querétaro",
        state: "Querétaro",
        squareMeters: 180,
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        agentId: agent1,
        status: "active" as const,
        views: 45,
        featured: true,
        pricePerSquareMeter: 19444,
        images: [],
      },
      {
        title: "Departamento Centro Histórico",
        description: "Moderno departamento en el corazón de Querétaro.",
        price: 15000,
        type: "rent" as const,
        latitude: 20.5931,
        longitude: -100.3931,
        address: "Calle Corregidora 45, Centro Histórico, Querétaro",
        city: "Querétaro",
        state: "Querétaro",
        squareMeters: 85,
        bedrooms: 2,
        bathrooms: 1,
        parking: 1,
        agentId: agent1,
        status: "active" as const,
        views: 32,
        featured: false,
        pricePerSquareMeter: 176,
        images: [],
      },
      {
        title: "Casa en Milenio III",
        description: "Amplia casa familiar en zona residencial exclusiva.",
        price: 5200000,
        type: "sale" as const,
        latitude: 20.6197,
        longitude: -100.4306,
        address: "Blvd. Milenio 789, Milenio III, Querétaro",
        city: "Querétaro",
        state: "Querétaro",
        squareMeters: 250,
        bedrooms: 4,
        bathrooms: 3,
        parking: 3,
        agentId: agent1,
        status: "active" as const,
        views: 67,
        featured: true,
        pricePerSquareMeter: 20800,
        images: [],
      },
      {
        title: "Townhouse en Zibatá",
        description: "Moderna casa en condominio horizontal con áreas verdes.",
        price: 2800000,
        type: "sale" as const,
        latitude: 20.5234,
        longitude: -100.2456,
        address: "Paseo de Zibatá 456, El Marqués, Querétaro",
        city: "El Marqués",
        state: "Querétaro",
        squareMeters: 140,
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        agentId: agent1,
        status: "active" as const,
        views: 28,
        featured: false,
        pricePerSquareMeter: 20000,
        images: [],
      },
      {
        title: "Loft en Zona Dorada",
        description: "Elegante loft tipo industrial con techos altos.",
        price: 18000,
        type: "rent" as const,
        latitude: 20.6089,
        longitude: -100.4103,
        address: "Av. Constituyentes 234, Zona Dorada, Querétaro",
        city: "Querétaro",
        state: "Querétaro",
        squareMeters: 95,
        bedrooms: 1,
        bathrooms: 1,
        parking: 1,
        agentId: agent1,
        status: "active" as const,
        views: 19,
        featured: false,
        pricePerSquareMeter: 189,
        images: [],
      },
    ];

    // Insert properties
    for (const property of properties) {
      await ctx.db.insert("properties", property);
    }

    return { message: "Sample data created successfully" };
  },
});
