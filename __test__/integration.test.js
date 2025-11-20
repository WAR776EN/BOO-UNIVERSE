const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const profileModel = require("../schemas/profile");
const commentModel = require("../schemas/comment");

describe("E2E Integration Testing - Full Workflow", () => {
  beforeEach(async () => {
    // Clear all data before each test
    await commentModel.deleteMany({});
    await profileModel.deleteMany({});
  });

  afterAll(async () => {
    // Close database connection after all tests
    await mongoose.connection.close();
  });

  describe("Complete Profile and Comment Workflow", () => {
    it("should create profiles, fetch them, and add comments", async () => {
      // Step 1: Create first profile
      const profile1Response = await request(app)
        .post("/profile")
        .send({
          name: "Alice Johnson",
          description: "Software Engineer",
          mbti: "INTJ",
          enneagram: "5w4",
        });

      expect(profile1Response.statusCode).toBe(201);
      const profile1Id = profile1Response.body.data._id;

      // Step 2: Create second profile
      const profile2Response = await request(app)
        .post("/profile")
        .send({
          name: "Bob Smith",
          description: "Product Manager",
          mbti: "ENFP",
          enneagram: "7w6",
        });

      expect(profile2Response.statusCode).toBe(201);
      const profile2Id = profile2Response.body.data._id;

      // Step 3: Fetch all profiles
      const profilesResponse = await request(app).get("/profile");
      expect(profilesResponse.statusCode).toBe(200);
      expect(profilesResponse.body.data.length).toBe(2);

      // Step 4: Create a comment from profile2 to profile1
      const commentResponse = await request(app)
        .post("/comment")
        .send({
          profileId: profile1Id,
          senderId: profile2Id,
          title: "Great INTJ profile!",
          content: "Very accurate description of INTJ personality",
          mbti: "INTJ",
          enneagram: "5w4",
        });

      expect(commentResponse.statusCode).toBe(201);
      expect(commentResponse.body.data).toHaveProperty("title", "Great INTJ profile!");

      // Step 5: Fetch all comments
      const commentsResponse = await request(app).get("/comment");
      expect(commentsResponse.statusCode).toBe(200);
      expect(commentsResponse.body.data.length).toBe(1);
      expect(commentsResponse.body.data[0].title).toBe("Great INTJ profile!");
    });

    it("should handle multiple comments on same profile", async () => {
      // Create profiles
      const profile1 = await request(app)
        .post("/profile")
        .send({ name: "Profile 1", mbti: "ISTJ" });
      
      const profile2 = await request(app)
        .post("/profile")
        .send({ name: "Profile 2", mbti: "ESFP" });
      
      const profile3 = await request(app)
        .post("/profile")
        .send({ name: "Profile 3", mbti: "INFP" });

      const profile1Id = profile1.body.data._id;
      const profile2Id = profile2.body.data._id;
      const profile3Id = profile3.body.data._id;

      // Create multiple comments on profile1
      await request(app)
        .post("/comment")
        .send({
          profileId: profile1Id,
          senderId: profile2Id,
          title: "Comment 1",
          content: "First comment",
        });

      await request(app)
        .post("/comment")
        .send({
          profileId: profile1Id,
          senderId: profile3Id,
          title: "Comment 2",
          content: "Second comment",
        });

      // Fetch all comments
      const commentsResponse = await request(app).get("/comment");
      expect(commentsResponse.statusCode).toBe(200);
      expect(commentsResponse.body.data.length).toBe(2);
    });

    it("should validate MBTI types in profiles", async () => {
      const validMBTIs = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", 
                          "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];

      // Test with valid MBTI
      const validResponse = await request(app)
        .post("/profile")
        .send({
          name: "Valid MBTI User",
          mbti: "INTJ",
        });

      expect(validResponse.statusCode).toBe(201);
    });

    it("should validate Enneagram types in profiles", async () => {
      const validEnneagrams = ["1w2", "2w3", "3w2", "3w4", "4w3", "4w5", 
                               "5w4", "5w6", "6w5", "6w7", "7w6", "7w8", 
                               "8w7", "8w9", "9w8", "9w1"];

      // Test with valid Enneagram
      const validResponse = await request(app)
        .post("/profile")
        .send({
          name: "Valid Enneagram User",
          enneagram: "5w4",
        });

      expect(validResponse.statusCode).toBe(201);
    });
  });
});

