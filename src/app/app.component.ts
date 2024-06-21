
import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScrollCheckService } from './services/scroll-check.service';
import { GeolocationService } from './services/geolocation.service';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { OverlayService } from './services/overlay.service';

library.add(faTimes);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showWidget: boolean = false;

  title = 'LittleFallsLocal.com';

  showFilters: boolean = false;
  isSmallScreen: boolean = false;

  isOverlayActive: boolean = false;
  activeImage: string = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.checkScreenSize();
  }

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private scrollCheckService: ScrollCheckService,
    private geolocationService: GeolocationService,
    private swUpdate: SwUpdate,
    private overlayService: OverlayService,
    private renderer: Renderer2
  ) {
    this.checkScreenSize();
    this.getLocation();
  }

  getLocation(): void {
    this.geolocationService.getLocation().then(
      (coords) => {
        const latitude = coords.latitude;
        const longitude = coords.longitude;
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }

  // @HostListener('window:scroll', ['$event'])
  // onScroll(event: Event): void {
  //   this.scrollCheckService.trackScroll();
  //   console.log('scroll detected');
  // }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 1024;
  }

  ngOnInit(): void {
    this.scrollCheckService.widgetShown().subscribe((shown) => {
      if (shown) {
        console.log('maybe scroll detected');
        this.showWidget = true;
      }
    });

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showFilters = this.isEventsPageActive();
      });

    if (window.matchMedia('(display-mode: browser)').matches) {
      // We are in a browser
      if ('standalone' in navigator) {
        // only avail in Safari
        this.snackBar.open("You can install this app, use Share > Add to Home Screen", "", { duration: 7000 });
      } else {
        // not Safari
        window.addEventListener("beforeinstallprompt", event => {
          event.preventDefault();
          const sb = this.snackBar.open("Install the app!", "Install", { duration: 7000 });
          sb.onAction().subscribe(() => {
            (event as any).prompt();
          });
        });
      }
    }

    // Check for service worker updates
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      ).subscribe(() => {
        const snackBarRef = this.snackBar.open('A new version is available', 'Reload', {
          duration: 7000,
        });

        snackBarRef.onAction().subscribe(() => {
          window.location.reload();
        });
      });

      this.swUpdate.checkForUpdate();
    }

    this.overlayService.overlayState$.subscribe(state => {
      this.isOverlayActive = state.isActive;
      this.activeImage = state.imageUrl;
    });
  }

  // loadBuyMeACoffeeWidget(): void {
  //   const existingScript = document.querySelector('script[data-name="BMC-Widget"]');
  //   if (existingScript) {
  //     existingScript.remove();
  //   }
  
  //   const script = document.createElement('script');
  //   script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
  //   script.setAttribute('data-name', 'BMC-Widget');
  //   script.setAttribute('data-cfasync', 'false');
  //   script.setAttribute('data-id', 'littlefallslocal');
  //   script.setAttribute('data-description', 'Support me on Buy me a coffee!');
  //   script.setAttribute('data-message', 'Want to support what we do? Buy us a coffee!');
  //   script.setAttribute('data-color', '#FF813F');
  //   script.setAttribute('data-position', 'Right');
  //   script.setAttribute('data-x_margin', '18');
  //   script.setAttribute('data-y_margin', '18');
  
  //   script.onload = () => {
  //     console.log('Buy Me a Coffee widget script loaded successfully.');
  //     const button = document.getElementById('bmc-wbtn');
  //     const iframe = document.getElementById('bmc-iframe');
  //     if (button) {
  //       console.log('Widget button element created successfully:', button);
  //     } else {
  //       console.error('Failed to create widget button element.');
  //     }
  //     if (iframe) {
  //       console.log('Widget iframe element created successfully:', iframe);
  //     } else {
  //       console.error('Failed to create widget iframe element.');
  //     }
  //   };
  
  //   script.onerror = (error) => {
  //     console.error('Error loading Buy Me a Coffee widget script:', error);
  //   };
  
  //   document.body.appendChild(script);
  // }

  isEventsPageActive(): boolean {
    return this.router.url.includes('/events');
  }

  closeOverlay() {
    this.overlayService.closeOverlay();
  }
}
