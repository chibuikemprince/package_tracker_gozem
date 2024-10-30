import { Component, OnInit } from '@angular/core';
import { PackageService } from '../services/package.service';
import { DeliveryService } from '../services/delivery.service';
import { DeliveryDetails } from '../../models/delivery.model'; // Ensure the model is defined
import { PackageDetails } from '../../models/package.model'; // Ensure the model is defined

@Component({
  selector: 'app-web-admin-home',
  templateUrl: './web-admin-home.component.html',
  styleUrls: ['./web-admin-home.component.css'],
})

//implements OnInitss
export class WebAdminHomeComponent {
  // packages: PackageDetails[] = [];
  // deliveries: DeliveryDetails[] = [];
  // constructor(
  //   private packageService: PackageService,
  //   private deliveryService: DeliveryService
  // ) {}
  // ngOnInit(): void {
  //   this.loadPackages();
  //   this.loadDeliveries();
  // }
  // loadPackages(): void {
  //   this.packageService.getAllPackages().subscribe(
  //     (response: PackageDetails[]) => {
  //       this.packages = response;
  //     },
  //     (error: Error) => {
  //       console.error('Error fetching packages:', error);
  //     }
  //   );
  // }
  // loadDeliveries(): void {
  //   this.deliveryService.getAllDeliveries().subscribe(
  //     (response: DeliveryDetails[]) => {
  //       this.deliveries = response;
  //     },
  //     (error: Error) => {
  //       console.error('Error fetching deliveries:', error);
  //     }
  //   );
  // }
  // createPackage(): void {
  //   // Logic to navigate to create package page
  // }
  // createDelivery(): void {
  //   // Logic to navigate to create delivery page
  // }
}
