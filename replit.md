# Hunting and Fishing Land Management System

## Overview

This is a full-stack web application designed for hunters and fishermen to explore, track, and manage land and water resources. The application provides interactive mapping capabilities with detailed information about properties, wildlife data, and fishing spots, along with user waypoint management features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom hunting/outdoor theme colors
- **UI Components**: Radix UI components via shadcn/ui library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Middleware**: Custom logging and error handling middleware
- **Development**: Hot reload with Vite middleware integration

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured with Neon serverless)
- **Schema**: Centralized schema definition in shared directory
- **Migrations**: Drizzle Kit for database migrations
- **Validation**: Zod schemas for runtime validation
- **Storage**: DatabaseStorage implementation replacing in-memory storage
- **Seeding**: Automatic data seeding with sample hunting/fishing data

## Key Components

### Data Models
- **Properties**: Land parcels with location, type (public/private), size, elevation, water features, vegetation
- **Wildlife Data**: Species tracking with activity levels, seasonal patterns, migration routes
- **Fishing Spots**: Water bodies with depth, fish species, boat ramp access
- **User Waypoints**: Personal bookmarks and notes for specific locations

### Interactive Mapping
- **Map Library**: Leaflet for interactive mapping capabilities
- **Base Layers**: Satellite imagery and terrain maps
- **Custom Markers**: Property markers, wildlife activity indicators, fishing spot markers
- **Layer Management**: Toggleable layers for different data types
- **Geolocation**: User location services for navigation

### User Interface
- **Responsive Design**: Mobile-first approach with dedicated mobile navigation
- **Layer Panel**: Collapsible sidebar for managing map layers
- **Property Modals**: Detailed property information with save functionality
- **Search Features**: Real-time property search with auto-complete
- **Legend System**: Visual legend for map symbols and colors

### API Endpoints
- **Properties**: CRUD operations for land management
- **Wildlife**: Species data retrieval and filtering
- **Fishing Spots**: Water body information management
- **User Waypoints**: Personal location bookmarking system

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **Server Processing**: Express routes handle requests and validate data using Zod schemas
3. **Database Operations**: Drizzle ORM performs type-safe database queries
4. **Response Formatting**: Structured JSON responses returned to client
5. **State Management**: TanStack Query caches and manages server state
6. **UI Updates**: React components re-render based on query state changes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM
- **leaflet**: Interactive mapping library
- **wouter**: Lightweight routing library

### UI Dependencies
- **@radix-ui/***: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe CSS class variants

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database migration and schema management
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Database**: Environment variable-based PostgreSQL connection
- **Asset Serving**: Vite middleware for static asset handling
- **API Integration**: Express server with Vite middleware for full-stack development

### Production Build
- **Frontend**: Vite build with optimized bundling and tree-shaking
- **Backend**: esbuild compilation to ESM format
- **Database**: Drizzle migrations for schema deployment
- **Environment**: NODE_ENV-based configuration switching

### File Structure
- **client/**: React frontend application
- **server/**: Express backend API
- **shared/**: Common schemas and types
- **migrations/**: Database migration files
- **dist/**: Production build output

The application uses a monorepo structure with shared TypeScript types and schemas, enabling type safety across the full stack while maintaining clear separation of concerns between frontend and backend code.