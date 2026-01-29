const request = require("supertest");

// IMPORTANT: this assumes your Express app is exported from server/index.js
// If you currently do app.listen(...) in index.js, we’ll tweak that in the next step.
const app = require("../app");

describe("Auth / protected routes", () => {
  test("PUT /content/:key rejects when no token provided", async () => {
    const res = await request(app)
      .put("/content/home.hero.title")
      .send({ value: "hello" });

    expect(res.statusCode).toBe(401);
  });

  test("PUT /content/:key rejects invalid token", async () => {
    const res = await request(app)
      .put("/content/home.hero.title")
      .set("Authorization", "Bearer not-a-real-token")
      .send({ value: "hello" });

    expect([401, 403]).toContain(res.statusCode);
  });
});
