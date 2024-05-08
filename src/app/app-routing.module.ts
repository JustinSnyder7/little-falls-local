import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './components/!dynamic/events/events.component';
import { ShopsComponent } from './components/!dynamic/shops/shops.component';
import { OutdoorsComponent } from './components/!dynamic/outdoors/outdoors.component';
import { WelcomeComponent } from './components/!static/welcome/welcome.component';
import { AboutComponent } from './components/!static/about/about.component';
import { ContactUsComponent } from './components/!static/contact-us/contact-us.component';
import { FoodComponent } from './components/!dynamic/food/food.component';
import { HomePageComponent } from './components/!static/home-page/home-page.component';
import { SubmitEventComponent } from './components/!static/submit-event/submit-event.component';

const routes: Routes = [
  { path: 'events', component: EventsComponent },
  { path: 'shops', component: ShopsComponent },
  { path: 'outdoors', component: OutdoorsComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'food', component: FoodComponent },
  { path: 'submit-event', component: SubmitEventComponent},
  { path: '', component: EventsComponent }, // Default route
  { path: '**', redirectTo: '/events', pathMatch: 'full' } // Redirect any invalid routes to the default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
