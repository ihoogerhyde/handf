import { pgTable, text, serial, real, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'public' | 'private'
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  size: real("size"), // in acres
  elevation: json("elevation").$type<{ min: number; max: number }>(),
  waterFeatures: json("water_features").$type<string[]>(),
  vegetation: json("vegetation").$type<string[]>(),
  access: text("access"),
  landowner: text("landowner"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wildlifeData = pgTable("wildlife_data", {
  id: serial("id").primaryKey(),
  species: text("species").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  activityLevel: text("activity_level").notNull(), // 'high' | 'medium' | 'low'
  season: text("season"), // 'spring' | 'summer' | 'fall' | 'winter'
  habitat: text("habitat"),
  migrationPattern: json("migration_pattern").$type<{ start: string; end: string; route: Array<{ lat: number; lng: number }> }>(),
  lastObserved: timestamp("last_observed"),
});

export const fishingSpots = pgTable("fishing_spots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  waterType: text("water_type").notNull(), // 'river' | 'lake' | 'pond' | 'stream'
  depth: real("depth"), // in feet
  fishSpecies: json("fish_species").$type<string[]>(),
  hasBoatRamp: boolean("has_boat_ramp").default(false),
  accessibility: text("accessibility"),
});

export const userWaypoints = pgTable("user_waypoints", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  category: text("category").notNull(), // 'hunting' | 'fishing' | 'camping' | 'other'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export const insertWildlifeDataSchema = createInsertSchema(wildlifeData).omit({
  id: true,
});

export const insertFishingSpotSchema = createInsertSchema(fishingSpots).omit({
  id: true,
});

export const insertUserWaypointSchema = createInsertSchema(userWaypoints).omit({
  id: true,
  createdAt: true,
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type WildlifeData = typeof wildlifeData.$inferSelect;
export type InsertWildlifeData = z.infer<typeof insertWildlifeDataSchema>;
export type FishingSpot = typeof fishingSpots.$inferSelect;
export type InsertFishingSpot = z.infer<typeof insertFishingSpotSchema>;
export type UserWaypoint = typeof userWaypoints.$inferSelect;
export type InsertUserWaypoint = z.infer<typeof insertUserWaypointSchema>;
