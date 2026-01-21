# Website Management Kaos Kaki Backend (TypeScript)

## Description

Backend API for the kaos kaki website management system, built using Node.js, Express.js, and TypeScript. This application provides RESTful APIs for user authentication, master data management (such as machines, colors, sizes, and materials), and transactions related to kaos kaki products. It uses Drizzle ORM for interaction with the PostgreSQL database and is equipped with Arcjet security middleware for protection against common threats.

## Main Features

- **User Authentication**: Registration, login, and logout with JWT tokens.
- **Master Data Management**: CRUD operations for machines, colors, sizes, and materials.
- **Product Management**: Kaos Kaki product management with variations, stock tracking, and photos.
- **Order Management**: Complete order transaction management with order details and stock updates.
- **Stock Management**: Real-time stock tracking for different product variations.
- **Security**: Arcjet middleware for inspection and prevention of attacks, along with input validation.
- **Database**: Integration with PostgreSQL using Drizzle ORM with transaction support.

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

## Project Structure

```
src/
├── config/                 # Configuration files
│   ├── arcjet.ts          # Arcjet security setup
│   ├── cors.ts            # CORS configuration
│   ├── database.ts        # Database connection
│   ├── drizzle.config.ts  # Drizzle ORM config
│   └── env.ts             # Environment variables
├── controllers/           # Route controllers
│   ├── auth/              # Authentication controllers
│   ├── master/            # Master data controllers
│   └── transaction/       # Transaction controllers
├── database/              # Database utilities
│   └── drizzle.ts         # Drizzle instance
├── middlewares/           # Express middlewares
│   ├── arcjet.middleware.ts
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── models/                # Database schema
│   ├── schema.ts          # Table definitions
│   ├── relations.ts       # Table relationships
│   └── index.ts           # Schema exports
├── repositories/          # Data access layer
├── routes/                # API routes
├── service/               # Business logic
├── types/                 # TypeScript types
│   ├── api/               # API request/response types
│   ├── database/          # Database types
│   ├── middleware/        # Middleware types
│   ├── save/              # Input/output types
│   └── utils/             # Utility types
├── utils/                 # Utility functions
│   ├── audit.utils.ts
│   └── auth.utils.ts
└── index.ts               # Application entry point
```

Use the command `npm run dev` to run the server in development mode with Nodemon for auto-reload.

### API Endpoints

The application provides RESTful APIs with the base path `/api/v1`. Below are all available endpoints:

#### Authentication (`/api/v1/auth`)

- `POST /sign-up`: Register a new user.
- `POST /Sign-in`: User login (note the capital 'S').
- `POST /sign-out`: User logout (requires authorization).

#### Master Data Management

All master data endpoints require authentication (add `Authorization: Bearer <token>` header).

**Machine** (`/api/v1/machine`):

- `GET /`: Get all machines with pagination (query: `page`, `limit`).
- `POST /create`: Create new machine.
- `GET /:id`: Get specific machine details.
- `PUT /update/:id`: Update existing machine.
- `POST /delete/:id`: Delete machine (soft delete).

**Color** (`/api/v1/color`):

- `GET /`: Get all colors with pagination (query: `page`, `limit`).
- `POST /create`: Create new color.
- `GET /:id`: Get specific color details.
- `PUT /update/:id`: Update existing color.
- `POST /delete/:id`: Delete color (soft delete).

**Size** (`/api/v1/size`):

- `GET /`: Get all sizes with pagination (query: `page`, `limit`).
- `POST /create`: Create new size.
- `GET /:id`: Get specific size details.
- `PUT /update/:id`: Update existing size.
- `POST /delete/:id`: Delete size (soft delete).

**Material** (`/api/v1/material`):

- `GET /`: Get all materials with pagination (query: `page`, `limit`).
- `POST /create`: Create new material.
- `GET /:id`: Get specific material details.
- `PUT /update/:id`: Update existing material.
- `POST /delete/:id`: Delete material (soft delete).

#### Transactions

**Order** (`/api/v1/order`):

- `GET /`: Get all orders with pagination (query: `page`, `limit`).
- `GET /form/:id`: Get form data for order creation (related kaos kaki).
- `GET /form/detail/:id`: Get form detail data for order update.
- `GET /:id`: Get specific order details with related data.
- `POST /create`: Create new order.
- `PUT /update/:id`: Update existing order.
- `DELETE /delete/:id`: Delete order (soft delete).

**Kaos Kaki** (`/api/v1/kaos-kaki`):

- `GET /`: Get all kaos kaki products with pagination (query: `page`, `limit`).
- `GET /form/:select`: Get form data for kaos kaki creation (select: `machine`, `color`, `material`, `size`).
- `GET /:id`: Get specific kaos kaki details with variations and photos.
- `POST /create`: Create new kaos kaki product.
- `PUT /update/:id`: Update existing kaos kaki.
- `DELETE /delete/:id`: Delete kaos kaki (soft delete).

**Stock** (`/api/v1/stock`):

- `GET /`: Get all stock information with pagination (query: `page`, `limit`).
- `GET /form/:id`: Get form data for stock creation.
- `GET /:id`: Get specific stock details by variation.
- `POST /create`: Create new stock record.
- `PUT /update/:id`: Update existing stock.
- `DELETE /delete/:id`: Delete stock (soft delete).

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

## Recent Updates

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
