// google-places.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesService {
  private apiKey = 'AIzaSyBy4aylzB5hAwmDxKo7P9zqINgYz2VmVE8';
  private endpointSearch = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
  private endpointDetails = 'https://maps.googleapis.com/maps/api/place/details/json';

  constructor(private http: HttpClient) { }

  searchPlaceByName(name: string): Observable<any> {
    const params = {
      input: name,
      inputtype: 'textquery',
      fields: 'place_id',
      key: this.apiKey
    };
    return this.http.get(this.endpointSearch, { params });
  }

  getPlaceDetails(placeId: string): Observable<any> {
    const params = {
      place_id: placeId,
      fields: 'name,rating,price_level,formatted_address',
      key: this.apiKey
    };
    return this.http.get(this.endpointDetails, { params });
  }
}
