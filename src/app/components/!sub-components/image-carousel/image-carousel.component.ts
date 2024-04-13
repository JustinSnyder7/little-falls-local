import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css']
})
export class ImageCarouselComponent {
  @Input() images: any; // Input data containing image URLs

  currentImage: string = ''; // Currently displayed main image
  thumbnailImages: string[] = []; // Array of thumbnail image URLs
  fallbackImageUrl: string = '/assets/images/mesh.png'; // Fallback image URL

  ngOnInit(): void {
    if (this.images) {
      // Initialize main image and thumbnail images
      this.currentImage = this.images.first;
      this.thumbnailImages = [
        this.images.first,
        this.images.second,
        this.images.third,
        this.images.fourth,
        this.images.fifth
      ];
    }
  }

  setCurrentImage(image: string): void {
    this.currentImage = image; // Set clicked thumbnail as main image
  }

  // Method to handle image loading errors
  handleImageError(event: any): void {
    event.target.src = this.fallbackImageUrl; // Replace failed image with fallback URL
  }
}