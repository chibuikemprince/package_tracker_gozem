import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module'; // Import your routing module if you have one
import { AppComponent } from './app.component'; // Main application component
import { PackageService } from './services/package.service'; // Import PackageService
import { DeliveryService } from './services/delivery.service'; // Import DeliveryService
import { WebSocketService } from './services/websocket.service'; // Import WebSocketService
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule

import { CreateDeliveryComponent } from './create-delivery/create-delivery.component';
import { CreatePackageComponent } from './create-package/create-package.component';
import { WebAdminHomeComponent } from './web-admin-home/web-admin-home.component';
import { WebDriverComponent } from './web-driver/web-driver.component';
import { WebTrackerComponent } from './web-tracker/web-tracker.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    WebTrackerComponent,
    CreatePackageComponent,
    CreateDeliveryComponent,
    WebAdminHomeComponent,
    WebDriverComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [
    PackageService,
    DeliveryService,
    WebSocketService,
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent], // Bootstrap the main application component
})
export class AppModule {}
