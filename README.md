# Website Management Kaos Kaki Backend (TypeScript)

## Description

Backend API for the kaos kaki website management system, built using Node.js, Express.js, and TypeScript. This application provides RESTful APIs for user authentication, master data management (such as machines, colors, sizes, and materials), and transactions related to kaos kaki products. It uses Drizzle ORM for interaction with the PostgreSQL database and is equipped with Arcjet security middleware for protection against common threats.

## Main Features

- **User Authentication**: Registration, login, and logout with JWT tokens.
- **Master Data Management**: CRUD operations for machine, color, size, and material data.
- **Kaos Kaki Transactions**: Management of transactions related to kaos kaki products.
- **Security**: Arcjet middleware for inspection and prevention of attacks, along with input validation.
- **Database**: Integration with PostgreSQL using Drizzle ORM.

## Installation

Follow these steps to install and run the application in your local environment:

1. **Clone Repository**:

   ```bash
   git clone <repository-url>
   cd website-management-kaos-kaki-backend-ts
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment**:

   - Copy the `.env.development.local` file or create a new `.env` file.
   - Fill in the required environment variables, such as:
     - `PORT`: Server port (default: as per config/env.ts)
     - `DATABASE_URL`: PostgreSQL connection URL
     - `JWT_SECRET`: Secret key for JWT
     - Others as needed (see config/env.ts)

4. **Setup Database**:

   - Ensure PostgreSQL is installed and running.
   - Run database migrations using Drizzle Kit:
     ```bash
     npx drizzle-kit generate
     npx drizzle-kit migrate
     ```

5. **Run Application**:
   ```bash
   npm run dev
   ```
   The server will run at `http://localhost:<PORT>`.

## Usage

### Running the Server

Use the command `npm run dev` to run the server in development mode with Nodemon for auto-reload.

### API Endpoints

The application provides RESTful APIs with the base path `/api/v1`. Below are the main endpoints:

#### Authentication (`/api/v1/auth`)

- `POST /sign-up`: Register a new user.
- `POST /Sign-in`: User login (note the capital 'S').
- `POST /sign-out`: User logout (requires authorization).

#### Master Data

- `GET/POST/PUT/DELETE /api/v1/machine`: Machine data management.
- `GET/POST/PUT/DELETE /api/v1/color`: Color data management.
- `GET/POST/PUT/DELETE /api/v1/size`: Size data management.
- `GET/POST/PUT/DELETE /api/v1/material`: Material data management.

#### Transactions

- `GET/POST/PUT/DELETE /api/v1/kaos-kaki`: Kaos kaki transaction management.

### Example Request

For endpoints requiring authentication, include the header `Authorization: Bearer <token>`.

Example login:

```bash
curl -X POST http://localhost:<PORT>/api/v1/auth/Sign-in \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

## Technologies Used

- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **TypeScript**: JavaScript superset for type safety.
- **Drizzle ORM**: ORM for PostgreSQL database.
- **PostgreSQL**: Relational database.
- **JWT**: For token authentication.
- **bcryptjs**: For password hashing.
- **Arcjet**: Security middleware.
- **Nodemon**: Auto-reload during development.

## Contributing

If you want to contribute to this project:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Create a Pull Request.

## License

This project uses the ISC license.

## Author

Created by Ansori.
