// src/app/events/events.component.ts

import { Pipe, PipeTransform, Component, OnInit, Renderer2, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFilter, faFilterCircleXmark, faLocationDot, faDownLeftAndUpRightToCenter, faWindowMinimize, faPhone } from '@fortawesome/free-solid-svg-icons';

// Define an interface for the type of event object
interface eventDataElements {
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  cost: string;
  icon: string;
  image: string;
  locationAddress: string;
  locationName: string;
  description: string;
  url: string;
  type: string;
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
    private elementRef: ElementRef
  ) {
    library.addIcons(faFilter, faFilterCircleXmark, faLocationDot, faPhone, faDownLeftAndUpRightToCenter, faWindowMinimize);
  }

  ngOnInit(): void {
    this.fetchEventData();
    this.meta.updateTag({ name: 'description', content: 'Explore our community&#39;s heartbeat with concerts, farmers markets, and more on our events page. Stay in the loop with what&#39;s happening in Little Falls and nearby, and experience the lively culture and spirit of our town.' });
  }

  fetchEventData(): void {
    this.http.get<any>('/assets/database/events.json').subscribe(data => {
      this.eventData = data.eventItem.map((eventItem: any) => ({ ...eventItem, isExpanded: false }));
      this.eventData = this.filterPastEvents(data.eventItem);

      this.eventData.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      this.filteredEvents = this.eventData;
    });
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
    this.filteredEvents = this.eventData;
    this.isFilterApplied = false;
    const iconElement = this.elementRef.nativeElement.querySelector('#clearFilterText');
    if (iconElement) {
      this.renderer.setStyle(iconElement, 'display', 'none');
    }
  }

  expandItem(eventItem: eventDataElements, index: number): void {
    this.filteredEvents.forEach(event => {
      if (event !== eventItem) {
        event.isExpanded = false;
      }
    });
    eventItem.isExpanded = !eventItem.isExpanded;
    setTimeout(() => this.scrollToItemInViewport(index), 0);
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

  formatEventLocationName(eventLocationName: string): string {
    const sanitizedName = eventLocationName.replace(/[^\w\s]/g, '');
    const formattedName = 'https://www.google.com/maps/search/?api=1&query=' + sanitizedName.replace(/\s+/g, '+').toLowerCase() + '+little+falls+NY';
    return formattedName;
  }
}
