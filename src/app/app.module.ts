import { NgModule, isDevMode, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventsComponent } from './components/!dynamic/events/events.component';
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
import { HeaderComponent } from './components/!primary/header/header.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DesktopSplashComponent } from './components/!primary/desktop-splash/desktop-splash.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ImagePreloadService } from './services/image-preload.service';


function preloadImageFactory(imagePreloadService: ImagePreloadService) {
  return () => imagePreloadService.preloadImage('assets/images/coming-soon.jpg');
}


@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
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
    HeaderComponent,
    DesktopSplashComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Add HttpClientModule here
    AppRoutingModule,
    MatSnackBarModule,
    NgxGoogleAnalyticsModule.forRoot('G-RHV2TGLWNT'),
    FontAwesomeModule,
    NgOptimizedImage,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [ DatePipe, 
    provideAnimationsAsync(), 
    {
      provide: APP_INITIALIZER,
      useFactory: preloadImageFactory,
      deps: [ImagePreloadService],
      multi: true
    } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
