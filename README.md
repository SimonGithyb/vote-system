# Vote System

A full-stack voting application built with **NestJS** and **Vue.js 3**. 
This application allows users to create polls, cast votes, and view real-time results.

## Key Features
- **Poll Creation**: Authorized users can create custom polls with multiple questions and answers.
- **Voting Modes**: Support for public, private, and hybrid voting modes.
- **Results Visibility**: Configurable public/private results.
- **Authentication**: JWT-based authentication with Refresh Tokens.
- **Modern UI**: Built with PrimeVue and stylized with modern CSS.

## Tech Stack
- **Backend**: NestJS, MongoDB (Mongoose), Passport JWT.
- **Frontend**: Vue.js 3, Pinia (State Management), PrimeVue (UI Components), Axios.
- **Security**: Helmet, CORS, Class-validator.

## Prerequisites
- [Node.js](https://nodejs.org/en/download) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Getting Started

### 1. Backend Setup (API)
1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `example.env` to `.env`.
   - Update `MONGO_URL`, `JWT_SECRET`, and Mail configuration.
4. Run the application:
   ```bash
   # Development mode
   npm run start:dev
   # Production mode
   npm run start:prod
   ```

### 2. Frontend Setup (Web)
1. Navigate to the `web` directory:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run serve
   ```
4. Access the application at `http://localhost:8080`.

## Project Structure
- `api/`: NestJS backend source code.
- `web/`: Vue.js frontend source code.

## License
UNLICENSED
