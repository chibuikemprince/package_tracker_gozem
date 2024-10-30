import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../services/delivery.service';
import { WebSocketService } from '../services/websocket.service';
import { DeliveryDetails } from '../../models/delivery.model'; // Ensure the model is defined

@Component({
  selector: 'app-web-driver',
  templateUrl: './web-driver.component.html',
  styleUrls: ['./web-driver.component.css'],
})

//implements OnInit
export class WebDriverComponent {
  // deliveryId: string = '';
  // packageDetails: any; // Define the type based on your model
  // deliveryDetails: DeliveryDetails | null = null;
  // status: string = '';
  // constructor(
  //   private deliveryService: DeliveryService,
  //   private webSocketService: WebSocketService
  // ) {}
  // ngOnInit(): void {
  //   setInterval(() => {
  //     this.updateLocation();
  //   }, 20000);
  // }
  // loadDelivery(): void {
  //   this.deliveryService.getDeliveryDetails(this.deliveryId).subscribe(
  //     (response: DeliveryDetails) => {
  //       this.deliveryDetails = response;
  //       // Fetch package details and initialize map
  //     },
  //     (error: Error) => {
  //       console.error('Error fetching delivery details:', error);
  //     }
  //   );
  // }
  // updateLocation(): void {
  //   navigator.geolocation.getCurrentPosition(
  //     (position: GeolocationPosition) => {
  //       const location = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       };
  //       this.webSocketService.sendLocationUpdate(this.deliveryId, location);
  //     }
  //   );
  // }
  // updateStatus(status: string): void {
  //   this.deliveryService
  //     .updateDeliveryStatus(this.deliveryId, status)
  //     .subscribe(
  //       () => {
  //         this.webSocketService.sendStatusUpdate(this.deliveryId, status);
  //       },
  //       (error: Error) => {
  //         console.error('Error updating delivery status:', error);
  //       }
  //     );
  // }
}
