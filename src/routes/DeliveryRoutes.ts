import { Router } from "express";
import {
  getAllDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  deleteDelivery,
} from "../controllers/DeliveryController";
import {
  validateCreateDelivery,
  validateUpdateDelivery,
} from "../middleware/ValidationMiddleware";

const router = Router();

router.get("/", getAllDeliveries);
router.get("/:deliveryId", getDeliveryById);
router.post("/", validateCreateDelivery, createDelivery);
router.put("/:deliveryId", validateUpdateDelivery, updateDelivery);
router.delete("/:deliveryId", deleteDelivery);

export default router;
