import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DeliveryDetails } from '../../models/delivery.model'; // Define this model
import { GeneralObject, HTTPResponse } from '../../models/httpresponse.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllDeliveries(): Observable<HTTPResponse[]> {
    return this.http.get<HTTPResponse[]>(`${this.baseUrl}/delivery`);
  }

  getDeliveryDetails(deliveryId: string): Observable<HTTPResponse> {
    return this.http.get<HTTPResponse>(
      `${this.baseUrl}/delivery/${deliveryId}`
    );
  }

  createDelivery(deliveryData: any): Observable<HTTPResponse> {
    return this.http.post<HTTPResponse>(
      `${this.baseUrl}/delivery`,
      deliveryData
    );
  }

  updateDeliveryStatus(
    deliveryId: string,
    data: GeneralObject
  ): Observable<HTTPResponse> {
    return this.http.put<HTTPResponse>(
      `${this.baseUrl}/delivery/${deliveryId}`,
      data
    );
  }
}
