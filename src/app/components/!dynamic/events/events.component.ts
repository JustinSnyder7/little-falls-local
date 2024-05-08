import { Pipe, PipeTransform, Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFilter, faFilterCircleXmark, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';

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
  location: string;
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

  constructor(private http: HttpClient, private meta: Meta, private datePipe: DatePipe, private library: FaIconLibrary, private renderer: Renderer2, private elementRef: ElementRef) {
    library.addIcons(faFilter, faFilterCircleXmark, faLocationDot, faPhone);
  }

  ngOnInit(): void {
    this.fetchEventData();

    this.meta.updateTag({ name: 'description', content: 'Explore our community&#39;s heartbeat with concerts, farmers markets, and more on our events page. Stay in the loop with what&#39;s happening in Little Falls and nearby, and experience the lively culture and spirit of our town.' });

  }

  fetchEventData(): void {
    this.http.get<any>('/assets/database/events.json').subscribe(data => {
      this.eventData = data.eventItem.map((eventItem: any) => ({ ...eventItem, isExpanded: false }));
      // Filter out past events
      this.eventData = this.filterPastEvents(data.eventItem);

      // Create version of list to apply additional filtering
      this.filteredEvents = this.eventData;

    });
  }

  // use to filter out events that are past -------------------------------------------------------------------------------------
  filterPastEvents(eventItem: any[]): any[] {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return eventItem.filter(eventItem => {
      // Parse event date and compare with today's date
      const eventStartDate = new Date(eventItem.startDate);
      const eventEndDate = new Date(eventItem.endDate);
      return eventStartDate > yesterday || eventEndDate > yesterday;
    });

  }

  filterByType(type: string): void {
    this.filteredEvents = this.eventData.filter(event => event.type === type);
    this.isFilterApplied = true;

    // Toggle on reset button
    const iconElement = this.elementRef.nativeElement.querySelector('#clearFilterText');

    if (iconElement) {
      this.renderer.setStyle(iconElement, 'display', 'inline');
    }
  }

  resetFilter(): void {
    this.filteredEvents = this.eventData; // Reset to show all events
    this.isFilterApplied = false;

    // Toggle off reset button
    const iconElement = this.elementRef.nativeElement.querySelector('#clearFilterText');

    if (iconElement) {
      this.renderer.setStyle(iconElement, 'display', 'none');
    }
  }


  

  filterOne(): void {
    console.log('Filter one clicked!');
    // Perform other actions...
  }

  filterTwo(): void {
    console.log('Filter two clicked!');
    // Perform other actions...
  }

  filterThree(): void {
    console.log('Filter three clicked!');
    // Perform other actions...
  }

  filterFour(): void {
    console.log('Filter four clicked!');
    // Perform other actions...
  }

  getIconPath(icon: string): string {
    return `/assets/icons/${icon}.svg`;
  }

  getImagePath(icon: string): string {
    return `/assets/images/events/${icon}.jpg`;
  }

  expandItem(eventItem: eventDataElements): void {
    eventItem.isExpanded = !eventItem.isExpanded;
  }

  // format the date for single day events
  formatDate(dateString: string): string {
    // Parse the string date into a JavaScript Date object
    const date = new Date(dateString);

    // Extract the day part of the date
    const day = date.getDate();

    // Add the appropriate suffix based on the day
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

    // Apply the DatePipe to format the date and then make it uppercase.
    const formattedDate=(this.datePipe.transform(date, 'EEE, MMM d') || '') + suffix;

    return formattedDate.toUpperCase();
  }

  // format the date for multi day events
  formatDateRange(startDate: string, endDate: string): string {
    // Parse the string dates into JavaScript Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Extract the day parts of the dates
    const startDay = startDateObj.getDate();
    const endDay = endDateObj.getDate();

    // Function to determine the suffix based on the day
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

    // Format start date with suffix
    const formattedStartDate = `${this.datePipe.transform(startDateObj, 'MMM d')}${getDaySuffix(startDay)}`;

    // Format end date with suffix
    const formattedEndDate = `${this.datePipe.transform(endDateObj, 'd')}${getDaySuffix(endDay)}`;

    // Combine formatted dates with a hyphen
    const formattedDateRange = `${formattedStartDate} - ${formattedEndDate}`;

    // Convert to uppercase and return
    return formattedDateRange.toUpperCase();
}

  formatEventLocationName(eventLocationName: string): string {
    // Remove punctuation using a regular expression
    const sanitizedName = eventLocationName.replace(/[^\w\s]/g, '');
    
    // Replace spaces with '+' signs and convert to lowercase
    const formattedName = 'https://www.google.com/maps/search/?api=1&query=' + sanitizedName.replace(/\s+/g, '+').toLowerCase() + '+little+falls+NY';
  
    return formattedName;
  }
}