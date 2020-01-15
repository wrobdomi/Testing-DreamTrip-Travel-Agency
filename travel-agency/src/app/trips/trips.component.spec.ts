// import test utilities
import { fakeAsync, inject, tick, async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

// components imports
import { AdminComponent } from './../admin/admincomponent/admincomponent.component';
import { AdminAddTripComponent } from './../admin/admincomponent/admin-add-trip/admin-add-trip.component';
import { AdminRemoveTripComponent } from './../admin/admincomponent/admin-remove-trip/admin-remove-trip.component';
import { LoginComponent } from './../auth/login/login.component';
import { SignupComponent } from './../auth/signup/signup.component';
import { AppViewComponent } from './../app-view/app-view.component';
import { TripsComponent } from './../trips/trips.component';
import { HeaderComponent } from './../header/header.component';
import { UserBasketComponent } from './../user-basket/user-basket.component';
import { TripcarddetailsComponent } from './../trips/tripcarddetails/tripcarddetails.component';
import { TripsFilterCriteriaComponent } from './../trips/trips-filter-criteria/trips-filter-criteria.component';
import { TripDetailedViewComponent } from './../trips/trip-detailed-view/trip-detailed-view.component';
import { FooterComponent } from './../footer/footer.component';
import { UserHistoryComponent } from './../user-history/user-history.component';

// services imports
import { TripsService } from 'src/app/trips.service';
import { AuthService } from './../auth/auth.service';
import { CommentsService } from './../comments.service';
import { UserHistoryService } from './../user-history.service';
import { BasketService } from './../basket.service';

// modules imports
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './../app-routing.module';

// models imports
import { TripModel } from './../models/trip.model';
import { TripInBasket } from './../models/tripinbasket.model';

// other
import { MockData } from './../mockdata';
import { environment } from './../../environments/environment';


// mock firebase data service class
class MockTripsService {

    mockTrips: TripModel[];

    private tripsBehaviourSubject = new BehaviorSubject<TripModel[]>([]);
    readonly tripsObservable = this.tripsBehaviourSubject.asObservable();

    constructor() {
        this.mockTrips = MockData.tripsDataSource;
    }

    getAllProducts() {
      this.tripsBehaviourSubject.next(this.mockTrips);
    }

    addProduct(newTrip: TripModel) {
      this.mockTrips.push(newTrip);
      this.tripsBehaviourSubject.next(this.mockTrips);
    }

    deleteProduct(tripId: string) {
      this.mockTrips = this.mockTrips.filter(trip => trip.id !== tripId);
      this.tripsBehaviourSubject.next(this.mockTrips);
    }


    updateProductBookingsNumber(tripId, howMany) {
      const currentBookings = this.mockTrips
        .find(t => t.id === tripId)
        .bookedTrips;

      const newBookings = currentBookings + howMany;

      this.mockTrips
        .find(t => t.id === tripId)
        .bookedTrips = newBookings;

      this.tripsBehaviourSubject.next(this.mockTrips);
    }
}



// mock basket service
class MockBasketService {

  tripsInBasketMap: Map<string, TripInBasket> = new Map();

  basketMapBehaviourSubject = new BehaviorSubject<Map<string, TripInBasket>>(new Map());
  readonly basketMapObservable = this.basketMapBehaviourSubject.asObservable();

  addToBasket( tripId: string, tripInBasket: TripInBasket) {

    if (this.tripsInBasketMap.has(tripId)) {
      const tib = this.tripsInBasketMap.get(tripId);
      tib.allBooked = tib.allBooked + 1;
      this.tripsInBasketMap.set(tripId, tib);
    } else {
      this.tripsInBasketMap.set(tripId, tripInBasket);
    }

    this.basketMapBehaviourSubject.next(this.tripsInBasketMap);

  }


  removeFromBasket(tripId: string, tripInBasket: TripInBasket) {

    if ( this.tripsInBasketMap.get(tripId).allBooked === 1) {
      this.tripsInBasketMap.delete(tripId);
    } else {
      const tib = this.tripsInBasketMap.get(tripId);
      tib.allBooked = tib.allBooked - 1;
      this.tripsInBasketMap.set(tripId, tib);
    }

    this.basketMapBehaviourSubject.next(this.tripsInBasketMap);
  }

  isInBasket(tripId: string) {

    if (this.tripsInBasketMap.has(tripId)) {
      return true;
    } else {
      return false;
    }

  }

}


describe('Trips Component and Trips Service', () => {

  // trips component and trips component fixture
  let tripsComponent: TripsComponent;
  let tripsComponentFixture: ComponentFixture<TripsComponent>;
  let tripsComponentDebugElement: DebugElement;

  // mock services
  let mockTripsService: MockTripsService;
  let mockBasketService: MockBasketService;

  beforeEach(async( () => {

    mockTripsService = new MockTripsService();
    mockBasketService = new MockBasketService();

    TestBed.configureTestingModule({
      declarations: [
        AdminComponent,
        AdminAddTripComponent,
        AdminRemoveTripComponent,
        LoginComponent,
        SignupComponent,
        AppViewComponent,
        TripsComponent,
        HeaderComponent,
        UserBasketComponent,
        TripcarddetailsComponent,
        TripsFilterCriteriaComponent,
        TripDetailedViewComponent,
        FooterComponent,
        UserHistoryComponent
        ],
      imports: [
        BrowserModule,
        NgbModule,
        AngularFireAuthModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule
      ],
      providers: [
        { provide: TripsService, useValue: mockTripsService},
        { provide: BasketService, useValue: mockBasketService},
        AuthService,
        CommentsService,
        UserHistoryService
      ]
    })
      .compileComponents()
      .then( () => {

        tripsComponentFixture = TestBed.createComponent(TripsComponent);
        tripsComponent = tripsComponentFixture.componentInstance;
        tripsComponentDebugElement = tripsComponentFixture.debugElement;

      });

  }));


  it('should create trips component',  fakeAsync( () => {

    tripsComponent.ngOnInit();

    expect(tripsComponent).toBeTruthy();

  }));


  it('should find min and max trips price',  fakeAsync( () => {

    tripsComponent.ngOnInit();

    tripsComponentFixture.detectChanges();

    tripsComponent.getTripsMaxPrice();
    tripsComponent.getTripsMinPrice();

    expect(tripsComponent.tripsMaxPrice).toBe(4000);
    expect(tripsComponent.tripsMinPrice).toBe(200);

  }));


  it('should find all booked trips number',  fakeAsync( () => {

    tripsComponent.ngOnInit();

    tripsComponentFixture.detectChanges();

    tripsComponent.getAllBookedTripsNumber();

    expect(tripsComponent.allBookedTripsNumber).toBe(10);

  }));


  it('should show filtering criteria panel',  fakeAsync( () => {

    tripsComponent.ngOnInit();

    tripsComponentFixture.detectChanges();

    expect(tripsComponent.showFilterCriteria).toBe(true);

    tripsComponent.showFilterCriteriaPanel();

    expect(tripsComponent.showFilterCriteria).toBe(false);

  }));



  it('should add trip to user basket',  fakeAsync( () => {

    tripsComponent.ngOnInit();

    tripsComponentFixture.detectChanges();

    tripsComponent.onTripAddedToBasketReceived(tripsComponent.tripsArray[0]);

    tick();

    expect(tripsComponent.tripsArray[0].bookedTrips).toBe(4);

    expect(mockBasketService.tripsInBasketMap.size).toBe(1);

    tripsComponent.onTripAddedToBasketReceived(tripsComponent.tripsArray[0]);

    tick();

    expect(mockBasketService.tripsInBasketMap.size).toBe(1);
    expect(tripsComponent.tripsArray[0].bookedTrips).toBe(5);

  }));


  it('should remove trip to user basket',  fakeAsync( () => {

    tripsComponent.ngOnInit();

    // add trips to basket first
    tripsComponent.onTripAddedToBasketReceived(tripsComponent.tripsArray[5]);
    tripsComponent.onTripAddedToBasketReceived(tripsComponent.tripsArray[5]);

    tripsComponentFixture.detectChanges();

    tripsComponent.onTripRemovedFromBasketReceived(tripsComponent.tripsArray[5]);

    tick();

    expect(tripsComponent.tripsArray[5].bookedTrips).toBe(1);
    expect(mockBasketService.tripsInBasketMap.size).toBe(1);

    tripsComponent.onTripRemovedFromBasketReceived(tripsComponent.tripsArray[5]);

    tick();

    expect(mockBasketService.tripsInBasketMap.size).toBe(0);
    expect(tripsComponent.tripsArray[5].bookedTrips).toBe(0);

  }));




});
