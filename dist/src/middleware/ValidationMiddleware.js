"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdatePackage = exports.validateUpdateDelivery = exports.validateCreateDelivery = exports.validateCreatePackage = exports.updateDeliverySchema = exports.createDeliverySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const misc_1 = require("../utils/misc");
// Define the full Joi schema
const packageSchema = joi_1.default.object({
    active_delivery_id: joi_1.default.string().optional(),
    description: joi_1.default.string().required(),
    weight: joi_1.default.number().required(),
    width: joi_1.default.number().required(),
    height: joi_1.default.number().required(),
    depth: joi_1.default.number().required(),
    from_name: joi_1.default.string().required(),
    from_address: joi_1.default.string().required(),
    from_location: joi_1.default.object().required(),
    to_name: joi_1.default.string().required(),
    to_address: joi_1.default.string().required(),
    to_location: joi_1.default.object().required(),
});
// Define the partial Joi schema
const partialPackageSchema = joi_1.default.object({
    description: joi_1.default.string().optional(),
    weight: joi_1.default.number().optional(),
    width: joi_1.default.number().optional(),
    height: joi_1.default.number().optional(),
    depth: joi_1.default.number().optional(),
    from_name: joi_1.default.string().optional(),
    from_address: joi_1.default.string().optional(),
    from_location: joi_1.default.object().optional(),
    to_name: joi_1.default.string().optional(),
    to_address: joi_1.default.string().optional(),
    to_location: joi_1.default.object().optional(),
});
// Validation schema for creating a delivery
exports.createDeliverySchema = joi_1.default.object({
    package_id: joi_1.default.string().required(),
    location: joi_1.default.object({
        lat: joi_1.default.number().required(),
        lng: joi_1.default.number().required(),
    }).optional(),
});
// Validation schema for updating a delivery
exports.updateDeliverySchema = joi_1.default.object({
    location: joi_1.default.object({
        lat: joi_1.default.number().optional(),
        lng: joi_1.default.number().optional(),
    }).optional(),
    status: joi_1.default.string()
        .valid("picked-up", "in-transit", "delivered", "failed")
        .optional(),
});
// Middleware for full validation
const validateCreatePackage = (req, res, next) => {
    const { error } = packageSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(", ");
        let resp = {
            data: [],
            message: errorMessage,
            status: 400,
        };
        return (0, misc_1.HttpResponse)(res, resp);
        // return res.status(400).json({ error: errorMessage });
    }
    else {
        next();
    }
};
exports.validateCreatePackage = validateCreatePackage;
// Middleware for creating a delivery validation
const validateCreateDelivery = (req, res, next) => {
    const { error } = exports.createDeliverySchema.validate(req.body);
    if (error) {
        console.log({ error });
        const resp = {
            data: [],
            message: error.details.map((err) => err.message).join(", "),
            status: 400,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
    next();
};
exports.validateCreateDelivery = validateCreateDelivery;
// Middleware for updating a delivery validation
const validateUpdateDelivery = (req, res, next) => {
    const { error } = exports.updateDeliverySchema.validate(req.body);
    if (error) {
        const resp = {
            data: [],
            message: error.details.map((err) => err.message).join(", "),
            status: 400,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
    next();
};
exports.validateUpdateDelivery = validateUpdateDelivery;
// Middleware for partial validation
const validateUpdatePackage = (req, res, next) => {
    const { error } = partialPackageSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(", ");
        let resp = {
            data: [],
            message: errorMessage,
            status: 400,
        };
        return (0, misc_1.HttpResponse)(res, resp);
    }
    else {
        next();
    }
};
exports.validateUpdatePackage = validateUpdatePackage;
