import { 
  properties, 
  wildlifeData, 
  fishingSpots, 
  userWaypoints,
  type Property, 
  type InsertProperty,
  type WildlifeData,
  type InsertWildlifeData,
  type FishingSpot,
  type InsertFishingSpot,
  type UserWaypoint,
  type InsertUserWaypoint
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, ilike, or } from "drizzle-orm";

export interface IStorage {
  // Properties
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  searchProperties(query: string): Promise<Property[]>;
  getPropertiesInBounds(bounds: { north: number; south: number; east: number; west: number }): Promise<Property[]>;
  
  // Wildlife Data
  getWildlifeData(): Promise<WildlifeData[]>;
  getWildlifeDataBySpecies(species: string): Promise<WildlifeData[]>;
  createWildlifeData(data: InsertWildlifeData): Promise<WildlifeData>;
  getWildlifeInBounds(bounds: { north: number; south: number; east: number; west: number }): Promise<WildlifeData[]>;
  
  // Fishing Spots
  getFishingSpots(): Promise<FishingSpot[]>;
  getFishingSpot(id: number): Promise<FishingSpot | undefined>;
  createFishingSpot(spot: InsertFishingSpot): Promise<FishingSpot>;
  getFishingSpotsInBounds(bounds: { north: number; south: number; east: number; west: number }): Promise<FishingSpot[]>;
  
