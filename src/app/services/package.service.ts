import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PackageDetails } from '../../models/package.model'; // Define this model
import { HTTPResponse } from '../../models/httpresponse.model';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllPackages(page: number): Observable<HTTPResponse> {
    return this.http.get<HTTPResponse>(`${this.baseUrl}/package?page=${page}`);
  }

  getPackageDetails(packageId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/package/${packageId}`);
  }

  createPackage(packageData: PackageDetails): Observable<HTTPResponse> {
    return this.http.post<HTTPResponse>(`${this.baseUrl}/package`, packageData);
  }
}
