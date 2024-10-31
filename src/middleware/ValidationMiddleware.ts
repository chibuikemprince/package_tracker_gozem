import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "../utils/misc";
import { RESPONSE_TYPE } from "../utils/types";

// Define the full Joi schema
const packageSchema = Joi.object({
  active_delivery_id: Joi.string().optional(),
  description: Joi.string().required(),
  weight: Joi.number().required(),
  width: Joi.number().required(),
  height: Joi.number().required(),
  depth: Joi.number().required(),
  from_name: Joi.string().required(),
  from_address: Joi.string().required(),
  from_location: Joi.object().required(),
  to_name: Joi.string().required(),
  to_address: Joi.string().required(),
  to_location: Joi.object().required(),
});

// Define the partial Joi schema
const partialPackageSchema = Joi.object({
  description: Joi.string().optional(),
  weight: Joi.number().optional(),
  width: Joi.number().optional(),
  height: Joi.number().optional(),
  depth: Joi.number().optional(),
  from_name: Joi.string().optional(),
  from_address: Joi.string().optional(),
  from_location: Joi.object().optional(),
  to_name: Joi.string().optional(),
  to_address: Joi.string().optional(),
  to_location: Joi.object().optional(),
});

// Validation schema for creating a delivery
export const createDeliverySchema = Joi.object({
  package_id: Joi.string().required(),

  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).optional(),
});

// Validation schema for updating a delivery
export const updateDeliverySchema = Joi.object({
  location: Joi.object({
    lat: Joi.number().optional(),
    lng: Joi.number().optional(),
  }).optional(),
  status: Joi.string()
    .valid("picked-up", "in-transit", "delivered", "failed")
    .optional(),
});

// Middleware for full validation
export const validateCreatePackage = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { error } = packageSchema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    let resp: RESPONSE_TYPE = {
      data: [],
      message: errorMessage,
      status: 400,
    };
    return HttpResponse(res, resp);
    // return res.status(400).json({ error: errorMessage });
  } else {
    next();
  }
};

// Middleware for creating a delivery validation
export const validateCreateDelivery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createDeliverySchema.validate(req.body);
  if (error) {
    console.log({ error });
    const resp: RESPONSE_TYPE = {
      data: [],
      message: error.details.map((err) => err.message).join(", "),
      status: 400,
    };
    return HttpResponse(res, resp);
  }
  next();
};

// Middleware for updating a delivery validation
export const validateUpdateDelivery = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { error } = updateDeliverySchema.validate(req.body);
  if (error) {
    const resp: RESPONSE_TYPE = {
      data: [],
      message: error.details.map((err) => err.message).join(", "),
      status: 400,
    };
    return HttpResponse(res, resp);
  }
  next();
};
// Middleware for partial validation
export const validateUpdatePackage = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { error } = partialPackageSchema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    let resp: RESPONSE_TYPE = {
      data: [],
      message: errorMessage,
      status: 400,
    };
    return HttpResponse(res, resp);
  } else {
    next();
  }
};
