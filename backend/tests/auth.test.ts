import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Authentication API", () => {
  const email = `user-${Date.now()}@example.com`;
  const password = "super-secret-password";

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("registers a new user", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ email, password });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          email,
          createdAt: expect.any(String),
        }),
      }),
    );
  });

  it("rejects duplicate registrations", async () => {
    await request(app)
      .post("/auth/signup")
      .send({ email, password });

    const response = await request(app)
      .post("/auth/signup")
      .send({ email, password });

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/already/i);
  });

  it("logs in an existing user", async () => {
    await request(app)
      .post("/auth/signup")
      .send({ email, password });

    const response = await request(app)
      .post("/auth/login")
      .send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({ email }),
      }),
    );
  });

  it("validates request payloads", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ email: "invalid", password: "short" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });
});
