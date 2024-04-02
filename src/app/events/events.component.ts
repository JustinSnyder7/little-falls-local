import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

// Define an interface for the type of event object
interface EventItem {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  locationName: string;
  icon: string;
  image: string;
  description: string;
  highlight: boolean;
  isExpanded: boolean;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})

export class EventsComponent implements OnInit {
  EventsVar: EventItem[] = [];

  constructor(private http: HttpClient, private meta: Meta, private datePipe: DatePipe) {}

  // formattedDate=this.datePipe.transform(new Date(), 'EEE MMM dd');

  ngOnInit(): void {
    this.fetchEventsVar();

    this.meta.updateTag({ name: 'description', content: 'Discover the heartbeat of our community with local concerts, farmers markets, and more on our events page. Stay updated on the latest happenings in Little Falls and surrounding areas, and immerse yourself in the vibrant culture and spirit of our town.' });
  }

  fetchEventsVar(): void {
    this.http.get<any>('/assets/database/events.json').subscribe(data => {
      this.EventsVar = data.events.map((events: any) => ({ ...events, isExpanded: false }));
      // Filter out past events
      this.EventsVar = this.filterPastEvents(data.events);
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
  formatDateRange(dateRangeString: string): string {
    // Parse the string date into a JavaScript Date object
    const dateRange = new Date(dateRangeString);

    // Extract the day part of the date
    const day = dateRange.getDate();

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
    const formattedDateRange=(this.datePipe.transform(dateRange, 'MMM d') || '') + suffix;

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