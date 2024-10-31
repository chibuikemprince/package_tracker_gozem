import { Request, Response } from "express";
import Delivery from "../models/Delivery"; // Adjust the path as necessary
import MyPackage from "../models/Package"; // Assuming you have a MyPackage model
import { HttpResponse } from "../utils/misc";
import { RESPONSE_TYPE } from "../utils/types";
import { ObjectId } from "mongoose";

// Create Delivery
export const createDelivery = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { package_id, start_time, location } = req.body;

    const myPackage = await MyPackage.findById(package_id);

    if (!myPackage) {
      return HttpResponse(res, {
        data: [],
        message: "Package not found",
        status: 404,
      });
    }

    if (myPackage.active_delivery_id) {
      return HttpResponse(res, {
        data: [],
        message: "Delivery for this package has been created",
        status: 400,
      });
    }
    const myPackageDeliveryExist = await Delivery.findOne({ package_id });

    if (myPackageDeliveryExist) {
      const resp: RESPONSE_TYPE = {
        data: [myPackageDeliveryExist],
        message:
          "The delivery of the package you selected has been created, kindly delete existing delivery request to create a new one",
        status: 409,
      };
      return HttpResponse(res, resp);
    }
    const newDelivery = new Delivery({
      package_id,
      start_time: Date.now(),
      location: location ? location : myPackage.to_location,
    });

    myPackage.active_delivery_id = newDelivery._id as string;
    await newDelivery.save();

    await myPackage.save();

    const resp: RESPONSE_TYPE = {
      data: [newDelivery],
      message: "Delivery created successfully",
      status: 201,
    };
    return HttpResponse(res, resp);
  } catch (error: any) {
    const resp: RESPONSE_TYPE = {
      data: [],
      message: "Internal server error: " + error.message,
      status: 500,
    };
    return HttpResponse(res, resp);
  }
};

// Update Delivery
export const updateDelivery = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const deliveryId = req.params.deliveryId;
    const updates = req.body;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return HttpResponse(res, {
        data: [],
        message: "Delivery not found",
        status: 404,
      });
    }

    // Check if package_id is being updated
    if (updates.package_id && delivery.status !== "open") {
      return HttpResponse(res, {
        data: [],
        message: "Cannot change package_id, delivery is not open",
        status: 400,
      });
    }

    // Check if status is being updated and validate the transition
    if (updates.status) {
      if (updates.status === "picked-up" && delivery.status !== "open") {
        return HttpResponse(res, {
          data: [],
          message:
            delivery.status === "picked-up"
              ? "Delivery has been picked up already"
              : "Cannot change status to picked-up, delivery status is not open",
          status: 400,
        });
      }
      if (updates.status === "in-transit" && delivery.status !== "picked-up") {
        return HttpResponse(res, {
          data: [],
          message:
            delivery.status === "in-transit"
              ? "Delivery is currently in transit"
              : "Cannot change status to in-transit, delivery is not picked-up",
          status: 400,
        });
      }
      if (
        (updates.status === "delivered" || updates.status === "failed") &&
        delivery.status !== "in-transit"
      ) {
        return HttpResponse(res, {
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
      return HttpResponse(res, {
        data: [],
        message: "start_time cannot be updated",
        status: 400,
      });
    }
    if (
      (updates.status == "failed" || updates.status == "delivered") &&
      delivery.status !== "in-transit"
    ) {
      return HttpResponse(res, {
        data: [],
        message:
          "status  can only be set to delivered or failed when status is in-transit",
        status: 400,
      });
    } else if (updates.status == "failed" || updates.status == "delivered") {
      updates.end_time = new Date(); // Update end_time when status is changed to delivered/failed
    }

    if (updates.status === "in-transit") {
      updates.start_time = new Date();
    }
    // Update delivery
    Object.assign(delivery, updates);
    await delivery.save();

    const resp: RESPONSE_TYPE = {
      data: [delivery],
      message: "Delivery updated successfully",
      status: 200,
    };
    return HttpResponse(res, resp);
  } catch (error: any) {
    const resp: RESPONSE_TYPE = {
      data: [],
      message: "Internal server error: " + error.message,
      status: 500,
    };
    return HttpResponse(res, resp);
  }
};

// Get All Deliveries with Pagination
export const getAllDeliveries = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 deliveries per page
    const skip = (page - 1) * limit; // Calculate the number of deliveries to skip
    const status = req.body.status;

    // Fetch deliveries with pagination
    const deliveries = await Delivery.find()
      .populate("package_id") // Populate package_id
      .skip(skip)
      .limit(limit);

    // Count total deliveries for pagination info
    const totalDeliveries = await Delivery.countDocuments();

    const resp: RESPONSE_TYPE = {
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
    } else {
      resp.status = 404;
      resp.message = "No deliveries found";
    }
    return HttpResponse(res, resp);
  } catch (error: any) {
    const resp: RESPONSE_TYPE = {
      data: [],
      message: "Internal server error: " + error.message,
      status: 500,
    };
    return HttpResponse(res, resp);
  }
};
// Get Delivery by ID
export const getDeliveryById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const deliveryId = req.params.deliveryId;
    const delivery = await Delivery.findById(deliveryId).populate("package_id"); // Populate package_id
    if (!delivery) {
      return HttpResponse(res, {
        data: [],
        message: "Delivery not found",
        status: 404,
      });
    }

    const resp: RESPONSE_TYPE = {
      data: [delivery],
      message: "Delivery fetched successfully",
      status: 200,
    };
    return HttpResponse(res, resp);
  } catch (error: any) {
    const resp: RESPONSE_TYPE = {
      data: [],
      message: "Internal server error: " + error.message,
      status: 500,
    };
    return HttpResponse(res, resp);
  }
};

// Delete Delivery
export const deleteDelivery = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const deliveryId = req.params.deliveryId;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return HttpResponse(res, {
        data: [],
        message: "Delivery not found",
        status: 404,
      });
    }

    // Check if package_id is being updated
    if (
      delivery.package_id &&
      delivery.status != "open" &&
      delivery.status != ("failed" as string)
    ) {
      return HttpResponse(res, {
        data: [],
        message: "Cannot delete delivery that is not open or failed",
        status: 400,
      });
    }

    await Delivery.findByIdAndDelete(deliveryId);

    // Update my package's active_delivery_id to null
    await MyPackage.findByIdAndUpdate(delivery.package_id, {
      active_delivery_id: null,
    });

    const resp: RESPONSE_TYPE = {
      data: [],
      message: "Delivery deleted successfully",
      status: 201,
    };
    return HttpResponse(res, resp);
  } catch (error: any) {
    const resp: RESPONSE_TYPE = {
      data: [],
      message: "Internal server error: " + error.message,
      status: 500,
    };
    return HttpResponse(res, resp);
  }
};
