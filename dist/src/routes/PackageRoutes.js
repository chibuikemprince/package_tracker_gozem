"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/packageRoutes.ts
const express_1 = require("express");
const PackageController_1 = require("../controllers/PackageController");
const ValidationMiddleware_1 = require("../middleware/ValidationMiddleware");
const router = (0, express_1.Router)();
router.get("/", PackageController_1.getAllPackages);
router.get("/:package_id", PackageController_1.getPackageById);
router.post("/", ValidationMiddleware_1.validateCreatePackage, PackageController_1.createPackage); // Apply validation middleware here
router.put("/:package_id", ValidationMiddleware_1.validateUpdatePackage, PackageController_1.updatePackage); // Apply validation middleware here
router.delete("/:package_id", PackageController_1.deletePackage);
exports.default = router;
