# ComplianceNavigator

A comprehensive cybersecurity compliance management platform built for implementing and managing NCA ECC (National Cybersecurity Authority Essential Cybersecurity Controls) framework.

## 🚀 Features

### Core Functionality
- **AI-Powered Compliance Assistant**: Get real-time guidance on cybersecurity controls
- **Assessment Management**: Track compliance scores across NCA ECC domains
- **Policy Generation**: AI-assisted security policy creation
- **Vulnerability Management**: Identify and track security vulnerabilities
- **Risk Management Plans**: Create and monitor risk mitigation strategies

### NCA ECC Framework Coverage
- **Governance**: Strategy, policies, roles, asset management, risk management
- **Cybersecurity Defence**: Access control, cryptography, email security, network security, system security
- **Cybersecurity Resilience**: Business continuity, disaster recovery, incident management, vulnerability management, threat intelligence
- **Third Party Cloud Computing**: Provider selection, data protection, security configuration, access management, monitoring
- **Industrial Control Systems**: ICS-specific policies, network segmentation, access control, incident response, business continuity

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: Drizzle ORM with PostgreSQL (Neon) / In-memory fallback
- **UI Components**: Shadcn/ui + Tailwind CSS
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Authentication**: Session-based with Passport.js
- **Real-time**: WebSocket support

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/AAROOMI/ComplianceNavigator.git
cd ComplianceNavigator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup (Optional)
For production with database:
```bash
# Create .env file
echo "DATABASE_URL=your_postgresql_connection_string" > .env
echo "OPENAI_API_KEY=your_openai_api_key" >> .env
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at **http://localhost:5000**

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema changes

### Project Structure
```
ComplianceNavigator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   └── hooks/         # Custom React hooks
├── server/                 # Express backend
│   ├── routes.ts          # API routes
│   ├── services/          # Business logic
│   └── storage.ts         # Data access layer
├── shared/                 # Shared types and schemas
└── package.json           # Dependencies and scripts
```

## 🗄️ Database

### Development Mode
- Uses in-memory storage by default
- No external database required
- Data persists for the session

### Production Mode
- Requires PostgreSQL database
- Set `DATABASE_URL` environment variable
- Uses Drizzle ORM for type-safe database operations

## 🤖 AI Assistant

The AI assistant provides guidance on:
- NCA ECC implementation strategies
- Policy development recommendations
- Risk assessment methodologies
- Compliance best practices

### Configuration
- Set `OPENAI_API_KEY` for full AI functionality
- Falls back to simulated responses without API key
- Uses GPT-3.5-turbo model

## 📊 API Endpoints

### Assessments
- `GET /api/assessments/:userId` - Get user assessments
- `POST /api/assessments` - Create new assessment

### Policies
- `GET /api/policies/:userId` - Get user policies
- `POST /api/policies` - Create new policy (AI-generated)

### Vulnerabilities
- `GET /api/vulnerabilities/:userId` - Get user vulnerabilities
- `POST /api/vulnerabilities` - Create new vulnerability
- `GET /api/vulnerabilities/:userId/domain/:domain` - Get by domain

### Risk Management
- `GET /api/risk-management-plans/:userId` - Get risk plans
- `POST /api/risk-management-plans` - Create risk plan
- `PATCH /api/risk-management-plans/:id` - Update risk plan
- `DELETE /api/risk-management-plans/:id` - Delete risk plan

### AI Assistant
- `POST /api/assistant/chat` - Get AI compliance guidance

## 🎨 UI Components

Built with modern design system:
- **Shadcn/ui**: High-quality, accessible components
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Lucide React**: Beautiful icons
- **React Hook Form**: Form management
- **Zod**: Schema validation

## 🔒 Security Features

- Session-based authentication
- Input validation with Zod schemas
- SQL injection protection via Drizzle ORM
- XSS protection with proper content encoding
- CORS configuration for API endpoints

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
3. Deploy automatically on push

### Docker
```bash
# Build image
docker build -t compliance-navigator .

# Run container
docker run -p 5000:5000 -e DATABASE_URL=your_db_url compliance-navigator
```

### Manual Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Start with: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature-name`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation

## 🔄 Roadmap

- [ ] Multi-tenant support
- [ ] Advanced reporting and analytics
- [ ] Integration with security tools
- [ ] Mobile application
- [ ] Advanced AI features
- [ ] Compliance certification tracking

---

**Built with ❤️ for cybersecurity compliance management**
