import { Component, OnInit } from '@angular/core';
import { PackageService } from '../services/package.service';
import { MyLocation, PackageDetails } from '../../models/package.model'; // Ensure the model is defined
import { HTTPResponse } from '../../models/httpresponse.model';
import * as L from 'leaflet'; // Import Leaflet for map functionality
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.css'],
})
export class CreatePackageComponent implements OnInit {
  description: string = '';
  weight: number = 0;
  width: number = 0;
  height: number = 0;
  depth: number = 0;
  from_name: string = '';
  from_address: string = '';
  from_location: MyLocation = { lat: 0, lng: 0 };
  to_name: string = '';
  to_address: string = '';
  to_location: MyLocation = { lat: 0, lng: 0 };
  loading = true;
  package!: PackageDetails;
  alertMessage: string = '';
  showAlert: boolean = false;
  showMap: boolean = false; // Control map visibility
  map: any; // Leaflet map instance
  marker: any;

  userLocation: L.LatLngExpression = [0, 0]; // Default user location

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    this.requestLocationPermission();
  }

  requestLocationPermission(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.from_location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.userLocation = [this.from_location.lat, this.from_location.lng];

          setTimeout(() => {
            this.initializeMap();
            this.loading = false;
          }, 2000);
        },
        (error) => {
          console.error('Error obtaining location', error);
          this.showAlert = true;
          this.alertMessage =
            'Location permission denied. Form will not work as expected.';

          this.autoHideAlert();
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.showAlert = true;
      this.alertMessage = 'Geolocation is not supported by this browser.';
    }
  }

  initializeMap(): void {
    console.log({ userLocation: this.userLocation });
    this.map = L.map('map').setView(this.userLocation, 13); // Set initial coordinates and zoom level

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.marker = L.marker(this.userLocation)
      .addTo(this.map)
      .bindPopup('Choose delivery location')
      .openPopup();

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.to_location = { lat, lng }; // Update to_location on map click
      this.marker.setLatLng(e.latlng); // Move marker to clicked location
      this.map.setView(e.latlng, 13); // Center map on clicked location
    });
  }

  onSubmit(): void {
    this.showAlert = false;
    this.loading = true;

    this.package = {
      description: this.description,
      weight: this.weight,
      width: this.width,
      height: this.height,
      depth: this.depth,
      from_name: this.from_name,
      from_address: this.from_address,
      from_location: this.from_location,
      to_name: this.to_name,
      to_address: this.to_address,
      to_location: this.to_location,
    };

    if (this.to_location.lat == 0 && this.to_location.lng == 0) {
      this.alertMessage = 'Mark the delivery location on the map';
      this.loading = false;

      this.showAlert = true;
      return;
    } else {
      console.log({ package_to_submit: this.package });
      this.packageService.createPackage(this.package).subscribe(
        (response: HTTPResponse) => {
          this.loading = false;

          console.log({ response });
          this.alertMessage =
            'Package created successfully!  Package ID - ' +
            response.data[0]._id;
          this.showAlert = true;
          // this.resetForm();
          //this.autoHideAlert();
        },
        (error: HttpErrorResponse) => {
          this.loading = false;

          this.alertMessage =
            error.error.message ||
            'Error occurred while creating package, please try again.';
          this.showAlert = true;
          this.autoHideAlert();
        }
      );
    }
  }

  resetForm(): void {
    this.description = '';
    this.weight = 0;
    this.width = 0;
    this.height = 0;
    this.depth = 0;
    this.from_name = '';
    this.from_address = '';
    // this.from_location = { lat: 0, lng: 0 };
    this.to_name = '';
    this.to_address = '';
    this.to_location = { lat: 0, lng: 0 };
  }

  autoHideAlert(): void {
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}
