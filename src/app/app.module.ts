import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//  Import for forms module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { OwlModule } from 'ngx-owl-carousel';
import { CarouselModule } from 'ngx-owl-carousel-o';

//  Router imports
import { appRoutes } from './routes';
import { RouterModule } from '@angular/router';

// Import for Angular firebase
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';

// Import for time picker plugin
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

// Import for Scroll to plugin
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

// Quill imports
import { QuillModule } from 'ngx-quill';


// https://www.npmjs.com/package/ngx-page-scroll
// https://github.com/Nolanus/ngx-page-scroll/blob/HEAD/README.md
// import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';

// Imports for hammer Js touch events
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
declare var Hammer;

// Import for Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import {
  MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule, MatCardModule,
  MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatDividerModule, MatExpansionModule,
  MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule,
  MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule,
  MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatTreeModule, MAT_CHIPS_DEFAULT_OPTIONS,
} from '@angular/material';

// Pipes imports
import { DefaultPipe } from './pipes/default.pipe';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { AvatarImgPipe } from './pipes/avatar-img.pipe';
import { FromNowPipe } from './pipes/from-now.pipe';
import { FilterKeysPipe } from './pipes/filter-keys.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

// Service imports
import { FireService } from './services/fire.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { DataService } from './services/data.service';
import { CusService } from './services/cus.service';
import { AppDefService } from './services/app-def.service';
import { UserFollowService } from './services/user-follow.service';
import { ProfileViewService } from './services/profile-view.service';
import { PriceCalcService } from './services/price-calc.service';

