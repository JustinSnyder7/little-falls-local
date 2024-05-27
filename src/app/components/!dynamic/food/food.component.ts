import { Pipe, PipeTransform,Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faWindowMinimize, faDownLeftAndUpRightToCenter, faFilter, faFilterCircleXmark, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';

// Define an interface for the type of event object
interface foodDataElements {
  name: string;
  type: string;
  location: string;
  hours: string;
  cost: string;
  description: string;
  phoneNumber: string;
  image: any;
  url: string;
  rating: number;
  highlight: boolean;
  isExpanded: boolean;
}

@Pipe({
  name: 'truncate'
})

export class TruncatePipe implements PipeTransform {
  transform(value: string, length: number): string {
    if (!value) return '';

    if (value.length <= length) {
      return value;
    } else {
      return value.substring(0, length) + '...';
    }
  }
}

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrl: './food.component.css'
})

export class FoodComponent implements OnInit {
  foodData: foodDataElements[] = [];
  filteredData: foodDataElements[] = [];

  isFilterApplied = false;

  constructor(private http: HttpClient, private meta: Meta, private library: FaIconLibrary, private renderer: Renderer2, private elementRef: ElementRef) {

    library.addIcons(faWindowMinimize, faDownLeftAndUpRightToCenter, faFilter, faFilterCircleXmark, faLocationDot, faPhone);
  }

  ngOnInit(): void {
    this.fetchFoodData();

    this.meta.updateTag({ name: 'description', content: 'Explore some of the best restaurants Little Falls, and the surrounding area, has to offer! There are plent of excellent choices, if you know where to look.' });
  }

  fetchFoodData(): void {
    this.http.get<any>('/assets/database/food.json').subscribe(data => {
      this.foodData = data.foodItem.map((foodItem: any) => ({ ...foodItem, isExpanded: false }));

      // Create version of list to apply additional filtering
      this.filteredData = this.foodData;
    });
  }

  filterByType(type: string): void {
    this.filteredData = this.foodData.filter(event => event.type === type);

    this.isFilterApplied = true;

    // Toggle on reset button
    const iconElement = this.elementRef.nativeElement.querySelector('#clearFilterText');

    if (iconElement) {
      this.renderer.setStyle(iconElement, 'display', 'inline');
    }
  }
  
  resetFilter(): void {
    this.filteredData = this.foodData; // Reset to show all events
    this.isFilterApplied = false;

    // Toggle off reset button
    const iconElement = this.elementRef.nativeElement.querySelector('#clearFilterText');

    if (iconElement) {
      this.renderer.setStyle(iconElement, 'display', 'none');
    }
  }

  getIconPath(icon: string): string {
    return `/assets/icons/${icon}.svg`;
  }

  getImagePath(image: string): string {
    return `/assets/images/food/${image}.jpg`;
  }

  expandItem(foodItem: foodDataElements): void {
    if (foodItem.isExpanded) {
      // Check if this is already expanded; do nothing or handle click logic
      console.log("clicked it");
      
    } else {
      // Collapse any previously expanded item
      this.foodData.forEach(item => {
        if (item.isExpanded && item !== foodItem) {
          item.isExpanded = false;
        }
      });
  
      // Expand the clicked item
      foodItem.isExpanded = true;
    }
  }

  closeItem(eventItem: foodDataElements, event: Event): void {
    event.stopPropagation(); // Stop event propagation
    eventItem.isExpanded = false;
  }

  formatRestaurantName(foodItemName: string): string {
    // Remove punctuation using a regular expression
    const sanitizedName = foodItemName.replace(/[^\w\s]/g, '');
    
    // Replace spaces with '+' signs and convert to lowercase
    const formattedName = 'https://www.google.com/maps/search/?api=1&query=' + sanitizedName.replace(/\s+/g, '+').toLowerCase() + '+little+falls+NY';
  
    return formattedName;
  }
}