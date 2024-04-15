import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

interface Event {
  id: number;
  name: string;
  type: string;
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})

export class FiltersComponent {
  constructor(private library: FaIconLibrary) {

    library.addIcons(faFilter);
  }

  filterOne(): void {
    console.log('Filter one clicked!');
    // Perform other actions...
  }

  filterTwo(): void {
    console.log('Filter two clicked!');
    // Perform other actions...
  }

  filterThree(): void {
    console.log('Filter three clicked!');
    // Perform other actions...
  }

  filterFour(): void {
    console.log('Filter four clicked!');
    // Perform other actions...
  }

}