// Component  & services imports
import { AppComponent } from './app.component';
import { AuthComponent } from './comps/basic/auth/auth.component';
import { NavigationComponent } from './comps/basic/navigation/navigation.component';
import { HomeComponent } from './comps/home/home.component';
import { AccountComponent } from './comps/account/account.component';
import { SideblockComponent } from './comps/account/sideblock/sideblock.component';
import { MainblockComponent } from './comps/account/mainblock/mainblock.component';
import { UserDashComponent } from './comps/account/user-dash/user-dash.component';
import { UserProfileComponent } from './comps/account/user-profile/user-profile.component';
import { UserEventsComponent } from './comps/account/user-events/user-events.component';
import { UserProspectsComponent } from './comps/account/user-prospects/user-prospects.component';
import { UserGalleryComponent } from './comps/account/user-gallery/user-gallery.component';
import { UserServicesComponent } from './comps/account/user-services/user-services.component';
import { UserNotificationsComponent } from './comps/account/user-notifications/user-notifications.component';
import { ChipInputComponent } from './c-comps/chip-input/chip-input.component';
import { MatSpinnerComponent } from './c-comps/mat-spinner/mat-spinner.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserProspectCardComponent } from './c-snippets/user-prospect-card/user-prospect-card.component';
import { PublicProfileComponent } from './comps/public-profile/public-profile.component';
import { PublicUserFeedComponent } from './comps/public-profile/public-user-feed/public-user-feed.component';
import { PublicUserGalleryComponent } from './comps/public-profile/public-user-gallery/public-user-gallery.component';
import { PublicUserCommentsComponent } from './comps/public-profile/public-user-comments/public-user-comments.component';
import { PublicUserAboutComponent } from './comps/public-profile/public-user-about/public-user-about.component';
import { PublicUserEventsComponent } from './comps/public-profile/public-user-events/public-user-events.component';
import { PublicUserServicesComponent } from './comps/public-profile/public-user-services/public-user-services.component';
import { CommentSnippetComponent } from './c-snippets/comment-snippet/comment-snippet.component';
import { NotificationPrevLinkComponent } from './c-snippets/notification-prev-link/notification-prev-link.component';
import { NotificationCardComponent } from './c-snippets/notification-card/notification-card.component';
import { ServiceCardWideComponent } from './c-snippets/service-card-wide/service-card-wide.component';
import { ServiceListCardPublicComponent } from './c-snippets/service-list-card-public/service-list-card-public.component';
import { ServiceCardPublicLargeComponent } from './c-snippets/service-card-public-large/service-card-public-large.component';
import { ServiceBookingComponent } from './comps/action-components/service-booking/service-booking.component';
import { CalendarComponent } from './c-comps/calendar/calendar.component';
import { PaypalPaymentComponent } from './comps/action-components/paypal-payment/paypal-payment.component';
import { MinuteTimePipe } from './pipes/minute-time.pipe';
import { BusinessDayService } from './services/business-day.service';
import { UserBookingsComponent } from './comps/account/user-bookings/user-bookings.component';
import { BookingsListCardComponent } from './c-snippets/bookings-list-card/bookings-list-card.component';
import { BookingStatusPipe } from './pipes/booking-status.pipe';
import { PayeeRecieptComponent } from './c-snippets/payee-reciept/payee-reciept.component';
import { PaymentSettlementRecieptComponent } from './c-snippets/payment-settlement-reciept/payment-settlement-reciept.component';
import { ChatBoxComponent } from './comps/chat-box/chat-box.component';
import { ChatListComponent } from './comps/chat-box/chat-list/chat-list.component';
import { ChatPannelComponent } from './comps/chat-box/chat-pannel/chat-pannel.component';
import { ChatListItemComponent } from './comps/chat-box/chat-list-item/chat-list-item.component';
import { ChatBoxHeaderComponent } from './comps/chat-box/chat-box-header/chat-box-header.component';
import { UserGalleryViewComponent } from './c-snippets/user-gallery-view/user-gallery-view.component';
import { FancyTimePipe } from './pipes/fancy-time.pipe';
import { GalleryScrollerComponent } from './c-snippets/gallery-scroller/gallery-scroller.component';
import { GalleryImgPipe } from './pipes/gallery-img.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MessagingService } from './services/messaging.service';
import { ManageEventComponent } from './comps/account/user-events/manage-event/manage-event.component';
import { DateTimePickerComponent } from './c-comps/date-time-picker/date-time-picker.component';
import { DevService } from './services/dev.service';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { VenueEventCardComponent } from './c-snippets/venue-event-card/venue-event-card.component';
import { EventPublicCardComponent } from './c-snippets/event-public-card/event-public-card.component';
import { VenueEventService } from './services/venue-event.service';
import { HomeHeaderComponent } from './comps/headers/home-header/home-header.component';
import { HeaderTwoComponent } from './c-snippets/headers/header-two/header-two.component';
import { ContactUsComponent } from './comps/basic/contact-us/contact-us.component';
import { AboutComponent } from './comps/basic/about/about.component';
import { TermsNConditionsComponent } from './comps/basic/terms-n-conditions/terms-n-conditions.component';
import { FootersComponent } from './comps/basic/footers/footers.component';
import { HomeMobileHeaderComponent } from './c-snippets/headers/home-mobile-header/home-mobile-header.component';
import { OrientationSnippetComponent } from './c-snippets/orientation-snippet/orientation-snippet.component';
import { HomeLgComponent } from './comps/home/home-lg/home-lg.component';
import { HomeMdComponent } from './comps/home/home-md/home-md.component';
import { HomeSmComponent } from './comps/home/home-sm/home-sm.component';
import { AppEventsService } from './services/app-events.service';
import { TestimonialsDataService } from './services/home-services/testimonials/testimonials-data.service';
import { TestimonialCardComponent } from './comps/home/home-snippets/testimonial-card/testimonial-card.component';
import { FooterLgComponent } from './comps/basic/footers/footer-lg/footer-lg.component';
import { WriteToUsComponent } from './c-snippets/write-to-us/write-to-us.component';
import { DashboardHeaderLgComponent } from './c-snippets/headers/dashboard-header/dashboard-header-lg/dashboard-header-lg.component';
import { DashboardHeaderComponent } from './c-snippets/headers/dashboard-header/dashboard-header.component';
import { DocumentTitleService } from './services/document-title.service';
import { ResponsiveHeaderComponent } from './comps/headers/responsive-home-header/responsive-home-header.component';
import { HomeHeaderLgComponent } from './comps/headers/home-header-lg/home-header-lg.component';
import { HomeHeaderSmComponent } from './comps/headers/home-header-sm/home-header-sm.component';
import { HomeHeaderMdComponent } from './comps/headers/home-header-md/home-header-md.component';
import { ChooseAccountCardComponent } from './c-snippets/choose-account-card/choose-account-card.component';
import { AboutLgComponent } from './comps/basic/about/about-lg/about-lg.component';
import { AboutMdComponent } from './comps/basic/about/about-md/about-md.component';
import { AboutSmComponent } from './comps/basic/about/about-sm/about-sm.component';
import { DashboardHeaderMdComponent } from './c-snippets/headers/dashboard-header/dashboard-header-md/dashboard-header-md.component';
import { DashboardHeaderSmComponent } from './c-snippets/headers/dashboard-header/dashboard-header-sm/dashboard-header-sm.component';
import { DashboardSidenavToggleService } from './services/dashboard-sidenav-toggle.service';
import { BottomNavComponent } from './comps/bottom-nav/bottom-nav.component';