  // User Waypoints
  getUserWaypoints(userId: string): Promise<UserWaypoint[]>;
  createUserWaypoint(waypoint: InsertUserWaypoint): Promise<UserWaypoint>;
  deleteUserWaypoint(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private properties: Map<number, Property> = new Map();
  private wildlifeData: Map<number, WildlifeData> = new Map();
  private fishingSpots: Map<number, FishingSpot> = new Map();
  private userWaypoints: Map<number, UserWaypoint> = new Map();
  private currentPropertyId = 1;
  private currentWildlifeId = 1;
  private currentFishingSpotId = 1;
  private currentWaypointId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed some initial property data
    const sampleProperties: Property[] = [
      {
        id: 1,
        name: "Rocky Mountain Ranch",
        type: "private",
        latitude: 40.7589,
        longitude: -105.5155,
        size: 147,
        elevation: { min: 1250, max: 1450 },
        waterFeatures: ["Creek", "2 ponds"],
        vegetation: ["Oak Forest", "Mixed Hardwood", "Open Fields", "Wetlands"],
        access: "Private property - Permission required from landowner",
        landowner: "Mountain View Holdings LLC",
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "Yellowstone National Forest",
        type: "public",
        latitude: 44.4280,
        longitude: -110.5885,
        size: 2221766,
        elevation: { min: 5282, max: 11358 },
        waterFeatures: ["Yellowstone River", "Yellowstone Lake", "Multiple streams"],
        vegetation: ["Coniferous Forest", "Alpine Meadows", "Sagebrush Steppe"],
        access: "Public access - Hunting permits required",
        landowner: "U.S. National Park Service",
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Great Lakes Wetland Preserve",
        type: "public",
        latitude: 46.7833,
        longitude: -92.1067,
        size: 834,
        elevation: { min: 602, max: 745 },
        waterFeatures: ["Lake Superior", "Wetlands", "Bog lakes"],
        vegetation: ["Boreal Forest", "Wetland Grass", "Cattail Marshes"],
        access: "Public access - Waterfowl hunting permitted",
        landowner: "Minnesota Department of Natural Resources",
        createdAt: new Date(),
      },
      {
        id: 4,
        name: "Fenton State Recreation Area",
        type: "public",
        latitude: 42.7847,
        longitude: -83.7436,
        size: 1380,
        elevation: { min: 862, max: 1024 },
        waterFeatures: ["Lake Fenton", "Creeks", "Wetlands"],
        vegetation: ["Oak-Hickory Forest", "Prairie Grassland", "Wetland Marsh"],
        access: "Public hunting allowed with valid license",
        landowner: "Michigan Department of Natural Resources",
        createdAt: new Date(),
      },
      {
        id: 5,
        name: "Shiawassee National Wildlife Refuge",
        type: "public",
        latitude: 43.2583,
        longitude: -84.0747,
        size: 9870,
        elevation: { min: 568, max: 610 },
        waterFeatures: ["Shiawassee River", "Marsh pools", "Wetlands"],
        vegetation: ["Wetland Grass", "Cattail Marshes", "Hardwood Forest"],
        access: "Federal hunting permits required",
        landowner: "U.S. Fish and Wildlife Service",
        createdAt: new Date(),
      },
      {
        id: 6,
        name: "Blackhawk Island Hunt Club",
        type: "private",
        latitude: 42.6234,
        longitude: -83.8912,
        size: 450,
        elevation: { min: 891, max: 934 },
        waterFeatures: ["Island Lake", "Cattail ponds"],
        vegetation: ["Wetland Grass", "Oak Forest", "Food plots"],
        access: "Private property - Members only",
        landowner: "Blackhawk Island Hunt Club LLC",
        createdAt: new Date(),
      }
    ];

    // Seed wildlife data
    const sampleWildlife: WildlifeData[] = [
      {
        id: 1,
        species: "white-tailed-deer",
        latitude: 40.7589,
        longitude: -105.5155,
        activityLevel: "high",
        season: "fall",
        habitat: "Mixed woodland and fields",
        migrationPattern: {
          start: "October",
          end: "March",
          route: [
            { lat: 40.7589, lng: -105.5155 },
            { lat: 40.7234, lng: -105.4987 },
            { lat: 40.6892, lng: -105.4654 }
          ]
        },
        lastObserved: new Date(),
      },
      {
        id: 2,
        species: "elk",
        latitude: 44.4280,
        longitude: -110.5885,
        activityLevel: "high",
        season: "fall",
        habitat: "Alpine meadows and forest edges",
        migrationPattern: {
          start: "September",
          end: "May",
          route: [
            { lat: 44.4280, lng: -110.5885 },
            { lat: 44.3456, lng: -110.4234 },
            { lat: 44.2789, lng: -110.3567 }
          ]
        },
        lastObserved: new Date(),
      },
      {
        id: 3,
        species: "wild-turkey",
        latitude: 40.7589,
        longitude: -105.5155,
        activityLevel: "medium",
        season: "spring",
        habitat: "Oak forest with open areas",
        migrationPattern: null,
        lastObserved: new Date(),
      },
      {
        id: 4,
        species: "waterfowl",
        latitude: 46.7833,
        longitude: -92.1067,
        activityLevel: "high",
        season: "fall",
        habitat: "Wetlands and lake shores",
        migrationPattern: {
          start: "October",
          end: "April",
          route: [
            { lat: 46.7833, lng: -92.1067 },
            { lat: 45.2345, lng: -93.4567 },
            { lat: 43.5678, lng: -94.7890 }
          ]
        },
        lastObserved: new Date(),
      },
      {
        id: 5,
        species: "white-tailed-deer",
        latitude: 42.7847,
        longitude: -83.7436,
        activityLevel: "high",
        season: "fall",
        habitat: "Oak-hickory forest edge",
        migrationPattern: null,
        lastObserved: new Date(),
      },
      {
        id: 6,
        species: "wild-turkey",
        latitude: 42.6234,
        longitude: -83.8912,
        activityLevel: "medium",
        season: "spring",
        habitat: "Oak forest with openings",
        migrationPattern: null,
        lastObserved: new Date(),
      },
      {
        id: 7,
        species: "waterfowl",
        latitude: 43.2583,
        longitude: -84.0747,
        activityLevel: "high",
        season: "fall",
        habitat: "Marsh pools and wetlands",
        migrationPattern: {
          start: "September",
          end: "November",
          route: [
            { lat: 43.2583, lng: -84.0747 },
            { lat: 42.8934, lng: -84.2456 },
            { lat: 42.3456, lng: -84.8901 }
          ]
        },
        lastObserved: new Date(),
      }
    ];

    // Seed fishing spots
    const sampleFishingSpots: FishingSpot[] = [
      {
        id: 1,
        name: "Bass Cove",
        latitude: 46.7833,
        longitude: -92.1067,
        waterType: "lake",
        depth: 25,
        fishSpecies: ["Largemouth Bass", "Northern Pike", "Walleye"],
        hasBoatRamp: true,
        accessibility: "Public boat ramp with parking",
      },
      {
        id: 2,
        name: "Trout Creek",
        latitude: 40.7589,
        longitude: -105.5155,
        waterType: "stream",
        depth: 8,
        fishSpecies: ["Rainbow Trout", "Brown Trout", "Brook Trout"],
        hasBoatRamp: false,
        accessibility: "Wade fishing only - rocky creek bed",
      },
      {
        id: 3,
        name: "Yellowstone River",
        latitude: 44.4280,
        longitude: -110.5885,
        waterType: "river",
        depth: 15,
        fishSpecies: ["Cutthroat Trout", "Mountain Whitefish", "Grayling"],
        hasBoatRamp: true,
        accessibility: "Multiple access points with facilities",
      },
      {
        id: 4,
        name: "Lake Fenton",
        latitude: 42.7847,
        longitude: -83.7436,
        waterType: "lake",
        depth: 45,
        fishSpecies: ["Largemouth Bass", "Bluegill", "Northern Pike", "Walleye"],
        hasBoatRamp: true,
        accessibility: "Public boat launch with parking",
      },
      {
        id: 5,
        name: "Shiawassee River",
        latitude: 43.2583,
        longitude: -84.0747,
        waterType: "river",
        depth: 12,
        fishSpecies: ["Steelhead", "Salmon", "Smallmouth Bass", "Walleye"],
        hasBoatRamp: true,
        accessibility: "Multiple access points along river",
      }
    ];

    sampleProperties.forEach(prop => this.properties.set(prop.id, prop));
    sampleWildlife.forEach(wildlife => this.wildlifeData.set(wildlife.id, wildlife));
    sampleFishingSpots.forEach(spot => this.fishingSpots.set(spot.id, spot));
    
    this.currentPropertyId = sampleProperties.length + 1;
    this.currentWildlifeId = sampleWildlife.length + 1;
    this.currentFishingSpotId = sampleFishingSpots.length + 1;
  }

  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const newProperty: Property = { 
      ...property, 
      id, 
      createdAt: new Date(),
      elevation: property.elevation || null,
      size: property.size || null,
      waterFeatures: property.waterFeatures ? [...property.waterFeatures] : null,
      vegetation: property.vegetation ? [...property.vegetation] : null,
      access: property.access || null,
      landowner: property.landowner || null,
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async getWildlifeData(): Promise<WildlifeData[]> {
    return Array.from(this.wildlifeData.values());
  }

  async getWildlifeDataBySpecies(species: string): Promise<WildlifeData[]> {
    return Array.from(this.wildlifeData.values()).filter(data => data.species === species);
  }

  async createWildlifeData(data: InsertWildlifeData): Promise<WildlifeData> {
    const id = this.currentWildlifeId++;
    const newWildlifeData: WildlifeData = { 
      ...data, 
      id,
      season: data.season || null,
      habitat: data.habitat || null,
      migrationPattern: data.migrationPattern ? {
        start: data.migrationPattern.start,
        end: data.migrationPattern.end,
        route: [...data.migrationPattern.route]
      } : null,
      lastObserved: data.lastObserved || null,
    };
    this.wildlifeData.set(id, newWildlifeData);
    return newWildlifeData;
  }

  async getFishingSpots(): Promise<FishingSpot[]> {
    return Array.from(this.fishingSpots.values());
  }

  async getFishingSpot(id: number): Promise<FishingSpot | undefined> {
    return this.fishingSpots.get(id);
  }

  async createFishingSpot(spot: InsertFishingSpot): Promise<FishingSpot> {
    const id = this.currentFishingSpotId++;
    const newFishingSpot: FishingSpot = { 
      ...spot, 
      id,
      depth: spot.depth || null,
      fishSpecies: spot.fishSpecies ? [...spot.fishSpecies] : null,
      hasBoatRamp: spot.hasBoatRamp || null,
      accessibility: spot.accessibility || null,
    };
    this.fishingSpots.set(id, newFishingSpot);
    return newFishingSpot;
  }

  async getUserWaypoints(userId: string): Promise<UserWaypoint[]> {
    return Array.from(this.userWaypoints.values()).filter(waypoint => waypoint.userId === userId);
  }

  async createUserWaypoint(waypoint: InsertUserWaypoint): Promise<UserWaypoint> {
    const id = this.currentWaypointId++;
    const newWaypoint: UserWaypoint = { 
      ...waypoint, 
      id, 
      createdAt: new Date(),
      notes: waypoint.notes || null,
    };
    this.userWaypoints.set(id, newWaypoint);
    return newWaypoint;
  }

  async deleteUserWaypoint(id: number): Promise<void> {
    this.userWaypoints.delete(id);
  }

  async searchProperties(query: string): Promise<Property[]> {
    const properties = Array.from(this.properties.values());
    const searchTerm = query.toLowerCase();
    
    return properties.filter(property => 
      property.name.toLowerCase().includes(searchTerm) ||
      property.type.toLowerCase().includes(searchTerm) ||
      property.landowner?.toLowerCase().includes(searchTerm) ||
      property.access?.toLowerCase().includes(searchTerm) ||
      property.vegetation?.some(v => v.toLowerCase().includes(searchTerm)) ||
      property.waterFeatures?.some(w => w.toLowerCase().includes(searchTerm))
    );
  }

  async getPropertiesInBounds(bounds: { north: number; south: number; east: number; west: number }): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(property => 
      property.latitude >= bounds.south &&
      property.latitude <= bounds.north &&
      property.longitude >= bounds.west &&
      property.longitude <= bounds.east
    );
  }

