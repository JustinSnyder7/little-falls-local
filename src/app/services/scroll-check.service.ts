
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollCheckService {
  private hasScrolled = false;
  private widgetShownSubject = new Subject<boolean>();

  constructor() { }

  // Function to track scroll events
  trackScroll(): void {
    // !this.hasScrolled
    if (!this.hasScrolled) {
      this.hasScrolled = true;
      this.widgetShownSubject.next(true);
    } 
  }

  // Observable to subscribe to widget shown status
  widgetShown(): Observable<boolean> {
    return this.widgetShownSubject.asObservable();
  }
}
