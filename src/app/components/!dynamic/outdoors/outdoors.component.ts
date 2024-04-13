import { Pipe, PipeTransform, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

// Define an interface for the type of event object
interface ActivityItem {
  name: string;
  location: string;
  rating: number;
  hours: string;
  description: string;
  icon: string;
  image: string;
  url: string;
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
  outdoorActivities: any[] = [];

  constructor(private http: HttpClient, private meta: Meta) {}

  ngOnInit(): void {
    this.fetchOutdoorActivities();

    this.meta.updateTag({ name: 'description', content: 'Embrace the great outdoors in Little Falls and beyond! Uncover serene parks, scenic trails, and exciting outdoor adventures for all ages. Find your next nature escape and immerse yourself in the beauty of our surroundings.' });
  }

  fetchOutdoorActivities(): void {
    this.http.get<any>('/assets/database/outdoors.json').subscribe(data => {
      this.outdoorActivities = data.activities.map((activity: any) => ({ ...activity, isExpanded: false }));
    });
  }

  getIconPath(icon: string): string {
    return `/assets/icons/${icon}.svg`;
  }

  getImagePath(image: string): string {
    return `/assets/images/outdoors/${image}.jpg`;
  }

  expandItem(activity: ActivityItem): void {
    activity.isExpanded = !activity.isExpanded;
  }
}