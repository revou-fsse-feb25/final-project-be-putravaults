# 🎵 Concerto Backend

A robust and scalable backend API for a concert ticket booking system built with NestJS, Prisma, and PostgreSQL.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Concerto Backend is a comprehensive REST API designed to handle concert ticket booking operations. It provides secure authentication, event management, ticket reservation, and booking functionality with role-based access control.

### Key Capabilities

- **User Management**: Registration, authentication, and role-based access control
- **Event Management**: CRUD operations for concert events with image support
- **Ticket System**: Multi-class ticket management with real-time availability
- **Booking System**: Secure ticket reservation and booking confirmation
- **Admin Dashboard**: Administrative tools for event and user management

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (USER, ADMIN, MODERATOR)
- Secure password hashing with bcrypt
- Protected routes with guards

### 🎫 Event Management
- Create, read, update, and delete events
- Support for multiple event images with ordering
- Thumbnail and banner image support
- Event date validation and scheduling

### 🎟️ Ticket System
- Multiple ticket classes per event (VIP, Premium, General, etc.)
- Real-time ticket availability tracking
- Seat number assignment (optional)
- Ticket reservation with expiration (15-minute window)
- Automatic cleanup of expired reservations

### 📅 Booking System
- Secure ticket booking with user validation
- Booking status management (PENDING, CONFIRMED, CANCELLED)
- Total amount calculation
- Booking history and user-specific bookings

### 🛡️ Security Features
- Input validation with class-validator
- Global exception handling
- CORS configuration
- Rate limiting support (configurable)
- SQL injection prevention with Prisma ORM

## 🛠️ Tech Stack

### Core Framework
- **NestJS** - Progressive Node.js framework for building scalable server-side applications
- **TypeScript** - Type-safe JavaScript development

### Database & ORM
- **PostgreSQL** - Robust, open-source relational database
- **Prisma** - Next-generation ORM with type safety and auto-generated queries

### Authentication & Security
- **JWT** - JSON Web Tokens for stateless authentication
- **bcrypt** - Password hashing and verification
- **class-validator** - Decorator-based validation

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **SWC** - Fast TypeScript/JavaScript compiler

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (recommended)
- **PostgreSQL** (v12 or higher)
- **Git**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd concerto-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/concerto_db"

# JWT Configuration
jwtSecretKey="your-super-secret-jwt-key-here"
refreshSecretKey="your-super-secret-refresh-key-here"

# Application Configuration
PORT=8000
NODE_ENV=development

# Optional: Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### Environment Variables Explained

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `jwtSecretKey` | Secret key for JWT token signing | Yes | - |
| `refreshSecretKey` | Secret key for refresh token signing | Yes | - |
| `PORT` | Application port | No | 8000 |
| `NODE_ENV` | Environment mode | No | development |

## 🗄️ Database Setup

1. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE concerto_db;
   ```

2. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

3. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

4. **Reset database (if needed)**
   ```bash
   npm run db:reset
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

The application will be available at `http://localhost:8000`

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Quick Start Examples

#### 1. Register a new user
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

#### 2. Login and get JWT token
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

#### 3. Get upcoming events (public)
```bash
curl -X GET http://localhost:8000/event/upcoming
```

#### 4. Get event details with ticket classes
```bash
curl -X GET http://localhost:8000/event/1
curl -X GET http://localhost:8000/event/1/ticket-classes
```

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── guards/          # JWT and role guards
│   └── dtos/           # Authentication DTOs
├── user/                # User management module
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── dtos/
├── event/               # Event management module
│   ├── event.controller.ts
│   ├── event.service.ts
│   └── dtos/
├── ticket/              # Ticket management module
│   ├── ticket.controller.ts
│   ├── ticket.service.ts
│   └── dtos/
├── booking/             # Booking management module
│   ├── booking.controller.ts
│   ├── booking.service.ts
│   └── dtos/
├── common/              # Shared utilities
│   ├── filters/        # Exception filters
│   └── decorators/     # Custom decorators
├── utils/               # Utility functions
│   ├── mappers/        # Data mappers
│   └── interceptors/   # Response interceptors
└── main.ts             # Application entry point
```

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:cov
```

### Run end-to-end tests
```bash
npm run test:e2e
```

### Test Structure
- **Unit Tests**: `*.spec.ts` files alongside source files
- **E2E Tests**: Located in `test/` directory
- **Test Coverage**: Generated in `coverage/` directory

## 📝 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Follow NestJS conventions

### API Design Principles
- RESTful API design
- Consistent error handling
- Input validation on all endpoints
- Proper HTTP status codes
- Comprehensive API documentation

### Database Guidelines
- Use Prisma migrations for schema changes
- Write database seeds for test data
- Follow naming conventions
- Implement proper relationships

### Security Best Practices
- Validate all inputs
- Use parameterized queries (Prisma handles this)
- Implement proper authentication
- Use environment variables for secrets
- Regular dependency updates

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL="postgresql://..."
jwtSecretKey="production-secret-key"
refreshSecretKey="production-refresh-key"
PORT=8000
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["npm", "run", "start:prod"]
```

### Deployment Checklist
- [ ] Set production environment variables
- [ ] Configure database connection
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass
- Provide clear commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [API Documentation](./API_DOCUMENTATION.md)
2. Review existing issues in the repository
3. Create a new issue with detailed information
4. Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- Authentication and authorization
- Event management
- Ticket system
- Booking system
- Admin dashboard

---

**Built with ❤️ using NestJS and Prisma**

*Last updated: January 2025*
