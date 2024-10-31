// routes/packageRoutes.ts
import { Router } from "express";
import {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from "../controllers/PackageController";
import {
  validateCreatePackage,
  validateUpdatePackage,
} from "../middleware/ValidationMiddleware";

const router = Router();

router.get("/", getAllPackages);
router.get("/:package_id", getPackageById);
router.post("/", validateCreatePackage, createPackage); // Apply validation middleware here
router.put("/:package_id", validateUpdatePackage, updatePackage); // Apply validation middleware here
router.delete("/:package_id", deletePackage);

export default router;
