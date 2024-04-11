import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EventsComponent } from './events/events.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { ShopsComponent } from './shops/shops.component';
import { OutdoorsComponent } from './outdoors/outdoors.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FoodComponent } from './food/food.component';
import { RatingComponent } from './rating/rating.component';
import { NotWholeNumberDirective } from './not-whole-number.directive';
import { IsWholeNumberDirective } from './is-whole-number.directive';
import { HomePageComponent } from './home-page/home-page.component';
import { TruncatePipe } from './truncate.pipe';
import { SubmitEventComponent } from './submit-event/submit-event.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';

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
