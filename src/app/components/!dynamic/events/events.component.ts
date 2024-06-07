
import { Pipe, PipeTransform, Component, OnInit, Renderer2, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFilter, faFilterCircleXmark, faLocationDot, faDownLeftAndUpRightToCenter, faWindowMinimize, faPhone, faLink, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { OverlayService } from '../../../services/overlay.service';

// Define the interface for the data types
interface eventDataElements {
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  cost: string;
  uniqueID: string;
  image: string;
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
  eventData: eventDataElements[] = [];
  filteredEvents: eventDataElements[] = [];
  isFilterApplied = false;

  @ViewChildren('eventItem') eventItems!: QueryList<ElementRef>;

  constructor(
    private http: HttpClient,
    private meta: Meta,
    private datePipe: DatePipe,
    private library: FaIconLibrary,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private overlayService: OverlayService
  ) {
    library.addIcons(faFilter, faFilterCircleXmark, faLocationDot, faPhone, faDownLeftAndUpRightToCenter, faWindowMinimize, faLink, faExternalLink);
  }

  openImage(event: any) {
    const imageUrl = event.target.src;
    this.overlayService.openOverlay(imageUrl);
  }

  ngOnInit(): void {
    this.fetchEventData();
    this.meta.updateTag({ 
      name: 'description', 
      content: 'Explore our community&#39;s heartbeat with concerts, farmers markets, and more on our events page. Stay in the loop with what&#39;s happening in Little Falls and nearby, and experience the lively culture and spirit of our town.' });
  }

  fetchEventData(): void {
    this.http.get<any>('/assets/database/events.json').subscribe(data => {
      this.eventData = data.eventItem.map((eventItem: any) => ({ ...eventItem, isExpanded: false }));
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
    });
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

  filterPastEvents(eventItem: any[]): any[] {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return eventItem.filter(eventItem => {
      const eventStartDate = new Date(eventItem.startDate);
      const eventEndDate = new Date(eventItem.endDate);
      return eventStartDate > yesterday || eventEndDate > yesterday;
    });
  }

  filterByType(type: string): void {
    this.filteredEvents = this.eventData.filter(event => event.type === type);
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

  expandItem(eventItem: eventDataElements, index: number): void {
    if (eventItem.isExpanded) {
      // Check if this is already expanded; do nothing for now     
    } else {
      // Collapse any previously expanded item
      this.eventData.forEach(item => {
        if (item.isExpanded && item !== eventItem) {
          item.isExpanded = false;
        }
      });
  
      // Expand the clicked item
      eventItem.isExpanded = true;

      setTimeout(() => this.scrollToItemInViewport(index), 0);
    }
  }

  scrollToItemInViewport(index: number): void {
    const itemElement = this.eventItems.toArray()[index].nativeElement;
    const itemRect = itemElement.getBoundingClientRect();
    const offsetTop = window.scrollY + itemRect.top - 84;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  }

  closeItem(eventItem: eventDataElements, event: Event): void {
    event.stopPropagation(); // Stop event propagation
    eventItem.isExpanded = false;
  }

  getIconPath(icon: string): string {
    return `/assets/icons/${icon}.svg`;
  }

  getImagePath(icon: string): string {
    return `/assets/images/events/${icon}.jpg`;
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

  toggleDescription(eventItem: any) {
    eventItem.isDescriptionExpanded = !eventItem.isDescriptionExpanded;
  }
}
