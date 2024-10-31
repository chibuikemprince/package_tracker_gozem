import mongoose, { Document, Schema } from "mongoose";
import { ICreateDelivery } from "../utils/types";

interface IDelivery extends Document, ICreateDelivery {}

const DeliverySchema: Schema = new Schema({
  package_id: {
    type: Schema.Types.ObjectId,
    ref: "Packages",
    required: true,
  }, // Reference to my package
  pickup_time: { type: Date, default: null },
  start_time: { type: Date },
  end_time: { type: Date, default: null },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ["open", "picked-up", "in-transit", "delivered", "failed"],
    default: "open",
  },
});

export default mongoose.model<IDelivery>("Deliveries", DeliverySchema);
