import { Pipe, PipeTransform,Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faWindowMinimize, faDownLeftAndUpRightToCenter } from '@fortawesome/free-solid-svg-icons';

// Define an interface for the type of event object
interface FoodItem {
  name: string;
  location: string;
  placeID: string;
  rating: number;
  hours: string;
  description: string;
  icon: string;
  image: string;
  url: string;
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
  foodPlacesVar: any[] = [];

  constructor(private http: HttpClient, private meta: Meta, private library: FaIconLibrary) {

    library.addIcons(faWindowMinimize, faDownLeftAndUpRightToCenter);
  }

  ngOnInit(): void {
    this.fetchFoodPlaces();

    this.meta.updateTag({ name: 'description', content: 'Explore some of the best restaurants Little Falls, and the surrounding area, has to offer! There are plent of excellent choices close to our small city.' });
  }

  fetchFoodPlaces(): void {
    this.http.get<any>('/assets/database/food.json').subscribe(data => {
      this.foodPlacesVar = data.foodPlaces.map((foodPlaces: any) => ({ ...foodPlaces, isExpanded: false }));

      // console.log('Food Places Data:', this.foodPlacesVar);
    });
  }

  getIconPath(icon: string): string {
    return `/assets/icons/${icon}.svg`;
  }

  getImagePath(image: string): string {
    return `/assets/images/food/${image}.jpg`;
  }


  expandItem(foodPlaces: any): void {
    if (foodPlaces.isExpanded) {
      // Check if this is already expanded; do nothing or handle click logic
      console.log("clicked it");
      
    } else {
      // Collapse any previously expanded item
      this.foodPlacesVar.forEach(item => {
        if (item.isExpanded && item !== foodPlaces) {
          item.isExpanded = false;
        }
      });
  
      // Expand the clicked item
      foodPlaces.isExpanded = true;
    }
  }


  formatRestaurantName(foodPlacesName: string): string {
    // Remove punctuation using a regular expression
    const sanitizedName = foodPlacesName.replace(/[^\w\s]/g, '');
    
    // Replace spaces with '+' signs and convert to lowercase
    const formattedName = 'https://www.google.com/maps/search/?api=1&query=' + sanitizedName.replace(/\s+/g, '+').toLowerCase() + '+little+falls+NY';
  
    return formattedName;
  }
}