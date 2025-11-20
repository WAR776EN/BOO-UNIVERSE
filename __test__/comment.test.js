const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const profileModel = require("../schemas/profile");
const commentModel = require("../schemas/comment");

describe("E2E Testing - Comment Routes", () => {
  let testProfile1;
  let testProfile2;

  beforeEach(async () => {
    // Clear all data before each test
    await commentModel.deleteMany({});
    await profileModel.deleteMany({});

    // Create test profiles for comments
    testProfile1 = await profileModel.create({
      name: "Profile 1",
      mbti: "INTJ",
      enneagram: "5w4",
    });

    testProfile2 = await profileModel.create({
      name: "Profile 2",
      mbti: "ENFP",
      enneagram: "7w6",
    });
  });

  afterAll(async () => {
    // Close database connection after all tests
    await mongoose.connection.close();
  });

  describe("GET /comment", () => {
    it("should return 200 OK and fetch all comments (empty array)", async () => {
      const response = await request(app).get("/comment");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "Comments fetched");
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it("should return 200 OK and fetch all comments with data", async () => {
      // Create test comments
      await commentModel.create([
        {
          profileId: testProfile1._id,
          senderId: testProfile2._id,
          title: "Great profile!",
          content: "I really like this profile",
          mbti: "INTJ",
        },
        {
          profileId: testProfile2._id,
          senderId: testProfile1._id,
          title: "Nice analysis",
          content: "Very accurate description",
          enneagram: "7w6",
        },
      ]);

      const response = await request(app).get("/comment");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "Comments fetched");
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toHaveProperty("title");
      expect(response.body.data[0]).toHaveProperty("content");
    });
  });

  describe("POST /comment", () => {
    it("should create a new comment with all fields", async () => {
      const newComment = {
        profileId: testProfile1._id.toString(),
        senderId: testProfile2._id.toString(),
        title: "Test Comment",
        content: "This is a test comment content",
        mbti: "INTJ",
        enneagram: "5w4",
        zodiac: "Scorpio",
      };

      const response = await request(app)
        .post("/comment")
        .send(newComment);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("message", "Comment created");
      expect(response.body.data).toHaveProperty("title", "Test Comment");
      expect(response.body.data).toHaveProperty("content", "This is a test comment content");
      expect(response.body.data).toHaveProperty("mbti", "INTJ");
      expect(response.body.data).toHaveProperty("enneagram", "5w4");
      expect(response.body.data).toHaveProperty("zodiac", "Scorpio");
      expect(response.body.data).toHaveProperty("_id");
    });

    it("should create a comment with only required fields", async () => {
      const newComment = {
        profileId: testProfile1._id.toString(),
        senderId: testProfile2._id.toString(),
        title: "Minimal Comment",
        content: "Minimal content",
      };

      const response = await request(app)
        .post("/comment")
        .send(newComment);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("message", "Comment created");
      expect(response.body.data).toHaveProperty("title", "Minimal Comment");
    });

    it("should fail to create comment with non-existent profileId", async () => {
      const fakeProfileId = new mongoose.Types.ObjectId();
      const newComment = {
        profileId: fakeProfileId.toString(),
        senderId: testProfile2._id.toString(),
        title: "Test Comment",
        content: "This should fail",
      };

      const response = await request(app)
        .post("/comment")
        .send(newComment);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Profile ID not found");
    });

    it("should fail to create comment with non-existent senderId", async () => {
      const fakeSenderId = new mongoose.Types.ObjectId();
      const newComment = {
        profileId: testProfile1._id.toString(),
        senderId: fakeSenderId.toString(),
        title: "Test Comment",
        content: "This should fail",
      };

      const response = await request(app)
        .post("/comment")
        .send(newComment);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message", "Sender ID not found");
    });
  });
});
