import http from "http";
import app from "./app";
import { env } from "./config/env";
import { ensureUploadDir } from "./utils/ensureUploadDir";

const server = http.createServer(app);

const start = async () => {
  try {
    await ensureUploadDir();
    server.listen(env.PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => {
  console.log("Received SIGINT. Shutting down gracefully.");
  server.close(() => {
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Shutting down gracefully.");
  server.close(() => {
    process.exit(0);
  });
});

start();

