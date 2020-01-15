import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppViewComponent } from './app-view/app-view.component';
import { TripsComponent } from './trips/trips.component';
import { HeaderComponent } from './header/header.component';
import { TripsService } from './trips.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserBasketComponent } from './user-basket/user-basket.component';
import { TripcarddetailsComponent } from './trips/tripcarddetails/tripcarddetails.component';
import { AdminComponent } from './admin/admincomponent/admincomponent.component';
import { AdminRemoveTripComponent } from './admin/admincomponent/admin-remove-trip/admin-remove-trip.component';
import { AdminAddTripComponent } from './admin/admincomponent/admin-add-trip/admin-add-trip.component';
import { BasketService } from './basket.service';
import { TripsFilterCriteriaComponent } from './trips/trips-filter-criteria/trips-filter-criteria.component';
import { AppRoutingModule } from './app-routing.module';
import { TripDetailedViewComponent } from './trips/trip-detailed-view/trip-detailed-view.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthService } from './auth/auth.service';
import { FooterComponent } from './footer/footer.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { CommentsService } from './comments.service';
import { UserHistoryService } from './user-history.service';



@NgModule({
  declarations: [
    AppViewComponent,
    TripsComponent,
    HeaderComponent,
    UserBasketComponent,
    TripcarddetailsComponent,
    AdminComponent,
    AdminAddTripComponent,
    AdminRemoveTripComponent,
    TripsFilterCriteriaComponent,
    TripDetailedViewComponent,
    LoginComponent,
    SignupComponent,
    FooterComponent,
    UserHistoryComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [TripsService, BasketService, AuthService, CommentsService, UserHistoryService],
  bootstrap: [AppViewComponent]
})
export class AppModule { }
