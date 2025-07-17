import { db } from "../server/db";
import { properties, wildlifeData, fishingSpots } from "../shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");
  
  // Clear existing data
  await db.delete(fishingSpots);
  await db.delete(wildlifeData);
  await db.delete(properties);
  
  // Insert properties
  const sampleProperties = [
    {
      name: "Rocky Mountain Ranch",
      type: "private",
      latitude: 44.4280,
      longitude: -110.5885,
      size: 2340,
      elevation: { min: 1200, max: 1850 },
      waterFeatures: ["Stream", "Pond", "Creek"],
      vegetation: ["Pine Forest", "Aspen Groves", "Meadow Grass"],
      access: "Private property - Contact landowner",
      landowner: "Rocky Mountain Ranch LLC",
    },
    {
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
    },
    {
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
    },
  ];

  await db.insert(properties).values(sampleProperties);
  console.log("Properties seeded");

  // Insert wildlife data
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

  await db.insert(wildlifeData).values(sampleWildlife);
  console.log("Wildlife data seeded");

  // Insert fishing spots
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

  await db.insert(fishingSpots).values(sampleFishingSpots);
  console.log("Fishing spots seeded");
  
  console.log("Database seeding complete!");
}

seedDatabase().catch(console.error);