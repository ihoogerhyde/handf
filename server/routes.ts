import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertWildlifeDataSchema, insertFishingSpotSchema, insertUserWaypointSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Properties routes
  app.get("/api/properties", async (req, res) => {
    try {
      const { q, bounds } = req.query;
      
      if (q && typeof q === 'string') {
        // Search properties by query
        const properties = await storage.searchProperties(q);
        res.json(properties);
      } else if (bounds && typeof bounds === 'string') {
        // Filter properties by bounds
        const boundsObj = JSON.parse(bounds);
        const properties = await storage.getPropertiesInBounds(boundsObj);
        res.json(properties);
      } else {
        // Get all properties
        const properties = await storage.getProperties();
        res.json(properties);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ error: "Invalid property data" });
    }
  });

  // Wildlife data routes
  app.get("/api/wildlife", async (req, res) => {
    try {
      const { species, bounds } = req.query;
      
      if (bounds && typeof bounds === 'string') {
        // Filter wildlife by bounds
        const boundsObj = JSON.parse(bounds);
        const wildlifeData = await storage.getWildlifeInBounds(boundsObj);
        res.json(wildlifeData);
      } else if (species && typeof species === 'string') {
        const wildlifeData = await storage.getWildlifeDataBySpecies(species);
        res.json(wildlifeData);
      } else {
        const wildlifeData = await storage.getWildlifeData();
        res.json(wildlifeData);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wildlife data" });
    }
  });

  app.post("/api/wildlife", async (req, res) => {
    try {
      const validatedData = insertWildlifeDataSchema.parse(req.body);
      const wildlifeData = await storage.createWildlifeData(validatedData);
      res.status(201).json(wildlifeData);
    } catch (error) {
      res.status(400).json({ error: "Invalid wildlife data" });
    }
  });

  // Fishing spots routes
  app.get("/api/fishing-spots", async (req, res) => {
    try {
      const { bounds } = req.query;
      
      if (bounds && typeof bounds === 'string') {
        // Filter fishing spots by bounds
        const boundsObj = JSON.parse(bounds);
        const fishingSpots = await storage.getFishingSpotsInBounds(boundsObj);
        res.json(fishingSpots);
      } else {
        const fishingSpots = await storage.getFishingSpots();
        res.json(fishingSpots);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fishing spots" });
    }
  });

  app.get("/api/fishing-spots/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const fishingSpot = await storage.getFishingSpot(id);
      if (!fishingSpot) {
        return res.status(404).json({ error: "Fishing spot not found" });
      }
      res.json(fishingSpot);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fishing spot" });
    }
  });

  app.post("/api/fishing-spots", async (req, res) => {
    try {
      const validatedData = insertFishingSpotSchema.parse(req.body);
      const fishingSpot = await storage.createFishingSpot(validatedData);
      res.status(201).json(fishingSpot);
    } catch (error) {
      res.status(400).json({ error: "Invalid fishing spot data" });
    }
  });

  // User waypoints routes
  app.get("/api/waypoints/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const waypoints = await storage.getUserWaypoints(userId);
      res.json(waypoints);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch waypoints" });
    }
  });

  app.post("/api/waypoints", async (req, res) => {
    try {
      const validatedData = insertUserWaypointSchema.parse(req.body);
      const waypoint = await storage.createUserWaypoint(validatedData);
      res.status(201).json(waypoint);
    } catch (error) {
      res.status(400).json({ error: "Invalid waypoint data" });
    }
  });

  app.delete("/api/waypoints/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUserWaypoint(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete waypoint" });
    }
  });

  // Elevation data endpoint (using Open-Elevation API)
  app.get("/api/elevation", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
      const data = await response.json();
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch elevation data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
