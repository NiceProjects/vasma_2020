import { Route } from '@angular/router';
import { HomeComponent } from './comps/home/home.component';
import { AuthComponent } from './comps/basic/auth/auth.component';
import { AccountComponent } from './comps/account/account.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UserDashComponent } from './comps/account/user-dash/user-dash.component';
import { UserProfileComponent } from './comps/account/user-profile/user-profile.component';
import { UserEventsComponent } from './comps/account/user-events/user-events.component';
import { UserProspectsComponent } from './comps/account/user-prospects/user-prospects.component';
import { UserGalleryComponent } from './comps/account/user-gallery/user-gallery.component';
import { UserServicesComponent } from './comps/account/user-services/user-services.component';
import { UserNotificationsComponent } from './comps/account/user-notifications/user-notifications.component';
import { PublicProfileComponent } from './comps/public-profile/public-profile.component';
import { PublicUserFeedComponent } from './comps/public-profile/public-user-feed/public-user-feed.component';
import { PublicUserAboutComponent } from './comps/public-profile/public-user-about/public-user-about.component';
import { PublicUserCommentsComponent } from './comps/public-profile/public-user-comments/public-user-comments.component';
import { PublicUserGalleryComponent } from './comps/public-profile/public-user-gallery/public-user-gallery.component';
import { PublicUserServicesComponent } from './comps/public-profile/public-user-services/public-user-services.component';
import { PublicUserEventsComponent } from './comps/public-profile/public-user-events/public-user-events.component';
import { ServiceBookingComponent } from './comps/action-components/service-booking/service-booking.component';
import { UserBookingsComponent } from './comps/account/user-bookings/user-bookings.component';
import { ManageEventComponent } from './comps/account/user-events/manage-event/manage-event.component';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { AboutComponent } from './comps/basic/about/about.component';
import { ContactUsComponent } from './comps/basic/contact-us/contact-us.component';

export const appRoutes: Route[] = [
  {path: '', component: HomeComponent},
  {path: 'login', component: AuthComponent},
  {path: 'register', component: AuthComponent},
  {path: 'about_us', component: AboutComponent},
  {path: 'contact_us', component: ContactUsComponent},
  {path: 'reset', component: AuthComponent},
  {path: 'my_account', component: AccountComponent, canActivate: [AuthGuardService], children: [
    {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
    {path: 'dashboard', component: UserDashComponent, data: {pageTitle: 'tenant.home.title'}},
    {path: 'profile_edit', component: UserProfileComponent},
    {path: 'events', component: UserEventsComponent},
    {path: 'events/:mode', component: ManageEventComponent, canDeactivate: [CanDeactivateGuardService]},
    {path: 'events/:mode/:id', component: ManageEventComponent, canDeactivate: [CanDeactivateGuardService]},
    {path: 'prospects', component: UserProspectsComponent},
    {path: 'gallery', component: UserGalleryComponent},
    {path: 'services', component: UserServicesComponent},
    {path: 'services/:mode', component: UserServicesComponent},
    {path: 'services/:mode/:id', component: UserServicesComponent},
    {path: 'notifications', component: UserNotificationsComponent},
    {path: 'notifications/:id', component: UserNotificationsComponent},
    {path: 'bookings', component: UserBookingsComponent},
  ]},
  {path: 'user/:uid', component: PublicProfileComponent, children: [
    {path: '', pathMatch: 'full', redirectTo: 'feed'},
    {path: 'feed', component: PublicUserFeedComponent},
    {path: 'about', component: PublicUserAboutComponent},
    {path: 'comments', component: PublicUserCommentsComponent},
    {path: 'comments/:id', component: PublicUserCommentsComponent},
    {path: 'gallery', component: PublicUserGalleryComponent},
    {path: 'services', component: PublicUserServicesComponent},
    // {path: 'services/:serviceId', component: PublicUserServicesComponent},
    {path: 'events', component: PublicUserEventsComponent},
    {path: 'events/:id', component: PublicUserEventsComponent},
  ]},
  {path: 'order/:servProvId/:servId', component: ServiceBookingComponent, canActivate: [AuthGuardService]}
];
