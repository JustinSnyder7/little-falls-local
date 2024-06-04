import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private overlayState = new BehaviorSubject<{isActive: boolean, imageUrl: string}>({isActive: false, imageUrl: ''});
  overlayState$ = this.overlayState.asObservable();

  openOverlay(imageUrl: string) {
    this.overlayState.next({isActive: true, imageUrl});
  }

  closeOverlay() {
    this.overlayState.next({isActive: false, imageUrl: ''});
  }
}
