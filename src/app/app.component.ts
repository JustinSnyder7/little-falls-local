
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScrollCheckService } from './services/scroll-check.service';

library.add(faTimes);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'LittleFallsLocal.com';

  showFilters: boolean = false;
  isSmallScreen: boolean = false;
  
  @HostListener('window:resize', ['$event'])
  
  onResize(event: UIEvent) {
    this.checkScreenSize();
  }

  constructor(private router: Router, private snackBar: MatSnackBar, private scrollCheckService: ScrollCheckService) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 1024;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showFilters = this.isEventsPageActive();

    

    if (window.matchMedia('(display-mode: browser').matches) {
      // We are in a browser
      if ('standalone' in navigator) {
        // only avail in safari
        this.snackBar.open("You can install this app, use Share > Add to Home Screen", "", { duration: 7000 })
      } else {
        // not Safari
        window.addEventListener("beforeinstallprompt", event => {
          event.preventDefault();
          const sb = this.snackBar.open("Install the app!", "Install", { duration: 7000 })
          sb.onAction().subscribe(() => {
            (event as any).prompt();
          })
        })
      }
    }
  });

// scroll event listener
window.addEventListener('scroll', () => this.scrollCheckService.trackScroll());

  }

  isEventsPageActive(): boolean {
    return this.router.url.includes('/events');
  }
}
