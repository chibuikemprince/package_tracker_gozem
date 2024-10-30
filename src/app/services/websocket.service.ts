import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket('ws://localhost:7000'); // Adjust the WebSocket URL as needed
  }

  sendLocationUpdate(
    deliveryId: string,
    location: { lat: number; lng: number }
  ): void {
    const message = JSON.stringify({
      event: 'location_changed',
      delivery_id: deliveryId,
      location: location,
    });
    this.socket.send(message);
  }

  sendStatusUpdate(deliveryId: string, status: string): void {
    const message = JSON.stringify({
      event: 'status_changed',
      delivery_id: deliveryId,
      status: status,
    });
    this.socket.send(message);
  }
}
