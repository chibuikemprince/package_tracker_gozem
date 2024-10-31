// server.ts
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import packageRoutes from "./src/routes/PackageRoutes";
import deliveryRoutes from "./src/routes/DeliveryRoutes";
import { setupDeliverySocket } from "./src/sockets/DeliverySocket";
import dotenv from "dotenv";
import { errorHandler } from "./src/middleware/ErrorHandler";
import { ErrorDataType } from "./src/utils/types";
import { LogError } from "./src/utils/misc";
import { HttpPipe } from "./src/middleware/HttpPipe";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// run some misc operations to transform req object
HttpPipe(app);

// Routes
app.use("/api/package", packageRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use(errorHandler);

process.on("uncaughtException", (err: Error) => {
  //
  let error: ErrorDataType = {
    msg: "uncaughtException error found",
    stack: err.stack,
    status: "STRONG",
    time: new Date().toDateString(),
  };
  LogError(error);
});

const DB_URL = process.env.MONGO_DB;
// Connect to MongoDB
mongoose
  .connect(DB_URL || "")
  .then((sucess: any) => {
    // Start the server
    console.log({ DB_URL });
    setupDeliverySocket(server);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Set up WebSocket
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
