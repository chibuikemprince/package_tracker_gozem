import { Request, Response } from "express";
import mongoose from "mongoose";
import Package from "../models/Package"; // Assuming you have a Package model defined
import { HttpResponse } from "../utils/misc";
import { RESPONSE_TYPE, GeneralObject } from "../utils/types";

// Create a new package
export const createPackage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const newPackage = new Package(req.body);
    await newPackage.save();
    const resp: RESPONSE_TYPE = {
      data: [newPackage],
      message: "Package created successfully, Package ID: " + newPackage._id,
      status: 201,
    };
    return HttpResponse(res, resp);
  } catch (err) {
    console.log({ err });
    const resp: RESPONSE_TYPE = {
      data: [],
      message: "Internal server error",
      status: 500,
    };
    return HttpResponse(res, resp);
  }
};

// Update an existing package
export const updatePackage = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { package_id } = req.params;

  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      package_id,
      req.body,
      { new: true }
    );
    if (!updatedPackage) {
      const resp: RESPONSE_TYPE = {
        data: [],
        message: "Package not found",
        status: 404,
      };
      return HttpResponse(res, resp);
    }

    const resp: RESPONSE_TYPE = {
      data: [updatedPackage],
      message: "Package updated successfully",
      status: 200,
    };
    return HttpResponse(res, resp);
  } catch (err) {
    const resp: RESPONSE_TYPE = {
      data: [],
      message: "Internal server error",
      status: 500,
    };
    return HttpResponse(res, resp);
  }
};

// Get all packages with pagination
export const getAllPackages = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { page = 1, limit = 10 } = req.body;
  let activeDeliveryId = req.body.active_delivery_set?.toLowerCase() == "true";

  // console.log({ activeDeliveryId });
  let query: GeneralObject = {};
  if (activeDeliveryId) {
    query.$and = [
      { active_delivery_id: { $exists: true } },
      { active_delivery_id: { $ne: null } }, // Not null
      { active_delivery_id: { $ne: undefined } },
    ];
  } else {
    query.$or = [
      { active_delivery_id: { $exists: false } },
      { active_delivery_id: null }, // Not null
      { active_delivery_id: undefined },
    ];
  }
  // console.log({ query });

  try {
    const packages = await Package.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const totalPackages = await Package.countDocuments();
    let resp: RESPONSE_TYPE;
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
    } else {
      resp = {
        data: packages,
        message: "Packages not found",
        status: 404,
      };
    }
    return HttpResponse(res, resp);
  } catch (err) {
    const resp: RESPONSE_TYPE = {
      data: [],
      message: "Internal server error",
      status: 500,
    };
    return HttpResponse(res, resp);
  }
};
// Get a package by ID
export const getPackageById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { package_id } = req.params;

  try {
    const packageData = await Package.findById(package_id);
    if (!packageData) {
      const resp: RESPONSE_TYPE = {
        data: [],
        message: "Package not found",
        status: 404,
      };
      return HttpResponse(res, resp);
    }

    const resp: RESPONSE_TYPE = {
      data: [packageData],
      message: "Package retrieved successfully",
      status: 200,
    };
    return HttpResponse(res, resp);
  } catch (err) {
    console.log({ err });
    const resp: RESPONSE_TYPE = {
      data: [],
      message: "Internal server error",
      status: 500,
    };
    return HttpResponse(res, resp);
  }
};

// Delete a package by ID
export const deletePackage = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { package_id } = req.params;

  try {
    const deletedPackage = await Package.findByIdAndDelete(package_id);
    if (!deletedPackage) {
      const resp: RESPONSE_TYPE = {
        data: [],
        message: "Package not found",
        status: 404,
      };
      return HttpResponse(res, resp);
    }

    const resp: RESPONSE_TYPE = {
      data: [],
      message: "Package deleted successfully",
      status: 201,
    };
    return HttpResponse(res, resp);
  } catch (err) {
    const resp: RESPONSE_TYPE = {
      data: [],
      message: "Internal server error",
      status: 500,
    };
    return HttpResponse(res, resp);
  }
};
