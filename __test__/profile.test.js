const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const profileModel = require("../schemas/profile");

describe("E2E Testing - Profile Routes", () => {
  beforeEach(async () => {
    // Clear profiles before each test
    await profileModel.deleteMany({});
  });

  afterAll(async () => {
    // Close database connection after all tests
    await mongoose.connection.close();
  });

  describe("GET /profile", () => {
    it("should return 200 OK and fetch all profiles (empty array)", async () => {
      const response = await request(app).get("/profile");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "Profiles fetched");
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it("should return 200 OK and fetch all profiles with data", async () => {
      // Create test profiles
      await profileModel.create([
        { name: "User 1", mbti: "INTJ", enneagram: "5w4" },
        { name: "User 2", mbti: "ENFP", enneagram: "7w6" },
      ]);

      const response = await request(app).get("/profile");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "Profiles fetched");
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toHaveProperty("name");
      expect(response.body.data[0]).toHaveProperty("mbti");
    });
  });

  describe("POST /profile", () => {
    it("should create a new profile with all fields", async () => {
      const newProfile = {
        name: "Test User Complete",
        description: "A complete test user profile",
        mbti: "INTJ",
        enneagram: "5w4",
        variant: "sp/sx",
        tritype: 548,
        socionics: "ILI",
        sloan: "RCOEI",
        psyche: "LVEF",
        image: "https://example.com/image.png",
      };

      const response = await request(app)
        .post("/profile")
        .send(newProfile);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("message", "Profile created");
      expect(response.body.data).toHaveProperty("name", "Test User Complete");
      expect(response.body.data).toHaveProperty("mbti", "INTJ");
      expect(response.body.data).toHaveProperty("enneagram", "5w4");
      expect(response.body.data).toHaveProperty("variant", "sp/sx");
      expect(response.body.data).toHaveProperty("tritype", 548);
      expect(response.body.data).toHaveProperty("_id");
    });

    it("should create a new profile with only required name field", async () => {
      const newProfile = {
        name: "Minimal User",
      };

      const response = await request(app)
        .post("/profile")
        .send(newProfile);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("message", "Profile created");
      expect(response.body.data).toHaveProperty("name", "Minimal User");
      expect(response.body.data).toHaveProperty("mbti"); // Should have default
      expect(response.body.data).toHaveProperty("enneagram"); // Should have default
    });

    it("should fail to create profile without required name field", async () => {
      const invalidProfile = {
        description: "Missing name field",
        mbti: "INTJ",
      };

      const response = await request(app)
        .post("/profile")
        .send(invalidProfile);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    it("should create profile with empty description", async () => {
      const newProfile = {
        name: "User with empty description",
        description: "",
      };

      const response = await request(app)
        .post("/profile")
        .send(newProfile);

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toHaveProperty("description", "");
    });
  });

  describe("GET /profile/:id", () => {
    it("should return profile HTML template for valid ID", async () => {
      // Create a profile first
      const profile = await profileModel.create({
        name: "Test User for GET",
        mbti: "ENFJ",
        enneagram: "2w3",
      });

      const response = await request(app).get(`/profile/${profile._id}`);

      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("text/html");
      expect(response.text).toContain("Test User for GET");
    });

    it("should return 400 for invalid MongoDB ID format", async () => {
      const response = await request(app).get("/profile/invalid-id-123");

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    it("should return 404 for non-existent but valid MongoDB ID", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/profile/${fakeId}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("message", "Profile not found");
    });
  });
});
