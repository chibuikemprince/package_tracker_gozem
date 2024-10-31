"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDeliverySocket = void 0;
const socket_io_1 = require("socket.io");
const Delivery_1 = __importDefault(require("../models/Delivery"));
const setupDeliverySocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("New client connected");
        socket.on("location_changed", (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log({ data, action: "location changed" });
            const { delivery_id, location } = data;
            const updatedDelivery = yield Delivery_1.default.findOneAndUpdate({ _id: delivery_id }, { location }, { new: true });
            console.log({ updatedDelivery });
            if (updatedDelivery) {
                io.emit("location_changed", {
                    event: "location_changed",
                    delivery_object: updatedDelivery,
                });
            }
        }));
        socket.on("status_changed", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { delivery_id, status } = data;
            console.log({ data, action: "status changed" });
            const updateData = { status };
            io.emit("status_changed", {
                event: "status_changed",
                delivery_id,
                status,
            });
        }));
        socket.on("delivery_updated", (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log({ data, action: "delivery changed" });
            const { delivery_id, status } = data;
            const updateData = { status };
            io.emit("delivery_updated", {
                event: "delivery_updated",
                delivery_id,
                status,
            });
        }));
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};
exports.setupDeliverySocket = setupDeliverySocket;
