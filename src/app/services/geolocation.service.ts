import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  constructor() {}

  getLocation(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position.coords);
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
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

