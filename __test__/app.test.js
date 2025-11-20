const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

describe("E2E Testing - General App Routes", () => {
  afterAll(async () => {
    // Close database connection after all tests
    await mongoose.connection.close();
  });

  describe("GET /", () => {
    it("should return 200 OK for health check", async () => {
      const response = await request(app).get("/");
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe("HELLO FROM BOO WORLD");
    });
  });

  describe("404 Error Handler", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await request(app).get("/non-existent-route");

      expect(response.statusCode).toBe(404);
    });

    it("should return 404 for non-existent POST routes", async () => {
      const response = await request(app).post("/non-existent-route");

      expect(response.statusCode).toBe(404);
    });
  });

  describe("Error Handling", () => {
    it("should handle malformed JSON in request body", async () => {
      const response = await request(app)
        .post("/profile")
        .set("Content-Type", "application/json")
        .send('{"invalid json}');

      expect(response.statusCode).toBe(500);
    });
  });
});

