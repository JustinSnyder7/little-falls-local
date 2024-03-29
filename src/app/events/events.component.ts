import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

// Define an interface for the type of event object
interface EventItem {
  id: number;
  name: string;
  pastDate: Date;
  date: string;
  time: string;
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
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit {
  EventsVar: EventItem[] = [];

  constructor(private http: HttpClient, private meta: Meta) {}

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
    const today = new Date();
    return events.filter(event => {
      // Parse event date and compare with today's date
      const eventDate = new Date(event.pastDate);
      return eventDate >= today;
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
  
}}