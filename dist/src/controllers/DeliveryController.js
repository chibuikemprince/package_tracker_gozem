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
exports.deleteDelivery = exports.getDeliveryById = exports.getAllDeliveries = exports.updateDelivery = exports.createDelivery = void 0;
const Delivery_1 = __importDefault(require("../models/Delivery")); // Adjust the path as necessary
const Package_1 = __importDefault(require("../models/Package")); // Assuming you have a MyPackage model
const misc_1 = require("../utils/misc");
// Create Delivery
const createDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { package_id, start_time, location } = req.body;
        const myPackage = yield Package_1.default.findById(package_id);
        if (!myPackage) {
            return (0, misc_1.HttpResponse)(res, {
                data: [],
                message: "Package not found",
                status: 404,
            });
        }
        if (myPackage.active_delivery_id) {
            return (0, misc_1.HttpResponse)(res, {
                data: [],
                message: "Delivery for this package has been created",
                status: 400,
            });
        }
        const myPackageDeliveryExist = yield Delivery_1.default.findOne({ package_id });
        if (myPackageDeliveryExist) {
            const resp = {
                data: [myPackageDeliveryExist],
                message: "The delivery of the package you selected has been created, kindly delete existing delivery request to create a new one",
                status: 409,
            };
            return (0, misc_1.HttpResponse)(res, resp);
        }
        const newDelivery = new Delivery_1.default({
            package_id,
            start_time: Date.now(),
            location: location ? location : myPackage.to_location,
        });
        myPackage.active_delivery_id = newDelivery._id;
        yield newDelivery.save();
        yield myPackage.save();
        const resp = {
            data: [newDelivery],
            message: "Delivery created successfully",
            status: 201,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
    catch (error) {
        const resp = {
            data: [],
            message: "Internal server error: " + error.message,
            status: 500,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
});
exports.createDelivery = createDelivery;
// Update Delivery
const updateDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryId = req.params.deliveryId;
        const updates = req.body;
        const delivery = yield Delivery_1.default.findById(deliveryId);
        if (!delivery) {
            return (0, misc_1.HttpResponse)(res, {
                data: [],
                message: "Delivery not found",
                status: 404,
            });
        }
        // Check if package_id is being updated
        if (updates.package_id && delivery.status !== "open") {
            return (0, misc_1.HttpResponse)(res, {
                data: [],
                message: "Cannot change package_id, delivery is not open",
                status: 400,
            });
        }
        // Check if status is being updated and validate the transition
        if (updates.status) {
            if (updates.status === "picked-up" && delivery.status !== "open") {
                return (0, misc_1.HttpResponse)(res, {
                    data: [],
                    message: delivery.status === "picked-up"
                        ? "Delivery has been picked up already"
                        : "Cannot change status to picked-up, delivery status is not open",
                    status: 400,
                });
            }
            if (updates.status === "in-transit" && delivery.status !== "picked-up") {
                return (0, misc_1.HttpResponse)(res, {
                    data: [],
                    message: delivery.status === "in-transit"
                        ? "Delivery is currently in transit"
                        : "Cannot change status to in-transit, delivery is not picked-up",
                    status: 400,
                });
            }
            if ((updates.status === "delivered" || updates.status === "failed") &&
                delivery.status !== "in-transit") {
                return (0, misc_1.HttpResponse)(res, {
                    data: [],
                    message: delivery.end_time
                        ? "Delivery has been completed for this package."
                        : "Cannot change status to delivered or failed, delivery is not in-transit",
                    status: 400,
                });
            }
            if (updates.status === "picked-up") {
                updates.pickup_time = new Date(); // Update pickup time when status is changed to picked-up
            }
        }
        // Prevent updating start_time and only allow updating end_time if status is in-transit
        if (updates.start_time) {
            return (0, misc_1.HttpResponse)(res, {
                data: [],
                message: "start_time cannot be updated",
                status: 400,
            });
        }
        if ((updates.status == "failed" || updates.status == "delivered") &&
            delivery.status !== "in-transit") {
            return (0, misc_1.HttpResponse)(res, {
                data: [],
                message: "status  can only be set to delivered or failed when status is in-transit",
                status: 400,
            });
        }
        else if (updates.status == "failed" || updates.status == "delivered") {
            updates.end_time = new Date(); // Update end_time when status is changed to delivered/failed
        }
        if (updates.status === "in-transit") {
            updates.start_time = new Date();
        }
        // Update delivery
        Object.assign(delivery, updates);
        yield delivery.save();
        const resp = {
            data: [delivery],
            message: "Delivery updated successfully",
            status: 200,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
    catch (error) {
        const resp = {
            data: [],
            message: "Internal server error: " + error.message,
            status: 500,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
});
exports.updateDelivery = updateDelivery;
// Get All Deliveries with Pagination
const getAllDeliveries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 deliveries per page
        const skip = (page - 1) * limit; // Calculate the number of deliveries to skip
        const status = req.body.status;
        // Fetch deliveries with pagination
        const deliveries = yield Delivery_1.default.find()
            .populate("package_id") // Populate package_id
            .skip(skip)
            .limit(limit);
        // Count total deliveries for pagination info
        const totalDeliveries = yield Delivery_1.default.countDocuments();
        const resp = {
            data: deliveries,
            message: "Deliveries fetched successfully",
            status: 200,
        };
        if (deliveries.length > 0) {
            resp.pagination = {
                total: totalDeliveries,
                page,
                totalPages: Math.ceil(totalDeliveries / limit),
            };
        }
        else {
            resp.status = 404;
            resp.message = "No deliveries found";
        }
        return (0, misc_1.HttpResponse)(res, resp);
    }
    catch (error) {
        const resp = {
            data: [],
            message: "Internal server error: " + error.message,
            status: 500,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
});
exports.getAllDeliveries = getAllDeliveries;
// Get Delivery by ID
const getDeliveryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryId = req.params.deliveryId;
        const delivery = yield Delivery_1.default.findById(deliveryId).populate("package_id"); // Populate package_id
        if (!delivery) {
            return (0, misc_1.HttpResponse)(res, {
                data: [],
                message: "Delivery not found",
                status: 404,
            });
        }
        const resp = {
            data: [delivery],
            message: "Delivery fetched successfully",
            status: 200,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
    catch (error) {
        const resp = {
            data: [],
            message: "Internal server error: " + error.message,
            status: 500,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
});
exports.getDeliveryById = getDeliveryById;
// Delete Delivery
const deleteDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryId = req.params.deliveryId;
        const delivery = yield Delivery_1.default.findById(deliveryId);
        if (!delivery) {
            return (0, misc_1.HttpResponse)(res, {
                data: [],
                message: "Delivery not found",
                status: 404,
            });
        }
        // Check if package_id is being updated
        if (delivery.package_id &&
            delivery.status != "open" &&
            delivery.status != "failed") {
            return (0, misc_1.HttpResponse)(res, {
                data: [],
                message: "Cannot delete delivery that is not open or failed",
                status: 400,
            });
        }
        yield Delivery_1.default.findByIdAndDelete(deliveryId);
        // Update my package's active_delivery_id to null
        yield Package_1.default.findByIdAndUpdate(delivery.package_id, {
            active_delivery_id: null,
        });
        const resp = {
            data: [],
            message: "Delivery deleted successfully",
            status: 201,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
    catch (error) {
        const resp = {
            data: [],
            message: "Internal server error: " + error.message,
            status: 500,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
});
exports.deleteDelivery = deleteDelivery;
