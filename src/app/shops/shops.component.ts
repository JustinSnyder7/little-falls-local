import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrl: './shops.component.css'
})

export class ShopsComponent implements OnInit {
  shoppingVar: any[] = [];

  constructor(private http: HttpClient, private meta: Meta) {}

  ngOnInit(): void {
    this.fetchShoppingStuff();

    this.meta.updateTag({ name: 'description', content: 'Discover charming mom-and-pop shops in Little Falls and surrounding areas! Explore unique treasures, handmade goods, and personalized service from local businesses in our community.' });
  }

  fetchShoppingStuff(): void {
    this.http.get<any>('/assets/database/shopping.json').subscribe(data => {
      this.shoppingVar = data.shops;
    });
  }
}
