import mongoose, { Document, Schema } from "mongoose";
import { PackageObject } from "../utils/types";

export interface IPackage extends Document, PackageObject {}

const packageSchema: Schema = new Schema(
  {
    active_delivery_id: { type: String },
    description: { type: String, required: true },
    weight: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true },
    from_name: { type: String, required: true },
    from_address: { type: String, required: true },
    from_location: { type: Object, required: true },
    to_name: { type: String, required: true },
    to_address: { type: String, required: true },
    to_location: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPackage>("Packages", packageSchema);
