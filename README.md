# Vote System

A full-stack voting application built with **NestJS** and **Vue.js 3**. 
This application allows users to create polls, cast votes, and view real-time results.

## Key Features
- **Poll Creation**: Authorized users can create custom polls with multiple questions and answers.
- **Voting Modes**: Support for public, private, and hybrid voting modes.
- **Results Visibility**: Configurable public/private results.
- **Authentication**: JWT-based authentication with Refresh Tokens.
- **Modern UI**: Built with PrimeVue and stylized with modern CSS.
- **API Documentation**: Interactive Swagger documentation.

## Tech Stack
- **Backend**: NestJS, MongoDB (Mongoose), Passport JWT, Swagger.
- **Frontend**: Vue.js 3, Pinia (State Management), PrimeVue (UI Components), Axios.
- **Infrastructure**: Docker & Docker Compose (MongoDB).

## Prerequisites
- [Node.js](https://nodejs.org/en/download) (v18+ recommended)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop)

## Project Structure
- `api/`: NestJS backend source code.
- `web/`: Vue.js frontend source code.
- `docker-compose.yml`: Infrastructure configuration.

---

## Getting Started

### 1. Database Setup (Docker)
Start a local MongoDB instance using Docker:
```bash
docker-compose up -d
```
- **MongoDB**: `localhost:27017`
- **Mongo Express (GUI)**: `http://localhost:8081` (Login: `admin` / `pass`)

### 2. Backend Setup (API)
1. Navigate to the `api` directory and install dependencies:
   ```bash
   cd api
   ```
2. Configure environment variables:
   ```bash
   cp example.env .env
   ```
   *Update `MONGO_URL`, `JWT_SECRET`, and Mail configuration if necessary.*
3. Run the application:
   ```bash
   # Development (with watch mode)
   npm run start:dev

   # Production mode
   npm run start:prod
   ```
4. **API Documentation**:
   Once the API is running, visit: `http://localhost:3000/api/docs`

### 3. Frontend Setup (Web)
1. Navigate to the `web` directory and install dependencies:
   ```bash
   cd ../web
   npm install
   ```
2. Run the development server:
   ```bash
   npm run serve
   ```
3. Access the application at: `http://localhost:8080`

---

## Available Commands

### Backend (API)
- `npm run build`: Compile the project.
- `npm run start:dev`: Run in development mode with watch.
- `npm run test`: Run unit tests.
- `npm run test:e2e`: Run end-to-end tests.
- `npm run lint`: Lint and fix files.

### Frontend (Web)
- `npm run serve`: Compiles and hot-reloads for development.
- `npm run build`: Compiles and minifies for production.
- `npm run lint`: Lints and fixes files.

## License
UNLICENSED
