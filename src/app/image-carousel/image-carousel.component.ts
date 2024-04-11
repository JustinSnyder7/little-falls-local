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

  ngOnInit(): void {
    if (this.images) {
      // Initialize main image and thumbnail images
      this.currentImage = this.images.primary;
      this.thumbnailImages = [
        this.images.primary,
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
}