  async getWildlifeInBounds(bounds: { north: number; south: number; east: number; west: number }): Promise<WildlifeData[]> {
    return Array.from(this.wildlifeData.values()).filter(wildlife => 
      wildlife.latitude >= bounds.south &&
      wildlife.latitude <= bounds.north &&
      wildlife.longitude >= bounds.west &&
      wildlife.longitude <= bounds.east
    );
  }

  async getFishingSpotsInBounds(bounds: { north: number; south: number; east: number; west: number }): Promise<FishingSpot[]> {
    return Array.from(this.fishingSpots.values()).filter(spot => 
      spot.latitude >= bounds.south &&
      spot.latitude <= bounds.north &&
      spot.longitude >= bounds.west &&
      spot.longitude <= bounds.east
    );
  }
}

export class DatabaseStorage implements IStorage {
  private seeded = false;

  async seedDatabase() {
    if (this.seeded) return;
    
    // Check if we already have data
    const existingProperties = await this.getProperties();
    if (existingProperties.length > 0) {
      this.seeded = true;
      return;
    }

    // Seed properties
    const sampleProperties = [
      {
        name: "Rocky Mountain Ranch",
        type: "private",
        latitude: 44.4280,
        longitude: -110.5885,
        size: 2340,
        elevation: { min: 1200, max: 1850 },
        waterFeatures: ["Stream", "Pond", "Creek"] as string[],
        vegetation: ["Pine Forest", "Aspen Groves", "Meadow Grass"] as string[],
        access: "Private property - Contact landowner",
        landowner: "Rocky Mountain Ranch LLC",
      },
      {
        name: "Yellowstone Buffer Zone",
        type: "public",
        latitude: 44.9778,
        longitude: -110.6968,
        size: 5600,
        elevation: { min: 1800, max: 2400 },
        waterFeatures: ["Yellowstone River", "Hot Springs", "Geysers"] as string[],
        vegetation: ["Lodgepole Pine", "Fir Forest", "Alpine Meadows"] as string[],
        access: "Public access - Hunting permits required",
        landowner: "U.S. National Park Service",
      },
      {
        name: "Fenton State Recreation Area",
        type: "public",
        latitude: 42.7847,
        longitude: -83.7436,
        size: 1380,
        elevation: { min: 862, max: 1024 },
        waterFeatures: ["Lake Fenton", "Creeks", "Wetlands"] as string[],
        vegetation: ["Oak-Hickory Forest", "Prairie Grassland", "Wetland Marsh"] as string[],
        access: "Public hunting allowed with valid license",
        landowner: "Michigan Department of Natural Resources",
      },
      {
        name: "Shiawassee National Wildlife Refuge",
        type: "public",
        latitude: 43.2583,
        longitude: -84.0747,
        size: 9870,
        elevation: { min: 568, max: 610 },
        waterFeatures: ["Shiawassee River", "Marsh pools", "Wetlands"] as string[],
        vegetation: ["Wetland Grass", "Cattail Marshes", "Hardwood Forest"] as string[],
        access: "Federal hunting permits required",
        landowner: "U.S. Fish and Wildlife Service",
      },
    ];

    for (const prop of sampleProperties) {
      await db.insert(properties).values(prop);
    }

    // Seed wildlife data
    const sampleWildlife = [
      {
        species: "white-tailed-deer",
        latitude: 44.4280,
        longitude: -110.5885,
        activityLevel: "high",
        season: "fall",
        habitat: "Forest edge with water access",
        migrationPattern: null,
        lastObserved: new Date(),
      },
      {
        species: "elk",
        latitude: 44.9778,
        longitude: -110.6968,
        activityLevel: "high",
        season: "fall",
        habitat: "Alpine meadows and forest",
        migrationPattern: {
          start: "September",
          end: "May",
          route: [
            { lat: 44.9778, lng: -110.6968 },
            { lat: 44.2619, lng: -110.8372 },
            { lat: 43.8231, lng: -110.7624 }
          ] as Array<{ lat: number; lng: number }>
        },
        lastObserved: new Date(),
      },
      {
        species: "white-tailed-deer",
        latitude: 42.7847,
        longitude: -83.7436,
        activityLevel: "high",
        season: "fall",
        habitat: "Oak-hickory forest edge",
        migrationPattern: null,
        lastObserved: new Date(),
      },
      {
        species: "waterfowl",
        latitude: 43.2583,
        longitude: -84.0747,
        activityLevel: "high",
        season: "fall",
        habitat: "Marsh pools and wetlands",
        migrationPattern: {
          start: "September",
          end: "November",
          route: [
            { lat: 43.2583, lng: -84.0747 },
            { lat: 42.8934, lng: -84.2456 },
            { lat: 42.3456, lng: -84.8901 }
          ]
        },
        lastObserved: new Date(),
      },
    ];

    for (const wildlife of sampleWildlife) {
      await db.insert(wildlifeData).values(wildlife);
    }

    // Seed fishing spots
    const sampleFishingSpots = [
      {
        name: "Lake Fenton",
        latitude: 42.7847,
        longitude: -83.7436,
        waterType: "lake",
        depth: 45,
        fishSpecies: ["Largemouth Bass", "Bluegill", "Northern Pike", "Walleye"],
        hasBoatRamp: true,
        accessibility: "Public boat launch with parking",
      },
      {
        name: "Shiawassee River",
        latitude: 43.2583,
        longitude: -84.0747,
        waterType: "river",
        depth: 12,
        fishSpecies: ["Steelhead", "Salmon", "Smallmouth Bass", "Walleye"],
        hasBoatRamp: true,
        accessibility: "Multiple access points along river",
      },
      {
        name: "Yellowstone River",
        latitude: 44.9778,
        longitude: -110.6968,
        waterType: "river",
        depth: 15,
        fishSpecies: ["Cutthroat Trout", "Mountain Whitefish", "Grayling"],
        hasBoatRamp: true,
        accessibility: "Multiple access points with facilities",
      },
    ];

    for (const spot of sampleFishingSpots) {
      await db.insert(fishingSpots).values(spot);
    }

    this.seeded = true;
  }
  async getProperties(): Promise<Property[]> {
    await this.seedDatabase();
    return await db.select().from(properties);
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values([property])
      .returning();
    return newProperty;
  }

