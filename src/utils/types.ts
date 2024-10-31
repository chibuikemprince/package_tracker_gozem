import { ObjectId, Types } from "mongoose";

import { Request } from "express";

enum STATUSCODE_ENUM {
  UNKNOWN_ERROR,
  FORM_REQUIREMENT_ERROR,
  PAGE_NOT_FOUND,
  RESOURCE_NOT_FOUND,
  RESOURCE_ALREADY_EXIST,
  SUCCESS,
  ORIGIN_NOT_ALLOWED,
  UNAUTHORIZED,
  FORBIDDEN,
}

export type RESPONSE_TYPE = {
  message: string;
  data: any[];
  statusCode?: STATUSCODE;
  status: number;
  pagination?: GeneralObject;
};
export type STATUSCODE = keyof typeof STATUSCODE_ENUM;

export interface MyHttpRequest extends Request {
  user_id?: ObjectId;
  user_email?: string;
  user_token?: string;
  role?: string;
}

export interface GeneralObject {
  [key: string]: any;
}

export interface PackageObject {
  active_delivery_id?: string;
  description: string;
  weight: number; // in grams
  width: number; // in cm
  height: number; // in cm
  depth: number; // in cm
  from_name: string;
  from_address: string;
  from_location: { lat: number; lng: number };
  to_name: string;
  to_address: string;
  to_location: { lat: number; lng: number };
}
export type UpdatePackageObject = Partial<PackageObject>;

export type ErrorDataType = {
  msg: string;
  file?: string;
  stack?: string;
  class?: string;
  time: string;
  user?: string;
  admin?: string;
  status: "STRONG" | "MILD" | "WEAK" | "INFO";
};

export interface ICreateDelivery {
  delivery_id: string;
  package_id: ObjectId; // Reference to my package
  pickup_time?: Date;
  start_time?: Date;
  end_time?: Date;
  location?: { lat: number; lng: number };
  status: "open" | "picked-up" | "in-transit" | "delivered" | "failed";
}
export interface IUpdateDelivery extends Partial<ICreateDelivery> {
  // No package_id in update
}
