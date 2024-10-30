interface DeliveryLocation {
  lat: number;
  lng: number;
}

export interface DeliveryDetails {
  package_id: string; // Reference to the package ID
   _id: string;

  pickup_time?: Date | null; // Optional pickup time
  start_time: Date; // Required start time
  end_time?: Date | null; // Optional end time
  location: DeliveryLocation; // Required location with latitude and longitude
  status: 'open' | 'picked-up' | 'in-transit' | 'delivered' | 'failed'; // Status of the delivery
}