  async searchProperties(query: string): Promise<Property[]> {
    return await db.select().from(properties).where(
      or(
        ilike(properties.name, `%${query}%`),
        ilike(properties.type, `%${query}%`),
        ilike(properties.landowner, `%${query}%`),
        ilike(properties.access, `%${query}%`)
      )
    );
  }

  async getPropertiesInBounds(bounds: { north: number; south: number; east: number; west: number }): Promise<Property[]> {
    return await db.select().from(properties).where(
      and(
        gte(properties.latitude, bounds.south),
        lte(properties.latitude, bounds.north),
        gte(properties.longitude, bounds.west),
        lte(properties.longitude, bounds.east)
      )
    );
  }

  async getWildlifeData(): Promise<WildlifeData[]> {
    await this.seedDatabase();
    return await db.select().from(wildlifeData);
  }

  async getWildlifeDataBySpecies(species: string): Promise<WildlifeData[]> {
    return await db.select().from(wildlifeData).where(eq(wildlifeData.species, species));
  }

  async createWildlifeData(data: InsertWildlifeData): Promise<WildlifeData> {
    const [newData] = await db
      .insert(wildlifeData)
      .values([data])
      .returning();
    return newData;
  }

  async getWildlifeInBounds(bounds: { north: number; south: number; east: number; west: number }): Promise<WildlifeData[]> {
    return await db.select().from(wildlifeData).where(
      and(
        gte(wildlifeData.latitude, bounds.south),
        lte(wildlifeData.latitude, bounds.north),
        gte(wildlifeData.longitude, bounds.west),
        lte(wildlifeData.longitude, bounds.east)
      )
    );
  }

