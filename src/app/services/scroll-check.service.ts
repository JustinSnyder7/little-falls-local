
import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollCheckService {
  private widgetShownSubject = new Subject<boolean>();

  constructor() {
    this.initWidgetTimer();
  }

  private initWidgetTimer(): void {
    // Show the widget after a 1-minute delay
    timer(35000).subscribe(() => {
      const bmcMessageDiv = document.querySelector('#bmc-wbtn + div');
        if (bmcMessageDiv) {
          bmcMessageDiv.classList.add('show');
        }

      const coffeeBTN = document.querySelector('#bmc-wbtn');
        if (coffeeBTN) {
          coffeeBTN.classList.add('flash');
        }  

      this.widgetShownSubject.next(true);
      console.log('showing widget text after 15 second timer')
    });

    timer(42000).subscribe(() => {
      const bmcMessageDiv = document.querySelector('#bmc-wbtn + div');
        if (bmcMessageDiv) {
          bmcMessageDiv.classList.add('hide');
        }

      this.widgetShownSubject.next(true);
      console.log('hiding widget text after 20 past first timer')
    });
  }

  widgetShown(): Observable<boolean> {
    return this.widgetShownSubject.asObservable();
  }
}
