import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  requestLocation(successCallback: (latitude: number, longitude: number) => void, errorCallback: (error: GeolocationPositionError | string) => void): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          successCallback(position.coords.latitude, position.coords.longitude);
        },
        (error: GeolocationPositionError) => {
          errorCallback(error);
        }
      );
    } else {
      errorCallback('Geolocation is not supported by this browser.');
    }
  }

  // TODO: Look to see if we want to add something like this. Placelocation is imported from another TS file in the training "Angular: Progressive Web Apps". 

  // getMapLink(location: PlaceLocation) {
  //   let query = "";
  //   if (location.latitude && location.longitude) {
  //     query = `${location.latitude},${location.longitude}`;
  //   } else {
  //     query = `${location.address}, ${location.city}`;
  //   }
  //   if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
  //     return `https://maps.apple.com/?q=${query}`;
  //   } else {
  //     return `https://maps.google.com/?q=${query}`;
  //   }  
  // }

  

  constructor() { }
}
