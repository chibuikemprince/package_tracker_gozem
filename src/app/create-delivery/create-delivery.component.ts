import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../services/delivery.service';
import { PackageService } from '../services/package.service';
import { DeliveryDetails } from '../../models/delivery.model'; // Ensure the model is defined
import { PackageDetails } from '../../models/package.model'; // Ensure the model is defined

import { HTTPResponse } from '../../models/httpresponse.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-delivery',
  templateUrl: './create-delivery.component.html',
  styleUrls: ['./create-delivery.component.css'],
})
export class CreateDeliveryComponent implements OnInit {
  packages: PackageDetails[] = [];
  selectedPackage?: PackageDetails;
  alertMessage: string = '';
  loading: boolean = false;
  loadMoreVisible: boolean = true;
  currentPage: number = 1;

  constructor(
    private packageService: PackageService,
    private deliveryService: DeliveryService
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  async loadPackages(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.packageService
        .getAllPackages(this.currentPage)
        .toPromise();

      if (!response || response.data.length === 0) {
        this.loadMoreVisible = false; // Hide load more if no more packages
        return;
      }

      this.packages = [...this.packages, ...response.data].filter(
        (e) => !e.hasOwnProperty('active_delivery_id') || !e.active_delivery_id
      );
      this.currentPage++;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        this.loadMoreVisible = false; // Stop loading more if 404
      }
      console.error('Error loading packages:', error);
    } finally {
      this.loading = false;
    }
  }

  selectPackage(mypackage: PackageDetails): void {
    this.selectedPackage = mypackage;
  }

  async createDelivery(): Promise<void> {
    if (!this.selectedPackage) return;

    this.loading = true; // Show loading spinner during the request
    this.deliveryService
      .createDelivery({ package_id: this.selectedPackage._id || '' })
      .subscribe(
        (response: HTTPResponse) => {
          this.alertMessage =
            response.message || 'Delivery created successfully!';
          this.removeSelectedPackage(); // Remove the package from the list
          this.autoHideAlert();
        },
        (error: HTTPResponse) => {
          this.alertMessage = error.message || 'Error creating delivery';
          this.autoHideAlert();
        },
        () => {
          this.loading = false; // Hide loading spinner after request completes
        }
      );
  }

  removeSelectedPackage(): void {
    this.packages = this.packages.filter(
      (pkg) => pkg._id !== this.selectedPackage?._id
    );
    this.selectedPackage = undefined; // Clear the selected package
  }

  autoHideAlert(): void {
    setTimeout(() => {
      this.alertMessage = '';
    }, 5000);
  }

  loadMore(): void {
    this.loadPackages();
  }
}
