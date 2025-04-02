# Wanna Track API

A RESTful API for managing personal expenses and funds.

## Features

- User authentication and authorization
- CRUD operations for expenses
- CRUD operations for categories
- CRUD operations for funds
- Fund transactions tracking
- Linking expenses with funds
- Default fund support
- Fund balance management
- Fund transfers between accounts

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Costs
- `GET /api/costs` - Get all costs (with optional date range filter)
- `POST /api/cost` - Create a new cost
- `PUT /api/cost/:id` - Update a cost
- `DELETE /api/cost/:id` - Delete a cost

### Funds
- `GET /api/funds` - Get all funds
- `POST /api/funds` - Create a new fund
- `PUT /api/funds/:id` - Update a fund
- `DELETE /api/funds/:id` - Delete a fund
- `GET /api/funds/:id` - Get fund details
- `GET /api/funds/:id/transactions` - Get fund transactions
- `POST /api/funds/transfer` - Transfer money between funds

## Request/Response Examples

### Create a new cost with fund
```json
POST /api/cost
{
    "amount": 100,
    "category": "categoryId",
    "comment": "Grocery shopping",
    "userId": "userId",
    "date": "2024-03-20T10:00:00Z",
    "fund": "fundId"  // Optional: link cost to a specific fund
}
```

### Create a new fund
```json
POST /api/funds
{
    "name": "Main Account",
    "icon": "💰",
    "description": "Primary spending account",
    "initialBalance": 1000,
    "isDefault": true,
    "userId": "userId"
}
```

### Transfer between funds
```json
POST /api/funds/transfer
{
    "userId": "userId",
    "fromFundId": "sourceFundId",
    "toFundId": "targetFundId",
    "amount": 500,
    "description": "Transfer to savings"
}
```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Development

To run the server in development mode with auto-reload:
```bash
npm run dev
```

## Testing

To run tests:
```bash
npm test
```