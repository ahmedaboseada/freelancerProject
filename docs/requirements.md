# Project Development Guidelines

This document provides guidelines and instructions for developing and maintaining the Freelancer Project. It's intended for advanced developers who are already familiar with Node.js, Express, and MongoDB.

## Project Structure

The project follows a microservices architecture with multiple servers:

- **authServer** (Port 5000): Handles authentication and user management
- **gatewayServer** (Port 8000): Acts as an API gateway for client requests
- **communicationServer**: Manages communication between users
- **jobServer**: Handles job listings and proposals

## Build/Configuration Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ahmedaboseada/freelancerProject.git
   cd freelancerProject
   ```

2. Install dependencies for each server:
   ```bash
   cd authServer && npm install
   cd ../gatewayServer && npm install
   cd ../communicationServer && npm install
   cd ../jobServer && npm install
   ```

3. Configure environment variables:
   - Each server has its own `.env` file with configuration
   - Copy the `.env.example` file (if available) to `.env` in each server directory
   - Update the MongoDB connection string and other settings as needed

4. Start the servers:
   - Development mode: `npm run dev` in each server directory
   - Production mode: `npm start` in each server directory

### Server Configuration

- **authServer**: Runs on port 5000 by default
- **gatewayServer**: Runs on port 8000 by default
- **communicationServer**: Configure port in .env file
- **jobServer**: Configure port in .env file

The gateway server communicates with other servers using environment variables like `AUTH_SERVER` and `JOB_SERVER`.

## Testing Information

### Test Setup

1. Jest is used as the testing framework
2. Tests are located in the `tests` directory of each server
3. Run tests with `npm test` in the server directory

### Adding New Tests

1. Create test files in the `tests` directory with the naming convention `[filename].test.js`
2. Import the module to test:
   ```javascript
   const { functionName } = require('../path/to/module');
   ```
3. Write tests using Jest's syntax:
   ```javascript
   describe('Module or function name', () => {
     test('should do something specific', () => {
       // Arrange
       // Act
       // Assert
       expect(result).toBe(expectedValue);
     });
   });
   ```

### Example Test

Here's an example test for the email validation function:

```javascript
const { checkMail } = require('../utils/checkMail');

describe('checkMail function', () => {
  test('should return DELIVERABLE for valid email format', async () => {
    const result = await checkMail('test@example.com');
    expect(result).toBe('DELIVERABLE');
  });

  test('should return UNDELIVERABLE for invalid email format', async () => {
    const result = await checkMail('invalid-email');
    expect(result).toBe('UNDELIVERABLE');
  });
});
```

### Running Tests

```bash
cd authServer
npm test
```

To run a specific test file:

```bash
npm test -- tests/checkMail.test.js
```

## Additional Development Information

### Code Style

- The project uses ESLint and Prettier for code formatting
- ESLint configuration is in `.eslintrc.json`
- Follow the Airbnb JavaScript style guide

### API Response Format

The project uses a standardized API response format:

```javascript
{
  statusCode: 200,
  success: true,
  message: "Operation successful",
  data: { ... }
}
```

Error responses follow a similar structure:

```javascript
{
  statusCode: 400,
  success: false,
  message: "Error message",
  error: { ... }
}
```

### Authentication Flow

1. Users authenticate through the gateway server
2. The gateway server communicates with the auth server
3. JWT tokens are used for authentication
4. Refresh tokens are stored in the session

### Database Models

- MongoDB is used as the database
- Mongoose is used for ODM in most servers
- Prisma is configured in the gateway server but may not be fully implemented

### Debugging

- Use the development mode (`npm run dev`) for detailed logging
- Check the server logs for error messages
- Environment variables control the logging level