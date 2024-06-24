
import { Pipe, PipeTransform, Component, OnInit, Renderer2, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFilter, faFilterCircleXmark, faLocationDot, faDownLeftAndUpRightToCenter, faWindowMinimize, faPhone, faLink, faExternalLink, faShareNodes, faShare } from '@fortawesome/free-solid-svg-icons';
import { OverlayService } from '../../../services/overlay.service';
import { SourcePage } from '../../!sub-components/image-carousel/image-carousel.component';
import { OsDetectionService } from '../../../services/os-detection.service';

// Define the interface for event data
interface eventDataElements {
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  cost: string;
  uniqueID: string;
  image: any;
  locationName: string;
  locationAddress: string;
  locationCity: string;
  description: string;
  url: string;
  type: string;
  showURL: boolean;
  highlight: boolean;
  isExpanded: boolean;
  oneOff: boolean;
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
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {

  SourcePage = SourcePage;

  eventData: eventDataElements[] = [];
  filteredEvents: eventDataElements[] = [];
  isFilterApplied = false;

  uniqueEventTypes: string[] = [];

  osType: string = 'unknown';

  @ViewChildren('item') items!: QueryList<ElementRef>;

  constructor(
    private http: HttpClient,
    private meta: Meta,
    private datePipe: DatePipe,
    private library: FaIconLibrary,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private overlayService: OverlayService,
    private osDetectionService: OsDetectionService

  ) {
    library.addIcons(faFilter, faFilterCircleXmark, faLocationDot, faPhone, faDownLeftAndUpRightToCenter, faWindowMinimize, faLink, faExternalLink, faShareNodes, faShare );
  }


  openImage(event: any) {
    const imageUrl = event.target.src;
    this.overlayService.openOverlay(imageUrl);
  }

  ngOnInit(): void {
    this.fetchData();

    this.meta.updateTag({ 
      name: 'description', 
      content: 'Explore our community&#39;s heartbeat with concerts, farmers markets, and more on our events page. Stay in the loop with what&#39;s happening in Little Falls and nearby, and experience the lively culture and spirit of our town.' });

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
    this.http.get<any>('/assets/database/events.json').subscribe(data => {
      this.eventData = data.item.map((item: any) => ({ ...item, isExpanded: false }));
      this.eventData = this.filterPastEvents(this.eventData);
  
      // Sort by date
      this.eventData.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
      // Find and remove the item with uniqueID 'view-all-events'
      const viewAllEventsIndex = this.eventData.findIndex(item => item.uniqueID === 'view-all-events');
      let viewAllEventsItem;
      if (viewAllEventsIndex !== -1) {
        viewAllEventsItem = this.eventData.splice(viewAllEventsIndex, 1)[0];
      }
  
      // Insert the item at the 10th position (index 9)
      if (viewAllEventsItem) {
        const insertIndex = Math.min(13, this.eventData.length); // Ensure the index is within bounds
        this.eventData.splice(insertIndex, 0, viewAllEventsItem);
      }
  
      // Apply the filtering logic
      this.filteredEvents = this.limitEntriesPerUniqueID(this.eventData, 5);
      
      this.extractUniqueEventTypes();
    });
  }

  extractUniqueEventTypes() {
    const allEventTypes = this.eventData.map(event => event.type);
    const flattenedTypes = allEventTypes.flatMap(type => type.split(' '));
    this.uniqueEventTypes = [...new Set(flattenedTypes)];
    this.uniqueEventTypes.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    console.log(this.uniqueEventTypes);
  }

  limitEntriesPerUniqueID(events: eventDataElements[], maxEntries: number): eventDataElements[] {
    const eventTypeMap: { [key: string]: number } = {};
    const limitedEvents: eventDataElements[] = [];
  
    events.forEach(event => {
      if (!eventTypeMap[event.uniqueID]) {
        eventTypeMap[event.uniqueID] = 0;
      }
  
      if (eventTypeMap[event.uniqueID] < maxEntries) {
        eventTypeMap[event.uniqueID]++;
        limitedEvents.push(event);
      }
    });
  
    return limitedEvents;
  }

  showAllEvents(): void {
    this.filteredEvents = this.eventData;
    this.isFilterApplied = false;
    const iconElement = this.elementRef.nativeElement.querySelector('#clearFilterText');
    if (iconElement) {
      this.renderer.setStyle(iconElement, 'display', 'none');
    }
  }

  filterPastEvents(item: any[]): any[] {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return item.filter(item => {
      const eventStartDate = new Date(item.startDate);
      const eventEndDate = new Date(item.endDate);
      return eventStartDate > yesterday || eventEndDate > yesterday;
    });
  }

  filterByType(filterKeywords: string): void {
    const keywords = filterKeywords.split(' ');

    this.filteredEvents = this.eventData.filter(event => {
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
    // Remove the item with uniqueID 'view-all-events' from the list
    this.filteredEvents = this.eventData.filter(item => item.uniqueID !== 'view-all-events');
    this.isFilterApplied = false;
    
    // Hide the clear filter text/icon if present
    const iconElement = this.elementRef.nativeElement.querySelector('#clearFilterText');
    if (iconElement) {
      this.renderer.setStyle(iconElement, 'display', 'none');
    }
  }

  expandItem(item: eventDataElements, index: number): void {
    if (item.isExpanded) {
      // Check if this is already expanded; do nothing for now     
    } else {
      // Collapse any previously expanded item
      this.eventData.forEach(event => {
        // if (event.isExpanded && event !== event) {
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

  closeItem(item: eventDataElements, event: Event): void {
    event.stopPropagation(); // Stop event propagation
    item.isExpanded = false;
  }

  getIconPath(icon: string): string {
    return `/assets/icons/${icon}.svg`;
  }

  getImagePath(icon: string): string {
    return `/assets/images/events/${icon}.webp`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    let suffix = '';
    if (day === 1 || day === 21 || day === 31) {
      suffix = 'st';
    } else if (day === 2 || day === 22) {
      suffix = 'nd';
    } else if (day === 3 || day === 23) {
      suffix = 'rd';
    } else {
      suffix = 'th';
    }
    const formattedDate = (this.datePipe.transform(date, 'EEE, MMM d') || '') + suffix;
    return formattedDate.toUpperCase();
  }

  formatDateRange(startDate: string, endDate: string): string {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const startDay = startDateObj.getDate();
    const endDay = endDateObj.getDate();
    const getDaySuffix = (day: number): string => {
      if (day === 1 || day === 21 || day === 31) {
        return 'st';
      } else if (day === 2 || day === 22) {
        return 'nd';
      } else if (day === 3 || day === 23) {
        return 'rd';
      } else {
        return 'th';
      }
    };
    const formattedStartDate = `${this.datePipe.transform(startDateObj, 'MMM d')}${getDaySuffix(startDay)}`;
    const formattedEndDate = `${this.datePipe.transform(endDateObj, 'd')}${getDaySuffix(endDay)}`;
    const formattedDateRange = `${formattedStartDate} - ${formattedEndDate}`;
    return formattedDateRange.toUpperCase();
  }

  formatEventLocationName(eventLocationName: string, eventLocationCity: string): string {
    const sanitizedName = eventLocationName.replace(/[^\w\s]/g, '');
    const formattedName = 'https://www.google.com/maps/search/?api=1&query=' + sanitizedName.replace(/\s+/g, '+').toLowerCase() + '+' + eventLocationCity + '+NY';
    return formattedName;
  }

  formatDisplayURL(eventURL: string): string {
    const formattedURL = eventURL.replace(/https:\/\/www./, '').toLowerCase();
    return formattedURL;
  }

  toggleDescription(item: any) {
    item.isDescriptionExpanded = !item.isDescriptionExpanded;
  }

  detectOS(): void {
    this.osType = this.osDetectionService.getMobileOperatingSystem();
    // console.log('From app component, detected OS:', this.osType);
  }
}
