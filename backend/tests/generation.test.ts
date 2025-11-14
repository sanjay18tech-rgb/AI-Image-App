import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";

const createTestImageBuffer = () =>
  Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==", "base64");

const signUpAndLogin = async () => {
  const email = `generator-${Date.now()}@example.com`;
  const password = "secure-password";

  await request(app).post("/auth/signup").send({ email, password });
  const loginResponse = await request(app).post("/auth/login").send({ email, password });
  return { token: loginResponse.body.token as string };
};

describe("Generations API", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a generation and returns it in history", async () => {
    const { token } = await signUpAndLogin();
    const pngBuffer = createTestImageBuffer();

    const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.95);

    const createResponse = await request(app)
      .post("/generations")
      .set("Authorization", `Bearer ${token}`)
      .field("prompt", "A futuristic streetwear outfit")
      .field("style", "Streetwear")
      .attach("image", pngBuffer, {
        filename: "reference.png",
        contentType: "image/png",
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        prompt: expect.any(String),
        style: "Streetwear",
        imageUrl: expect.stringMatching(/^\/uploads\//),
        createdAt: expect.any(String),
        status: "completed",
      }),
    );

    const historyResponse = await request(app)
      .get("/generations")
      .query({ limit: 5 })
      .set("Authorization", `Bearer ${token}`);

    expect(historyResponse.status).toBe(200);
    expect(historyResponse.body.data).toHaveLength(1);
    expect(historyResponse.body.data[0]).toEqual(
      expect.objectContaining({
        prompt: "A futuristic streetwear outfit",
        style: "Streetwear",
      }),
    );

    randomSpy.mockRestore();
  });

  it("surfaces model overload errors with friendly message", async () => {
    const { token } = await signUpAndLogin();
    const pngBuffer = createTestImageBuffer();
    const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.01);

    const response = await request(app)
      .post("/generations")
      .set("Authorization", `Bearer ${token}`)
      .field("prompt", "An editorial runway look")
      .field("style", "Runway")
      .attach("image", pngBuffer, {
        filename: "reference.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(503);
    expect(response.body.message).toBe("Model overloaded");

    randomSpy.mockRestore();
  });

  it("requires authentication", async () => {
    const pngBuffer = createTestImageBuffer();
    const response = await request(app)
      .post("/generations")
      .field("prompt", "Unauthorized attempt")
      .field("style", "Editorial")
      .attach("image", pngBuffer, {
        filename: "reference.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/unauthorized/i);
  });
});
