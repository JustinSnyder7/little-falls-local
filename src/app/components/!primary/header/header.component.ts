import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faDiamond, faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {
  isNavbarCollapsed = true;

  isMenuVisible = false;

  constructor(private library: FaIconLibrary) {

    library.addIcons(faDiamond, faBars);

  }

  ngOnInit(): void {
    // This method is called when the component is initialized
    // You can perform initialization tasks here
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  hideMenu() {
    this.isMenuVisible = false;
  }
  
}
