export interface MyLocation {
  lat: number;
  lng: number;
}

export interface PackageDetails {
  active_delivery_id?: string;
  _id?: string;
  description: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  from_name: string;
  from_address: string;
  from_location: MyLocation;
  to_name: string;
  to_address: string;
  to_location: MyLocation;
}
