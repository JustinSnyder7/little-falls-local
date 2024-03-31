import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

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

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrl: './food.component.css'
})

export class FoodComponent implements OnInit {
  foodPlacesVar: any[] = [];

  constructor(private http: HttpClient, private meta: Meta) {}

  ngOnInit(): void {
    this.fetchFoodPlaces();

    this.meta.updateTag({ name: 'description', content: 'Explore some of the best restaurants Little Falls, and the surrounding area, has to offer! There are plent of excellent choices close to our small city.' });
  }

  fetchFoodPlaces(): void {
    this.http.get<any>('/assets/database/food.json').subscribe(data => {
      this.foodPlacesVar = data.foodPlaces.map((foodPlaces: any) => ({ ...foodPlaces, isExpanded: false }));

      console.log('Food Places Data:', this.foodPlacesVar); // Log food places data
    });
  }

  getIconPath(icon: string): string {
    return `/assets/icons/${icon}.svg`;
  }

  getImagePath(image: string): string {
    return `/assets/images/food/${image}.jpg`;
  }

  expandItem(foodPlaces: FoodItem): void {
    foodPlaces.isExpanded = !foodPlaces.isExpanded;
  }

  formatRestaurantName(foodPlacesName: string): string {
    // Remove punctuation using a regular expression
    const sanitizedName = foodPlacesName.replace(/[^\w\s]/g, '');
    
    // Replace spaces with '+' signs and convert to lowercase
    const formattedName = 'https://www.google.com/maps/search/?api=1&query=' + sanitizedName.replace(/\s+/g, '+').toLowerCase() + '+little+falls+NY';
  
    return formattedName;
  }
}