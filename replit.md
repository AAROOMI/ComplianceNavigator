# ComplianceNavigator

## Overview

ComplianceNavigator is a comprehensive cybersecurity compliance management platform designed specifically for implementing and managing the NCA ECC (National Cybersecurity Authority Essential Cybersecurity Controls) framework. The platform combines AI-powered assistance with structured assessment tools to help organizations achieve and maintain cybersecurity compliance across five core domains: Governance, Cybersecurity Defence, Cybersecurity Resilience, Third Party Cloud Computing, and Industrial Control Systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for robust form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful endpoints with consistent error handling and logging middleware
- **File Structure**: Modular architecture with separate routes, services, and storage layers

### Database Design
- **ORM**: Drizzle ORM for type-safe database operations
- **Primary Database**: PostgreSQL via Neon for production
- **Fallback**: In-memory storage for development/testing scenarios
- **Schema**: Relational design with tables for users, assessments, policies, vulnerabilities, and risk management plans
- **Migrations**: Managed through Drizzle Kit for version control

### Authentication & Security
- **Session Management**: Passport.js-based authentication with session storage
- **Database Sessions**: PostgreSQL session storage using connect-pg-simple
- **Security Approach**: Server-side session validation with secure cookie handling

### AI Integration
- **Provider**: OpenAI GPT-3.5-turbo for intelligent compliance assistance
- **Use Cases**: 
  - Automated security policy generation based on NCA ECC domains
  - Real-time compliance guidance and question answering
  - Risk assessment recommendations
- **Fallback Strategy**: Simulated responses when OpenAI API is unavailable

### Component Architecture
- **Layout System**: Responsive sidebar navigation with mobile-friendly collapsible design
- **Form Components**: Reusable form elements with consistent validation patterns
- **Data Visualization**: Chart.js integration for compliance scoring and trend analysis
- **Assessment Engine**: Multi-step questionnaire system with weighted scoring algorithm

## External Dependencies

### Cloud Infrastructure
- **Database Hosting**: Neon PostgreSQL for managed database services
- **WebSocket Support**: Native WebSocket implementation for real-time features

### AI & Machine Learning
- **OpenAI API**: GPT-3.5-turbo for natural language processing and policy generation
- **Fallback Intelligence**: Built-in simulated responses for offline scenarios

### Development & Build Tools
- **Package Manager**: npm for dependency management
- **Development Server**: Vite dev server with hot module replacement
- **Production Build**: ESBuild for optimized server bundling
- **Type Checking**: TypeScript compiler for static analysis

### UI & Visualization Libraries
- **Icons**: Lucide React for consistent iconography
- **Charts**: Chart.js with React wrapper for data visualization
- **Date Handling**: date-fns for date manipulation and formatting
- **Styling**: Tailwind CSS with custom design system configuration

### Quality Assurance
- **Validation**: Zod schema validation for runtime type checking
- **Error Handling**: Comprehensive error boundaries and logging
- **Development Tools**: Runtime error modal for improved debugging experience