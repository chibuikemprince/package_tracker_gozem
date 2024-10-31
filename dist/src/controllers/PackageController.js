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
exports.deletePackage = exports.getPackageById = exports.getAllPackages = exports.updatePackage = exports.createPackage = void 0;
const Package_1 = __importDefault(require("../models/Package")); // Assuming you have a Package model defined
const misc_1 = require("../utils/misc");
// Create a new package
const createPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPackage = new Package_1.default(req.body);
        yield newPackage.save();
        const resp = {
            data: [newPackage],
            message: "Package created successfully, Package ID: " + newPackage._id,
            status: 201,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
    catch (err) {
        console.log({ err });
        const resp = {
            data: [],
            message: "Internal server error",
            status: 500,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
});
exports.createPackage = createPackage;
// Update an existing package
const updatePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { package_id } = req.params;
    try {
        const updatedPackage = yield Package_1.default.findByIdAndUpdate(package_id, req.body, { new: true });
        if (!updatedPackage) {
            const resp = {
                data: [],
                message: "Package not found",
                status: 404,
            };
            return (0, misc_1.HttpResponse)(res, resp);
        }
        const resp = {
            data: [updatedPackage],
            message: "Package updated successfully",
            status: 200,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
    catch (err) {
        const resp = {
            data: [],
            message: "Internal server error",
            status: 500,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
});
exports.updatePackage = updatePackage;
// Get all packages with pagination
const getAllPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = req.body;
    let activeDeliveryId = req.body.active_delivery_set.toLowerCase() == "true";
    // console.log({ activeDeliveryId });
    let query = {};
    if (activeDeliveryId) {
        query.$and = [
            { active_delivery_id: { $exists: true } },
            { active_delivery_id: { $ne: null } }, // Not null
            { active_delivery_id: { $ne: undefined } },
        ];
    }
    else {
        query.$or = [
            { active_delivery_id: { $exists: false } },
            { active_delivery_id: null }, // Not null
            { active_delivery_id: undefined },
        ];
    }
    // console.log({ query });
    try {
        const packages = yield Package_1.default.find(query)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const totalPackages = yield Package_1.default.countDocuments();
        let resp;
        if (packages.length) {
            resp = {
                data: packages,
                message: "Packages retrieved successfully",
                status: 200,
                pagination: {
                    total: totalPackages,
                    page: Number(page),
                    limit: Number(limit),
                },
            };
        }
        else {
            resp = {
                data: packages,
                message: "Packages not found",
                status: 404,
            };
        }
        return (0, misc_1.HttpResponse)(res, resp);
    }
    catch (err) {
        const resp = {
            data: [],
            message: "Internal server error",
            status: 500,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
});
exports.getAllPackages = getAllPackages;
// Get a package by ID
const getPackageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { package_id } = req.params;
    try {
        const packageData = yield Package_1.default.findById(package_id);
        if (!packageData) {
            const resp = {
                data: [],
                message: "Package not found",
                status: 404,
            };
            return (0, misc_1.HttpResponse)(res, resp);
        }
        const resp = {
            data: [packageData],
            message: "Package retrieved successfully",
            status: 200,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
    catch (err) {
        console.log({ err });
        const resp = {
            data: [],
            message: "Internal server error",
            status: 500,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
});
exports.getPackageById = getPackageById;
// Delete a package by ID
const deletePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { package_id } = req.params;
    try {
        const deletedPackage = yield Package_1.default.findByIdAndDelete(package_id);
        if (!deletedPackage) {
            const resp = {
                data: [],
                message: "Package not found",
                status: 404,
            };
            return (0, misc_1.HttpResponse)(res, resp);
        }
        const resp = {
            data: [],
            message: "Package deleted successfully",
            status: 201,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
    catch (err) {
        const resp = {
            data: [],
            message: "Internal server error",
            status: 500,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
});
exports.deletePackage = deletePackage;
