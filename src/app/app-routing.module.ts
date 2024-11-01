import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebTrackerComponent } from './web-tracker/web-tracker.component';
import { WebDriverComponent } from './web-driver/web-driver.component';
//import { WebAdminHomeComponent } from './web-admin-home/web-admin-home.component';
import { CreatePackageComponent } from './create-package/create-package.component';
import { CreateDeliveryComponent } from './create-delivery/create-delivery.component';

const routes: Routes = [
  { path: '', redirectTo: '/web-tracker', pathMatch: 'full' },
  { path: 'web-tracker', component: WebTrackerComponent },
  { path: 'web-driver', component: WebDriverComponent },
  { path: 'web-admin-home', component: CreateDeliveryComponent },
  //{ path: 'web-admin-home', component: WebAdminHomeComponent },
  { path: 'create-package', component: CreatePackageComponent },
  { path: 'create-delivery', component: CreateDeliveryComponent },
  { path: '**', component: WebTrackerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
