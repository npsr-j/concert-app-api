# Concert App API

A NestJS-based backend API for managing concerts and reservations.

## Description

This application provides REST APIs for a concert reservation system built with [NestJS](https://github.com/nestjs/nest), TypeScript, PostgreSQL, and TypeORM.

## Features

- Admin can create and delete concerts.
- Users can view all concerts and reserve or cancel a seat (1 seat per user).
- Every reservation and cancellation will be recorded in the history log.

## Prerequisites

Before running this application locally, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for running PostgreSQL)
- [Git](https://git-scm.com/)

## Local Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd concert-app-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying from the example:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```bash
# Application
PORT=3000

# Database
POSTGRES_HOST='localhost'
POSTGRES_PORT=5432
POSTGRES_USER='your_postgres_username'
POSTGRES_PASSWORD='your_postgres_password'
POSTGRES_DATABASE='concert_app_db'
```

### 4. Start PostgreSQL Database

Use Docker Compose to run PostgreSQL:

```bash
docker-compose up -d
```

This will start a PostgreSQL container with the configuration from your `.env` file.

To verify the database is running:

```bash
docker-compose ps
```

### 5. Run the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000` (or the port specified in your `.env` file).

### 6. (Optional) Seed the Database

To populate the database with initial data:

```bash
npm run seed
```

This will create sample concerts, users, and reservations to help you get started quickly.

## Available Scripts

```bash
# Development
npm run start          # Start the application
npm run start:dev      # Start with hot-reload
npm run start:debug    # Start in debug mode

# Build
npm run build          # Build the application

# Database
npm run seed           # Seed the database with initial data

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests

# Code Quality
npm run format         # Format code with Prettier
npm run lint           # Lint and fix code with ESLint
```

## Project Structure

```
src/
├── modules/
│   ├── concert/           # Concert management
│   ├── dashboard/         # Dashboard analytics
│   ├── reservation/       # Reservation system
│   └── user/              # User management
├── seeds/                 # Database seeds
├── app.module.ts          # Root module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
└── main.ts                # Application entry point
```

## API Modules

- **Concert**: Manage concerts and their details
- **Reservation**: Handle concert reservations and booking history
- **User**: User account management
- **Dashboard**: Analytics and reporting

## Database Management

### Stop the Database

```bash
docker-compose down
```

### Stop and Remove Data

```bash
docker-compose down -v
```

### View Database Logs

```bash
docker-compose logs db
```

### Connect to PostgreSQL

```bash
docker exec -it <container-name> psql -U postgres -d concert_app_db
```

## Troubleshooting

### Port Already in Use

If port 3000 or 5432 is already in use:
1. Change the `PORT` in your `.env` file
2. Change the `POSTGRES_PORT` in your `.env` file
3. Restart the services

### Database Connection Issues

1. Ensure Docker is running
2. Verify PostgreSQL container is up: `docker-compose ps`
3. Check the logs: `docker-compose logs db`
4. Verify your `.env` credentials match the database configuration

### Module Not Found Errors

```bash
rm -rf node_modules package-lock.json
npm install
```

## Technologies Used

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Configuration**: @nestjs/config (dotenv)
- **Testing**: Jest

## License

This project is [MIT licensed](LICENSE).
