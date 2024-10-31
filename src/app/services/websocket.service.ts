import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;
  private deliveryChangedSubject = new Subject<any>();
  private statusChangedSubject = new Subject<any>();
  private locationChangedSubject = new Subject<any>();
  private WsUrl = environment.WsUrl;
  constructor() {
    this.socket = io(this.WsUrl); // Adjust the Socket.IO server URL as needed

    // Listen for delivery_changed events from the server
    this.socket.on('delivery_changed', (data) => {
      this.deliveryChangedSubject.next(data);
    });

    // Listen for delivery_changed events from the server
    this.socket.on('status_changed', (data) => {
      this.statusChangedSubject.next(data);
    });

    // Listen for delivery_changed events from the server
    this.socket.on('location_changed', (data) => {
      this.locationChangedSubject.next(data);
    });
  }

  sendLocationUpdate(
    deliveryId: string,
    location: { lat: number; lng: number }
  ): void {
    this.socket.emit('location_changed', {
      delivery_id: deliveryId,
      location: location,
    });
  }

  sendStatusUpdate(deliveryId: string, status: string): void {
    this.socket.emit('status_changed', {
      delivery_id: deliveryId,
      status: status,
    });
  }

  // Method to send delivery changed event
  sendDeliveryChanged(deliveryId: string, status: string): void {
    this.socket.emit('delivery_updated', {
      delivery_id: deliveryId,
      status: status,
    });
  }

  // Method to get delivery changed updates as an observable
  getDeliveryChangedUpdates() {
    return this.deliveryChangedSubject.asObservable();
  }

  getStatusChangedUpdates() {
    return this.statusChangedSubject.asObservable();
  }

  getLocationChangedUpdates() {
    return this.locationChangedSubject.asObservable();
  }
}
