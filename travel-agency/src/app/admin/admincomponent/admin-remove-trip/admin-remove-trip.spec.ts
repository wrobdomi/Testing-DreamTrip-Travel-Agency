import { fakeAsync, inject, tick, async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { TripModel } from './../../../models/trip.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

// components imports
import { AdminComponent } from './../admincomponent.component';
import { AdminAddTripComponent } from './../admin-add-trip/admin-add-trip.component';
import { AdminRemoveTripComponent } from './../admin-remove-trip/admin-remove-trip.component';
import { LoginComponent } from './../../../auth/login/login.component';
import { SignupComponent } from './../../../auth/signup/signup.component';
import { AppViewComponent } from './../../../app-view/app-view.component';
import { TripsComponent } from './../../../trips/trips.component';
import { HeaderComponent } from './../../../header/header.component';
import { UserBasketComponent } from './../../../user-basket/user-basket.component';
import { TripcarddetailsComponent } from './../../../trips/tripcarddetails/tripcarddetails.component';
import { TripsFilterCriteriaComponent } from './../../../trips/trips-filter-criteria/trips-filter-criteria.component';
import { TripDetailedViewComponent } from './../../../trips/trip-detailed-view/trip-detailed-view.component';
import { FooterComponent } from './../../../footer/footer.component';
import { UserHistoryComponent } from './../../../user-history/user-history.component';



// servies imports
import { TripsService } from 'src/app/trips.service';
import { AuthService } from './../../../auth/auth.service';
import { CommentsService } from './../../../comments.service';
import { UserHistoryService } from './../../../user-history.service';
import { BasketService } from './../../../basket.service';

// modules imports
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './../../../app-routing.module';


import { MockData } from './../../../mockdata';
import { environment } from './../../../../environments/environment';


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
}


describe('Admin Remove Component Integration', () => {

  // admin component and admin component fixture
  let adminRemoveComponent: AdminRemoveTripComponent;
  let adminRemoveComponentFixture: ComponentFixture<AdminRemoveTripComponent>;
  let adminRemoveDebugElement: DebugElement;

  // mock backend firebase service
  let mockTripsService: MockTripsService;

  beforeEach(async( () => {

    mockTripsService = new MockTripsService();

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
        BasketService,
        AuthService,
        CommentsService,
        UserHistoryService
      ]
    })
      .compileComponents()
      .then( () => {

        adminRemoveComponentFixture = TestBed.createComponent(AdminRemoveTripComponent);
        adminRemoveComponent = adminRemoveComponentFixture.componentInstance;
        adminRemoveDebugElement = adminRemoveComponentFixture.debugElement;

      });

  }));


  it('should display trip to be removed',  fakeAsync( () => {

    adminRemoveComponent.tripDetail = MockData.tripsDataSource[0];

    adminRemoveComponentFixture.detectChanges();

    const cells = adminRemoveDebugElement.queryAll(By.css('td'));

    const firstCell = cells[0].nativeElement;

    expect(firstCell.textContent).toContain('1');

    // tick();

  }));


  it('should trigger event emitter on remove', () => {

    adminRemoveComponent.tripDetail = MockData.tripsDataSource[0];

    adminRemoveComponentFixture.detectChanges();

    let tripIdToRemove: string;

    adminRemoveComponent.tripRemoved.subscribe((id: string) => tripIdToRemove = id);

    const tripsRemoveButton = adminRemoveDebugElement.queryAll(By.css('button'));

    tripsRemoveButton[0].triggerEventHandler('click', null);

    expect(tripIdToRemove).toBe('1');


  });





});
