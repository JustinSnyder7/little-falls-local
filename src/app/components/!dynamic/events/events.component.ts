import { Pipe, PipeTransform, Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

// Define an interface for the type of event object
interface EventItem {
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
  EventsVar: EventItem[] = [];
  filteredEvents: EventItem[] = [];

  constructor(private http: HttpClient, private meta: Meta, private datePipe: DatePipe) {}

  // formattedDate=this.datePipe.transform(new Date(), 'EEE MMM dd');

  ngOnInit(): void {
    this.fetchEventsVar();

    this.meta.updateTag({ name: 'description', content: 'Explore our community&#39;s heartbeat with concerts, farmers markets, and more on our events page. Stay in the loop with what&#39;s happening in Little Falls and nearby, and experience the lively culture and spirit of our town.' });
  }

  fetchEventsVar(): void {
    this.http.get<any>('/assets/database/events.json').subscribe(data => {
      this.EventsVar = data.events.map((events: any) => ({ ...events, isExpanded: false }));
      // Filter out past events
      this.EventsVar = this.filterPastEvents(data.events);

      // Create version of list to apply additional filtering
      this.filteredEvents = this.EventsVar;

    });
  }

  // use to filter out events that are past -------------------------------------------------------------------------------------
  filterPastEvents(events: any[]): any[] {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return events.filter(event => {
      // Parse event date and compare with today's date
      const eventDate = new Date(event.startDate);
      return eventDate > yesterday;
    });

  }

  getIconPath(icon: string): string {
    return `/assets/icons/${icon}.svg`;
  }

  getImagePath(icon: string): string {
    return `/assets/images/events/${icon}.jpg`;
  }

  expandItem(events: EventItem): void {
    events.isExpanded = !events.isExpanded;
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