# Community Hub Platform

## Overview

This is a full-stack community platform built with React, Express, and PostgreSQL. The application serves as a social hub where users can create posts, share files, join servers, and interact with various community features including WhatsApp bot integration, VPN files, modded apps, and more.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React Context for auth
- **Build Tool**: Vite for development and production builds
- **Component System**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **File Upload**: Multer for handling file uploads
- **Email Service**: Nodemailer for verification and notifications
- **WebSockets**: Built-in WebSocket server for real-time features

### Database Architecture
- **ORM**: Drizzle with PostgreSQL dialect
- **Connection**: Neon serverless PostgreSQL
- **Migration**: Drizzle Kit for schema migrations
- **Schema Location**: Shared schema definition in `/shared/schema.ts`

## Key Components

### Authentication System
- User registration with email verification
- JWT token-based authentication
- Password reset functionality
- Admin role management
- Country-based user registration

### Content Management
- **Posts**: Users can create posts with text content and file attachments
- **Reactions**: Like, love, laugh, cry reactions on posts
- **Comments**: Threaded commenting system
- **File Sharing**: Support for multiple file types with 10MB limit
- **Anonymous Posting**: Option to post anonymously

### Server Management
- Free server provisioning system
- Server details with connection credentials
- Copy-to-clipboard functionality for server information
- User-specific server generation

### Communication Features
- **Talk Hub**: Private messaging system
- **WhatsApp Bot**: Integration for WhatsApp automation
- **Community**: Join community features
- **Contact Admin**: Direct communication with administrators

### Additional Features
- **VPN Files**: Distribution of VPN configuration files
- **Modded Apps**: Sharing of modified applications
- **WiFi Bypass**: Network bypass tools and guides
- **Feedback System**: User ratings and feedback collection

## Data Flow

1. **User Authentication**: Login/register → JWT token → stored in localStorage → included in API requests
2. **Post Creation**: Form submission → file upload (if any) → database storage → real-time updates via WebSocket
3. **File Handling**: Client upload → server processing → file system storage → URL generation
4. **Real-time Updates**: WebSocket connection for live notifications and updates
5. **Email Flow**: User actions → email queue → SMTP delivery via Gmail

## External Dependencies

### Frontend Dependencies
- **UI Components**: Extensive Radix UI component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Fetch API with TanStack Query wrapper
- **File Upload**: Custom file upload component with drag-and-drop

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **Authentication**: bcryptjs for password hashing, jsonwebtoken for JWT
- **Email**: nodemailer for SMTP email delivery
- **File Upload**: multer for multipart form handling
- **WebSockets**: ws library for real-time communication

### Development Tools
- **TypeScript**: Full TypeScript support across frontend and backend
- **Vite**: Development server with HMR and production builds
- **ESBuild**: Backend bundling for production deployment
- **Drizzle Kit**: Database schema management and migrations

## Deployment Strategy

### Build Process
- Frontend: Vite builds client code to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Static files: Served from Express in production
- Database: Migrations handled via Drizzle Kit

### Environment Configuration
- **Development**: Vite dev server with Express backend
- **Production**: Single Express server serving both API and static files
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Email**: Gmail SMTP with app-specific password

### File Storage
- Local file system storage in `/uploads` directory
- Separate subdirectories for posts and profile pictures
- Static file serving via Express middleware
- 10MB file size limit with type validation

### Security Considerations
- JWT token authentication with configurable secret
- Password hashing with bcrypt
- File upload restrictions and validation
- CORS configuration for cross-origin requests
- Input validation with Zod schemas
