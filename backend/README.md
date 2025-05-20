# H2Shop Backend API

This is the backend API for the H2Shop e-commerce system, built with Node.js and Express.js following Clean Architecture principles.

## Architecture

The backend follows a modular, clean architecture approach:

- **Entities**: Core business models
- **Use Cases**: Application business logic
- **Controllers**: Handle HTTP requests and responses
- **Repositories**: Data access layer
- **Routes**: Define API endpoints

## Project Structure

```
src/
  modules/
    user/
    product/
    order/
    recommendation/
    review/
    auth/
  middlewares/
  config/
  app.js
  server.js
```

Each module contains:
- `entities/`: Domain models
- `usecases/`: Application logic
- `repositories/`: Data access
- `controllers/`: HTTP handlers
- `routes/`: Express routes

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ fullName, email, password, phone, gender, address }`
  - Returns: User data

- `POST /api/auth/login` - Login
  - Body: `{ email, password }`
  - Returns: JWT token and user data

- `GET /api/auth/profile` - Get user profile (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Returns: User profile data

### Products (To be implemented)

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders (To be implemented)

- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Reviews (To be implemented)

- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Add product review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Recommendations (To be implemented)

- `GET /api/recommendations` - Get personalized recommendations
- `GET /api/products/:id/similar` - Get similar products

## Authentication

The API uses JWT (JSON Web Token) for authentication. Protected routes require the JWT token to be included in the Authorization header:

```
Authorization: Bearer <token>
```

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables (create a `.env` file):
   ```
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=h2shop
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3001
   ```

3. Start the server:
   ```
   npm run dev
   ```

## Development

- `npm start` - Start the server
- `npm run dev` - Start the server with nodemon for development