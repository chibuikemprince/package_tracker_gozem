import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PackageService } from '../services/package.service';
import { DeliveryService } from '../services/delivery.service'; // Import DeliveryService
import { DeliveryDetails } from '../../models/delivery.model'; // Ensure the model is defined
import { PackageDetails } from '../../models/package.model'; // Ensure the model is defined
import { HTTPResponse } from '../../models/httpresponse.model'; // Ensure the model is defined
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import * as L from 'leaflet';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-web-tracker',
  // imports: [DatePipe],
  templateUrl: './web-tracker.component.html',
  styleUrls: ['./web-tracker.component.css'],
  providers: [PackageService, DeliveryService],
})
export class WebTrackerComponent implements AfterViewInit {
  apimessage: string = '';
  APIErrors = false;
  apiLoading = false;
  packageFetched = false;
  packageId: string = '';
  deliveryId: string = '';
  isDeliveryOn = false;
  packageDetails: PackageDetails | null = null;
  deliveryDetails: DeliveryDetails | null = null;
  status = 'Pending';
  userLocation: L.LatLngExpression = [0, 0];
  loading = false;

  constructor(
    private packageService: PackageService,
    private deliveryService: DeliveryService,
    private webSocketService: WebSocketService
  ) {}
  private map!: L.Map;
  private marker!: L.Marker;
  private nomap!: L.Map;

  ngAfterViewInit(): void {}

  private initMap(x: number, y: number): void {
    if (!this.map) {
      this.map = L.map('map').setView([51.505, -0.09], 13); // Set initial coordinates and zoom level
    }
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    L.marker([51.505, -0.09])
      .addTo(this.map) // Add a marker
      .bindPopup('Monitor the location of your package easily')
      .openPopup();
    const userLocation: L.LatLngExpression = [x, y];
    if (!this.marker) {
      this.marker = L.marker(userLocation).addTo(this.map);
    } else {
      this.marker.setLatLng(userLocation);
    }
    this.map.setView(userLocation, 13);
  }

  trackPackage(): void {
    if (this.packageId.length > 0) {
      this.apiLoading = true;
      this.APIErrors = false;
      setTimeout(() => {
        this.APIErrors = false;
      }, 2000);
      try {
        this.loading = true;

        // First subscribe to get package details
        this.packageService.getPackageDetails(this.packageId).subscribe(
          (response: HTTPResponse) => {
            console.log(JSON.stringify(response));
            this.packageDetails = response.data[0];
            console.log({ package: this.packageDetails });
            this.packageFetched = true;
            this.apiLoading = false;
            this.deliveryId = <string>this.packageDetails?.active_delivery_id;

            this.webSocketService
              .getDeliveryChangedUpdates()
              .subscribe((data) => {
                console.log('Delivery changed:', data);
                if (data.delivery_id == this.deliveryId) {
                  console.log('This is my delivery status change');
                  this.apimessage =
                    'Your package has been delivered successfully';
                  setTimeout(() => {
                    this.apimessage = '';
                  }, 5000);
                }
              });

            this.webSocketService
              .getStatusChangedUpdates()
              .subscribe((data) => {
                console.log('Status changed:', data);
                if (data.delivery_id == this.deliveryId) {
                  if (data.status != 'delivered') {
                    this.apimessage =
                      'Your package delivery is currently ' + data.status;
                  }
                  setTimeout(() => {
                    this.apimessage = '';
                  }, 5000);
                  console.log('This is my delivery status change');
                }
              });

            this.webSocketService
              .getLocationChangedUpdates()
              .subscribe((data) => {
                console.log('Location changed:', data);
                if (data.delivery_object.package_id == this.packageId) {
                  console.log('This is my package.');
                  this.deliveryDetails = data.delivery_object;
                  this.deliveryId = data.delivery_object._id;

                  if (this.deliveryDetails?.status == 'open') {
                    this.isDeliveryOn = true;
                    setTimeout(() => {
                      this.initMap(
                        data.delivery_object.location.lat,
                        data.delivery_object.location.lng
                      );
                    }, 1000);
                  } else {
                    this.initMap(
                      data.delivery_object.location.lat,
                      data.delivery_object.location.lng
                    );
                  }

                  // location
                  // :
                  // {lat: 4.8472226, lng: 6.974604}
                  // package_id
                  // :
                  // "672337f7c82225621948dc29"
                  // pickup_time
                  // :
                  // "2024-10-31T09:11:22.146Z"
                  // start_time
                  // :
                  // "2024-10-31T09:00:44.126Z"
                  // status
                  // :
                  // "picked-up"
                }
              });

            if (this.packageDetails?.active_delivery_id) {
              this.isDeliveryOn = true;
            } else {
              this.map = this.nomap;
              this.isDeliveryOn = false;
            }

            if (this.isDeliveryOn) {
              // Now that we have package details, we can get delivery details
              this.deliveryService
                .getDeliveryDetails(this.deliveryId)
                .subscribe(
                  (deliveryResponse: HTTPResponse) => {
                    this.deliveryDetails = deliveryResponse.data[0];
                    // Initialize map with package and delivery locations
                    let x: number = <number>this.deliveryDetails?.location.lat;
                    let y: number = <number>this.deliveryDetails?.location.lng;
                    setTimeout(() => {
                      this.loading = false;

                      this.initMap(x, y);
                    }, 2000);
                  },
                  (deliveryError: HttpErrorResponse) => {
                    this.loading = false;

                    console.error(
                      'Error fetching delivery details:',
                      deliveryError
                    );

                    if (deliveryError.status === 404) {
                      this.apimessage =
                        'No active delivery found for this package';
                    } else {
                      this.apimessage =
                        'An error occurred while fetching package details, please ensure that your package id is correct';
                    }
                    //this.apiLoading = false;
                    //this.APIErrors = true;
                    // this.apimessage = deliveryError.message;
                  }
                );
            } else {
              this.loading = false;

              this.deliveryDetails = {
                _id: '',
                package_id: this.packageId,
                start_time: new Date(),
                status: 'open',
                location: { lat: 0, lng: 0 },
                end_time: null,
                pickup_time: null,
              };
            }
          },
          (packageError: HttpErrorResponse) => {
            this.loading = false;

            console.error('Error fetching package details:', packageError);
            if (packageError.status === 404) {
              this.apimessage = 'No package found for this package id';
            } else {
              this.apimessage =
                'An error occurred while fetching package details, please ensure that your package id is correct';
            } // Handle package error appropriately
            // this.handlePackageError(packageError);
            this.apiLoading = false;
            this.APIErrors = true;
            setTimeout(() => {
              this.APIErrors = false;
            }, 2000);
            //  this.apimessage = packageError.message;
          }
        );
      } catch (error: any) {
        this.loading = false;

        this.apiLoading = false;
        this.APIErrors = true;
        setTimeout(() => {
          this.APIErrors = false;
        }, 2000);
        this.apimessage = error.message;
      }
    }
  }
}
