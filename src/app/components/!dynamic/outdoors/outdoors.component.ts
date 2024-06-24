import { Pipe, PipeTransform, Component, OnInit, Renderer2, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFilter, faFilterCircleXmark, faLocationDot, faPhone, faDownLeftAndUpRightToCenter, faShareNodes, faShare } from '@fortawesome/free-solid-svg-icons';
import { OverlayService } from '../../../services/overlay.service';
import { SourcePage } from '../../!sub-components/image-carousel/image-carousel.component';
import { OsDetectionService } from '../../../services/os-detection.service';

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

  uniqueOutdoorTypes: string[] = [];

  osType: string = 'unknown';

  @ViewChildren('item') items!: QueryList<ElementRef>;

  constructor(
    private http: HttpClient, 
    private meta: Meta, 
    private library: FaIconLibrary, 
    private renderer: Renderer2, 
    private elementRef: ElementRef, 
    private overlayService: OverlayService,
    private osDetectionService: OsDetectionService
  
  ) {
    library.addIcons(faFilter, faFilterCircleXmark, faLocationDot, faPhone, faDownLeftAndUpRightToCenter, faShareNodes, faShare);
  }

  openImage(event: any) {
    const imageUrl = event.target.src;
    this.overlayService.openOverlay(imageUrl);
  }

  ngOnInit(): void {
    this.fetchData();

    this.meta.updateTag({ name: 'description', content: 'Embrace the great outdoors in Little Falls and beyond! Uncover serene parks, scenic trails, and exciting outdoor adventures for all ages. Find your next nature escape and immerse yourself in the beauty of our surroundings.' });

    this.detectOS();
  }

  share(item: any) {
    const shareText = 'Check this out!';
    if ('share' in navigator) {
      navigator["share"]({
        title: 'Little Falls Events',
        text: shareText,
        url: window.location.href,
      }).then( () => console.log('Successful share') ).catch( () => console.log('error sharing') );
    } else {
      const shareURL = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
      location.href = shareURL;
    }
  }

  fetchData(): void {
    this.http.get<any>('/assets/database/outdoors.json').subscribe(data => {
      this.outdoorData = data.item.map((item: any) => ({ ...item, isExpanded: false }));

      // Create version of list to apply additional filtering
      this.filteredEvents = this.outdoorData;

      this.extractUniqueEventTypes();
    });
  }

  extractUniqueEventTypes() {
    const allEventTypes = this.outdoorData.map(event => event.type);
    const flattenedTypes = allEventTypes.flatMap(type => type.split(' '));
    this.uniqueOutdoorTypes = [...new Set(flattenedTypes)];
    this.uniqueOutdoorTypes.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }

  filterByType(filterKeywords: string): void {
    const keywords = filterKeywords.split(' ');

    this.filteredEvents = this.outdoorData.filter(event => {
      const eventTypeLower = event.type.toLowerCase();
      return keywords.some(keyword => eventTypeLower.includes(keyword.toLowerCase()));
    });

    this.isFilterApplied = true;

    const iconElement = this.elementRef.nativeElement.querySelector('#clearFilterText');
      if (iconElement) {
        this.renderer.setStyle(iconElement, 'display', 'inline');
      }
  }
  
  resetFilter(): void {
    this.filteredEvents = this.outdoorData; // Reset to show all events
    this.isFilterApplied = false;

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

  expandItem(item: outdoorDataElements, index: number): void {
    if (item.isExpanded) {
      // Check if this is already expanded; do nothing for now     
    } else {
      // Collapse any previously expanded item
      this.outdoorData.forEach(event => {
        // if (item.isExpanded && item !== item) {
          event.isExpanded = false;
        // }
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

  detectOS(): void {
    this.osType = this.osDetectionService.getMobileOperatingSystem();
    // console.log('From app component, detected OS:', this.osType);
  }
}