  async getFishingSpots(): Promise<FishingSpot[]> {
    await this.seedDatabase();
    return await db.select().from(fishingSpots);
  }

  async getFishingSpot(id: number): Promise<FishingSpot | undefined> {
    const [spot] = await db.select().from(fishingSpots).where(eq(fishingSpots.id, id));
    return spot || undefined;
  }

  async createFishingSpot(spot: InsertFishingSpot): Promise<FishingSpot> {
    const [newSpot] = await db
      .insert(fishingSpots)
      .values([spot])
      .returning();
    return newSpot;
  }

  async getFishingSpotsInBounds(bounds: { north: number; south: number; east: number; west: number }): Promise<FishingSpot[]> {
    return await db.select().from(fishingSpots).where(
      and(
        gte(fishingSpots.latitude, bounds.south),
        lte(fishingSpots.latitude, bounds.north),
        gte(fishingSpots.longitude, bounds.west),
        lte(fishingSpots.longitude, bounds.east)
      )
    );
  }

  async getUserWaypoints(userId: string): Promise<UserWaypoint[]> {
    return await db.select().from(userWaypoints).where(eq(userWaypoints.userId, userId));
  }

  async createUserWaypoint(waypoint: InsertUserWaypoint): Promise<UserWaypoint> {
    const [newWaypoint] = await db
      .insert(userWaypoints)
      .values([waypoint])
      .returning();
    return newWaypoint;
  }

  async deleteUserWaypoint(id: number): Promise<void> {
    await db.delete(userWaypoints).where(eq(userWaypoints.id, id));
  }
}

// Using MemStorage temporarily due to stack overflow in DatabaseStorage
export const storage = new MemStorage();
