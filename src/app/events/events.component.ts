import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

// Define an interface for the type of event object
interface EventItem {
  id: number;
  name: string;
  isDateRange: boolean;
  pastDate: Date;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timeSpan: string;
  location: string;
  locationName: string;
  icon: string;
  description: string;
  image: string;
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

    this.meta.updateTag({ name: 'description', content: 'Explore some of the best restaurants in Little Falls and nearby! There are plent of excellent choices close to our small city.' });
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
    return `/assets/images/${icon}.jpg`;
  }

  expandItem(events: EventItem): void {
    events.isExpanded = !events.isExpanded;
  }

  // format the date for single day events
  formatDate(dateString: string): string {
    // Parse the string date into a JavaScript Date object
    const date = new Date(dateString);
    // Apply the DatePipe to format the date
    return this.datePipe.transform(date, 'EEEE, MMMM dd') || '';
  }

  // format the date for multi day events
  formatDateRange(dateRangeString: string): string {
    // Parse the string date into a JavaScript Date object
    const dateRange = new Date(dateRangeString);

    // Apply the DatePipe to format the date
    return this.datePipe.transform(dateRange, 'EEE, MMM dd') || '';
  }

}