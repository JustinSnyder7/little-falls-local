import { Pipe, PipeTransform, Component, OnInit, Renderer2, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFilter, faFilterCircleXmark, faLocationDot, faPhone, faDownLeftAndUpRightToCenter } from '@fortawesome/free-solid-svg-icons';
import { OverlayService } from '../../../services/overlay.service';
import { SourcePage } from '../../!sub-components/image-carousel/image-carousel.component';

// import { DistanceService } from 'app/services/distance.service';
//  private distanceService: DistanceService

// Define an interface for the type of event object
interface outdoorDataElements {
  name: string;
  locationAddress: string;
  locationCity: string;
  rating: number;
  hours: string;
  phoneNumber: string;
  description: string;
  icon: string;
  image: any;
  url: string;
  type: string;
  referenceID: string;
  highlighted: boolean;
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
  selector: 'app-outdoors',
  templateUrl: './outdoors.component.html',
  styleUrls: ['./outdoors.component.css']
})

export class OutdoorsComponent implements OnInit {

  SourcePage = SourcePage;

  outdoorData: outdoorDataElements[] = [];
  filteredEvents: outdoorDataElements[] = [];

  currentImage: string = ''; // Currently displayed main image
  isActive: boolean = false;
  isFilterApplied: boolean = false;

  @ViewChildren('item') items!: QueryList<ElementRef>;

  constructor(private http: HttpClient, private meta: Meta, private library: FaIconLibrary, private renderer: Renderer2, private elementRef: ElementRef, private overlayService: OverlayService) {
    library.addIcons(faFilter, faFilterCircleXmark, faLocationDot, faPhone, faDownLeftAndUpRightToCenter);
  }

  openImage(event: any) {
    const imageUrl = event.target.src;
    this.overlayService.openOverlay(imageUrl);
  }

  ngOnInit(): void {
    this.fetchOutdoorData();

    this.meta.updateTag({ name: 'description', content: 'Embrace the great outdoors in Little Falls and beyond! Uncover serene parks, scenic trails, and exciting outdoor adventures for all ages. Find your next nature escape and immerse yourself in the beauty of our surroundings.' });
  }

  fetchOutdoorData(): void {
    this.http.get<any>('/assets/database/outdoors.json').subscribe(data => {
      this.outdoorData = data.item.map((item: any) => ({ ...item, isExpanded: false }));

      // Create version of list to apply additional filtering
      this.filteredEvents = this.outdoorData;
    });
  }

  filterByType(type: string): void {
    this.filteredEvents = this.outdoorData.filter(event => event.type === type);
    this.isFilterApplied = true;

    // Toggle on reset button
    const iconElement = this.elementRef.nativeElement.querySelector('#clearFilterText');

    if (iconElement) {
      this.renderer.setStyle(iconElement, 'display', 'inline');
    }

  }
  
  resetFilter(): void {
    this.filteredEvents = this.outdoorData; // Reset to show all events
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
    return `/assets/images/outdoors/${image}.jpg`;
  }

  // expandItem(item: outdoorDataElements, index: number): void {

  //   this.filteredEvents.forEach(item => {
  //     if (item !== item) {
  //       item.isExpanded = false;
  //     }
  //   });

  //   item.isExpanded = !item.isExpanded;
  //   setTimeout(() => this.scrollToItemInViewport(index), 0);
  // }

  expandItem(item: outdoorDataElements, index: number): void {
    if (item.isExpanded) {
      // Check if this is already expanded; do nothing for now     
    } else {
      // Collapse any previously expanded item
      this.outdoorData.forEach(item => {
        if (item.isExpanded && item !== item) {
          item.isExpanded = false;
        }
      });
  
      // Expand the clicked item
      item.isExpanded = true;

      setTimeout(() => this.scrollToItemInViewport(index), 0);
    }
  }


  scrollToItemInViewport(index: number): void {
    const itemElement = this.items.toArray()[index].nativeElement;
    const itemRect = itemElement.getBoundingClientRect();
    const offsetTop = window.scrollY + itemRect.top - 84;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  }

  closeItem(item: outdoorDataElements, event: Event): void {
    event.stopPropagation(); // Stop event propagation
    item.isExpanded = false;
  }

  formatEventLocationName(eventLocationName: string, eventLocationCity: string): string {
    // Remove punctuation using a regular expression
    const sanitizedName = eventLocationName.replace(/[^\w\s]/g, '');
    
    // Replace spaces with '+' signs and convert to lowercase
    const formattedName = 'https://www.google.com/maps/search/?api=1&query=' + sanitizedName.replace(/\s+/g, '+').toLowerCase() + '+' + eventLocationCity + '+NY';
  
    return formattedName;
  }
}