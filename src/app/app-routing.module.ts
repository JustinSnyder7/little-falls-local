import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventsComponent } from './events/events.component';
import { ShopsComponent } from './shops/shops.component';
import { OutdoorsComponent } from './outdoors/outdoors.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FoodComponent } from './food/food.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SubmitEventComponent } from './submit-event/submit-event.component';

const routes: Routes = [
  { path: 'events', component: EventsComponent },
  { path: 'shops', component: ShopsComponent },
  { path: 'outdoors', component: OutdoorsComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'food', component: FoodComponent },
  { path: 'submit-event', component: SubmitEventComponent},
  { path: '', component: HomePageComponent }, // Default route
  { path: '**', redirectTo: '/welcome', pathMatch: 'full' } // Redirect any invalid routes to the default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
