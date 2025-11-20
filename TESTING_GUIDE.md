# Testing Guide

## Quick Start

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run testw
```

### Run Specific Test File
```bash
npx jest __test__/profile.test.js
npx jest __test__/comment.test.js
npx jest __test__/integration.test.js
npx jest __test__/app.test.js
```

### Run Tests with Coverage
```bash
npx jest --coverage
```

## Test Structure

### Test Files Location
All test files are located in the `__test__/` directory:
- `app.test.js` - General app and health check tests
- `profile.test.js` - Profile endpoint tests
- `comment.test.js` - Comment endpoint tests
- `integration.test.js` - Full workflow integration tests

### Test File Template
```javascript
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Model = require("../schemas/model");

describe("Test Suite Name", () => {
  beforeEach(async () => {
    // Clean up data before each test
    await Model.deleteMany({});
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe("Feature Group", () => {
    it("should do something", async () => {
      const response = await request(app)
        .get("/endpoint")
        .send({ data: "value" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message");
    });
  });
});
```

## Writing New Tests

### 1. Profile Tests
```javascript
it("should create a profile", async () => {
  const response = await request(app)
    .post("/profile")
    .send({
      name: "Test User",
      mbti: "INTJ",
      enneagram: "5w4"
    });

  expect(response.statusCode).toBe(201);
  expect(response.body.data).toHaveProperty("name", "Test User");
});
```

### 2. Comment Tests
```javascript
it("should create a comment", async () => {
  // First create profiles
  const profile1 = await profileModel.create({ name: "User 1" });
  const profile2 = await profileModel.create({ name: "User 2" });

  const response = await request(app)
    .post("/comment")
    .send({
      profileId: profile1._id.toString(),
      senderId: profile2._id.toString(),
      title: "Great!",
      content: "Nice profile"
    });

  expect(response.statusCode).toBe(201);
});
```

### 3. Error Handling Tests
```javascript
it("should return 400 for invalid data", async () => {
  const response = await request(app)
    .post("/profile")
    .send({ /* missing required fields */ });

  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty("message");
});
```

## Common Test Patterns

### Testing GET Requests
```javascript
const response = await request(app).get("/endpoint");
expect(response.statusCode).toBe(200);
expect(response.body).toHaveProperty("data");
expect(Array.isArray(response.body.data)).toBe(true);
```

### Testing POST Requests
```javascript
const response = await request(app)
  .post("/endpoint")
  .send({ key: "value" });

expect(response.statusCode).toBe(201);
expect(response.body).toHaveProperty("message");
```

### Testing with MongoDB IDs
```javascript
const fakeId = new mongoose.Types.ObjectId();
const response = await request(app).get(`/profile/${fakeId}`);
expect(response.statusCode).toBe(404);
```

## Best Practices

### 1. Clean Up Data
Always clean up test data in `beforeEach` or `afterEach`:
```javascript
beforeEach(async () => {
  await profileModel.deleteMany({});
  await commentModel.deleteMany({});
});
```

### 2. Close Connections
Always close database connections in `afterAll`:
```javascript
afterAll(async () => {
  await mongoose.connection.close();
});
```

### 3. Use Descriptive Test Names
```javascript
// Good
it("should return 404 for non-existent profile ID", async () => {});

// Bad
it("test profile", async () => {});
```

### 4. Test Both Success and Failure Cases
```javascript
describe("POST /profile", () => {
  it("should create profile with valid data", async () => {});
  it("should fail with missing required fields", async () => {});
  it("should fail with invalid data types", async () => {});
});
```

### 5. Group Related Tests
```javascript
describe("Profile Routes", () => {
  describe("GET /profile", () => {
    it("should fetch all profiles", async () => {});
  });

  describe("POST /profile", () => {
    it("should create a profile", async () => {});
  });
});
```

## Debugging Tests

### Run Single Test
```bash
npx jest -t "should create a profile"
```

### Run with Verbose Output
```bash
npx jest --verbose
```

### Detect Open Handles
```bash
npx jest --detectOpenHandles
```

### Run in Debug Mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Troubleshooting

### Tests Hanging
- Check if database connections are properly closed
- Ensure all async operations are awaited
- Use `--detectOpenHandles` flag

### Database Errors
- Verify MongoDB Memory Server is installed
- Check if models are properly imported
- Ensure data is cleaned between tests

### Timeout Errors
- Increase timeout in jest.config.js
- Check for slow database operations
- Verify network requests complete

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
```

## Test Coverage

### Generate Coverage Report
```bash
npx jest --coverage
```

### Coverage Output
- Terminal summary
- HTML report in `coverage/` directory
- Open `coverage/lcov-report/index.html` in browser

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

