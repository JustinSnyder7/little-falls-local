import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/!primary/navbar/navbar.component';
import { EventsComponent } from './components/!dynamic/events/events.component';
import { HeaderComponent } from './components/!primary/header/header.component';
import { FooterComponent } from './components/!primary/footer/footer.component';
import { AboutComponent } from './components/!static/about/about.component';
import { ShopsComponent } from './components/!dynamic/shops/shops.component';
import { OutdoorsComponent } from './components/!dynamic/outdoors/outdoors.component';
import { WelcomeComponent } from './components/!static/welcome/welcome.component';
import { ContactUsComponent } from './components/!static/contact-us/contact-us.component';
import { FoodComponent } from './components/!dynamic/food/food.component';
import { RatingComponent } from './components/!sub-components/rating/rating.component';
import { NotWholeNumberDirective } from './directives/not-whole-number.directive';
import { IsWholeNumberDirective } from './directives/is-whole-number.directive';
import { HomePageComponent } from './components/!static/home-page/home-page.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { SubmitEventComponent } from './components/!static/submit-event/submit-event.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ImageCarouselComponent } from './components/!sub-components/image-carousel/image-carousel.component';
import { FiltersComponent } from './components/!sub-components/filters/filters.component';
import { TitleComponent } from './components/!primary/title/title.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EventsComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    ShopsComponent,
    OutdoorsComponent,
    WelcomeComponent,
    ContactUsComponent,
    FoodComponent,
    RatingComponent,
    NotWholeNumberDirective,
    IsWholeNumberDirective,
    HomePageComponent,
    TruncatePipe,
    SubmitEventComponent,
    ImageCarouselComponent,
    FiltersComponent,
    TitleComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Add HttpClientModule here
    AppRoutingModule,
    NgxGoogleAnalyticsModule.forRoot('G-RHV2TGLWNT'),
    FontAwesomeModule,
    NgOptimizedImage
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
