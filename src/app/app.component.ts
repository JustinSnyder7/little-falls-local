
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
import { OsDetectionService } from './services/os-detection.service';

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

  osType: string = 'unknown';

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
    private osDetectionService: OsDetectionService,
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

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 1024;
  }

  ngOnInit(): void {
    this.scrollCheckService.widgetShown().subscribe((shown) => {
      if (shown) {
        this.showWidget = true;
      }
    });

    this.detectOS();

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

  
  isEventsPageActive(): boolean {
    return this.router.url.includes('/events');
  }

  closeOverlay() {
    this.overlayService.closeOverlay();
  }

  detectOS(): void {
    this.osType = this.osDetectionService.getMobileOperatingSystem();
    // console.log('From app component, detected OS:', this.osType);
  }
}
