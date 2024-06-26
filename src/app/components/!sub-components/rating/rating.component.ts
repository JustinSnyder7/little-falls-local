import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})

export class RatingComponent {
  @Input() rating!: number; // Input property to receive the rating value

  stars: number[]; // Array to represent the stars

  roundedModulus!: number;

  constructor() {
    this.stars = [1, 2, 3, 4, 5]; // Total number of stars
  }

  // used to calculate the remained to determine the partial star
  ngOnInit(): void {
    this.roundedModulus = +(this.rating % 1).toFixed(1); // Calculate and round the modulus
  }
}