// Exports for hammer to work
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    // override hammerjs default configuration
    'swipe': { direction: Hammer.DIRECTION_HORIZONTAL, touchAction: 'auto' },
    'pinch': { enable: false },
    'rotate': { enable: false },
    'pan': { enable: false }
    // // touchAction: 'auto',
    // swipe: {velocity: 0.4, threshold: 20, direction: Hammer.DIRECTION_ALL}, // override default settings
    // pinch: { enable: false },
    // rotate: { enable: false }
  }
}
@NgModule({
  imports: [
    A11yModule, ScrollingModule, CdkStepperModule, CdkTableModule,
    CdkTreeModule, DragDropModule, MatAutocompleteModule, MatBadgeModule,
    MatBottomSheetModule, MatButtonModule, MatButtonToggleModule, MatCardModule,
    MatCheckboxModule, MatChipsModule, MatStepperModule, MatDatepickerModule,
    MatDialogModule, MatDividerModule, MatExpansionModule, MatGridListModule,
    MatIconModule, MatInputModule, MatListModule, MatMenuModule,
    MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule,
    MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule,
    MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule,
    MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule,
    MatTreeModule, BrowserModule, BrowserAnimationsModule, RouterModule.forRoot(appRoutes), QuillModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), FormsModule, ReactiveFormsModule,
    ScrollToModule.forRoot(), ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgxMaterialTimepickerModule, CarouselModule, NgxPageScrollModule
  ],
  declarations: [
    AppComponent, AuthComponent, HomeComponent, AccountComponent, NavigationComponent, SideblockComponent,
    MainblockComponent, UserDashComponent, UserProfileComponent, UserEventsComponent, UserProspectsComponent,
    UserGalleryComponent, UserServicesComponent, UserNotificationsComponent, ChipInputComponent, DefaultPipe,
    ShortNumberPipe, MatSpinnerComponent, UserProspectCardComponent, AvatarImgPipe, PublicProfileComponent,
    PublicUserFeedComponent, PublicUserGalleryComponent, PublicUserCommentsComponent, PublicUserAboutComponent,
    PublicUserEventsComponent, PublicUserServicesComponent, CommentSnippetComponent, FromNowPipe,
    NotificationPrevLinkComponent, FilterKeysPipe, NotificationCardComponent, SafeHtmlPipe,
    ServiceCardWideComponent, ServiceListCardPublicComponent, ServiceCardPublicLargeComponent,
    ServiceBookingComponent, CalendarComponent, PaypalPaymentComponent, MinuteTimePipe,
    UserBookingsComponent, BookingsListCardComponent, BookingStatusPipe, PayeeRecieptComponent,
    PaymentSettlementRecieptComponent, ChatBoxComponent, ChatListComponent, ChatPannelComponent,
    ChatListItemComponent, ChatBoxHeaderComponent, UserGalleryViewComponent, FancyTimePipe, GalleryScrollerComponent,
    GalleryImgPipe, ManageEventComponent, DateTimePickerComponent, VenueEventCardComponent, EventPublicCardComponent,
    HomeHeaderComponent, HeaderTwoComponent, ContactUsComponent, AboutComponent, TermsNConditionsComponent,
    FootersComponent, HomeMobileHeaderComponent, OrientationSnippetComponent, HomeLgComponent, HomeMdComponent,
    HomeSmComponent, TestimonialCardComponent, FooterLgComponent, WriteToUsComponent, DashboardHeaderLgComponent, DashboardHeaderComponent, ResponsiveHeaderComponent, HomeHeaderLgComponent, HomeHeaderSmComponent, HomeHeaderMdComponent, ChooseAccountCardComponent, AboutLgComponent, AboutMdComponent, AboutSmComponent, DashboardHeaderMdComponent, DashboardHeaderSmComponent, BottomNavComponent
  ],
  providers: [
    AngularFireAuth, AngularFireDatabase, FireService, AuthService, AuthGuardService, DataService,
    CusService, AppDefService, UserFollowService, ProfileViewService, PriceCalcService, BusinessDayService,
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig}, MessagingService, DevService, CanDeactivateGuardService,
    VenueEventService, AppEventsService, TestimonialsDataService, DocumentTitleService, DashboardSidenavToggleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
