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
  selector: 'app-web-driver',
  // imports: [DatePipe],
  templateUrl: './web-driver.component.html',
  styleUrls: ['./web-driver.component.css'],
  providers: [PackageService, DeliveryService],
})
export class WebDriverComponent implements AfterViewInit {
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
  currentStatus: string = 'open';
  updateLocation = false;
  constructor(
    private packageService: PackageService,
    private deliveryService: DeliveryService,
    private webSocketService: WebSocketService
  ) {}
  private map!: L.Map;
  private marker!: L.Marker;
  private nomap!: L.Map;
  userCurrentLocation!: L.LatLngExpression;
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
      .bindPopup('Monitor the location of this package easily')
      .openPopup();
    const userLocation: L.LatLngExpression = [x, y];
    if (!this.marker) {
      this.marker = L.marker(userLocation).addTo(this.map);
    } else {
      this.marker.setLatLng(userLocation);
    }
    this.map.setView(userLocation, 13);

    //get usersCurrentLocation
    navigator.geolocation.getCurrentPosition((position) => {
      this.userCurrentLocation = [
        position.coords.latitude,
        position.coords.longitude,
      ];
      console.log({
        productLocation: [x, y],
        userCurrentLocation: this.userCurrentLocation,
      });
      // this.initMap(this.userCurrentLocation[0], this.userCurrentLocation[1]);
    });
  }

  trackPackage(): void {
    this.updateLocation = false;
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
                    this.currentStatus = <string>this.deliveryDetails?.status;
                    // Initialize map with package and delivery locations
                    let x: number = <number>this.deliveryDetails?.location.lat;
                    let y: number = <number>this.deliveryDetails?.location.lng;
                    setTimeout(() => {
                      this.loading = false;

                      this.initMap(x, y);
                    }, 2000);

                    if (
                      this.deliveryDetails?.status != 'delivered' &&
                      this.deliveryDetails?.status != 'failed'
                    ) {
                      this.updateLocation = true;

                      this.updateLocationEvery20Sec();
                    }
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

  updateStatus(newStatus: string): void {
    // Prepare the data to be sent to the backend

    //
    this.loading = true;

    navigator.geolocation.getCurrentPosition((position) => {
      this.userCurrentLocation = [
        position.coords.latitude,
        position.coords.longitude,
      ];

      const updateData = {
        status: newStatus,
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      };
      // Call the delivery service to update the status
      this.deliveryService
        .updateDeliveryStatus(this.deliveryId, updateData)
        .subscribe(
          (response: HTTPResponse) => {
            this.loading = false;
            let responseData = response.data[0];

            this.apimessage = response.message ? response.message : 'success.';
            if (this.deliveryDetails) {
              this.deliveryDetails.status = responseData.status;
              this.deliveryDetails.location = responseData.location;

              this.deliveryDetails.end_time =
                responseData.end_time == null
                  ? this.deliveryDetails.end_time
                  : responseData.end_time;

              this.deliveryDetails.pickup_time =
                responseData.pickup_time == null
                  ? this.deliveryDetails.pickup_time
                  : responseData.pickup_time;

              this.deliveryDetails.status = responseData.status;
              this.currentStatus = responseData.status;

              this.initMap(
                this.deliveryDetails.location.lat,
                this.deliveryDetails.location.lng
              );
            }

            this.webSocketService.sendStatusUpdate(
              this.deliveryId,
              updateData.status
            );

            if (updateData.status == 'delivered') {
              console.log({ ac: 'delivered', status: updateData.status });
              this.webSocketService.sendDeliveryChanged(
                this.deliveryId,
                updateData.status
              );
              this.updateLocationEvery20Sec();
              setTimeout(() => {
                this.updateLocation = false;
              }, 5000);
            } else {
              this.updateLocation = true;
            }

            // this.updateLocationEvery20Sec();

            // Handle successful response
            console.log('Status updated successfully:', response);
            // Optionally, you can update the UI or notify the user
          },
          (error: HTTPResponse) => {
            this.loading = false;

            // Handle error response
            console.error('Error updating status:', error);
          }
        );

      console.log({
        userCurrentLocation: this.userCurrentLocation,
      });
      // this.initMap(this.userCurrentLocation[0], this.userCurrentLocation[1]);
    });
  }

  autoHideAlert(): void {
    setTimeout(() => {
      this.apimessage = '';
    }, 5000);
  }

  updateLocationEvery20Sec(): void {
    console.log({ update: this.updateLocation, loc: navigator.geolocation });
    if (this.updateLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.userCurrentLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          let newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log({ newLocation_1: newLocation });

          this.webSocketService.sendLocationUpdate(
            this.deliveryId,
            newLocation
          );
          this.initMap(newLocation.lat, newLocation.lng);

          console.log({ action: 'set timeout done' });

          setTimeout(() => {
            this.updateLocationEvery20Sec();
          }, 20000);
        });
      }
    }
  }
}
