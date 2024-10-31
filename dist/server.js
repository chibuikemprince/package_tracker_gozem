"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const PackageRoutes_1 = __importDefault(require("./src/routes/PackageRoutes"));
const DeliveryRoutes_1 = __importDefault(require("./src/routes/DeliveryRoutes"));
const DeliverySocket_1 = require("./src/sockets/DeliverySocket");
const dotenv_1 = __importDefault(require("dotenv"));
const ErrorHandler_1 = require("./src/middleware/ErrorHandler");
const misc_1 = require("./src/utils/misc");
const HttpPipe_1 = require("./src/middleware/HttpPipe");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 7000;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// run some misc operations to transform req object
(0, HttpPipe_1.HttpPipe)(app);
// Routes
app.use("/api/package", PackageRoutes_1.default);
app.use("/api/delivery", DeliveryRoutes_1.default);
app.use(ErrorHandler_1.errorHandler);
process.on("uncaughtException", (err) => {
    //
    let error = {
        msg: "uncaughtException error found",
        stack: err.stack,
        status: "STRONG",
        time: new Date().toDateString(),
    };
    (0, misc_1.LogError)(error);
});
const DB_URL = process.env.MONGO_DB;
// Connect to MongoDB
mongoose_1.default
    .connect(DB_URL || "")
    .then((sucess) => {
    // Start the server
    console.log({ DB_URL });
    (0, DeliverySocket_1.setupDeliverySocket)(server);
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    // Set up WebSocket
})
    .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
});
