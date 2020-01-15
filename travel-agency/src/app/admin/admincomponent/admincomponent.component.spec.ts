import { fakeAsync, inject, tick, async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { TripModel } from './../../models/trip.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

// components imports
import { AdminComponent } from './admincomponent.component';
import { AdminAddTripComponent } from './admin-add-trip/admin-add-trip.component';
import { AdminRemoveTripComponent } from './admin-remove-trip/admin-remove-trip.component';
import { LoginComponent } from './../../auth/login/login.component';
import { SignupComponent } from './../../auth/signup/signup.component';
import { AppViewComponent } from './../../app-view/app-view.component';
import { TripsComponent } from './../../trips/trips.component';
import { HeaderComponent } from './../../header/header.component';
import { UserBasketComponent } from './../../user-basket/user-basket.component';
import { TripcarddetailsComponent } from './../../trips/tripcarddetails/tripcarddetails.component';
import { TripsFilterCriteriaComponent } from './../../trips/trips-filter-criteria/trips-filter-criteria.component';
import { TripDetailedViewComponent } from './../../trips/trip-detailed-view/trip-detailed-view.component';
import { FooterComponent } from './../../footer/footer.component';
import { UserHistoryComponent } from './../../user-history/user-history.component';



// servies imports
import { TripsService } from 'src/app/trips.service';
import { AuthService } from './../../auth/auth.service';
import { CommentsService } from './../../comments.service';
import { UserHistoryService } from './../../user-history.service';
import { BasketService } from './../../basket.service';

// modules imports
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './../../app-routing.module';


import { MockData } from './../../mockdata';
import { environment } from './../../../environments/environment';


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


xdescribe('Admin Component and Trips Service', () => {

  // admin component and admin component fixture
  let adminComponent: AdminComponent;
  let adminComponentFixture: ComponentFixture<AdminComponent>;
  let adminComponentDebugElement: DebugElement;

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

        adminComponentFixture = TestBed.createComponent(AdminComponent);
        adminComponent = adminComponentFixture.componentInstance;
        adminComponentDebugElement = adminComponentFixture.debugElement;

      });

  }));


  it('should initialize all trips',  fakeAsync( () => {

    adminComponent.ngOnInit();

    tick();

    adminComponentFixture.detectChanges();
    expect(adminComponent.allTrips).toBeTruthy();

  }));


  it('should receive all trips from trips service',  fakeAsync( () => {

    adminComponent.ngOnInit();

    tick();

    adminComponentFixture.detectChanges();

    expect(adminComponent.allTrips.length).toBe(8, 'trips received');

  }));



  it('should add new trip', fakeAsync( () => {

    const newTrip: TripModel = MockData.tripsDataSource[0];

    adminComponent.onNewTripAddedReceived(newTrip);

    tick();

    adminComponentFixture.detectChanges();

    expect(adminComponent.allTrips.length).toBe(9, 'trip added');

  }));


  it('should remove selected trip', fakeAsync( () => {

    adminComponent.ngOnInit();

    const tripToBeRemovedId = '5';

    adminComponent.onTripRemovedReceived(tripToBeRemovedId);

    tick();

    expect(adminComponent.allTrips.find(trip => trip.id === '5')).not.toBeTruthy();

  }));


  it('should display trips in the DOM', fakeAsync( () => {

    adminComponent.ngOnInit();

    tick();

    adminComponentFixture.detectChanges();

    // console.log(adminComponentDebugElement.nativeElement);
    const rows = adminComponentDebugElement.queryAll(By.css('tr'));

    // expect(adminComponentDebugElement.nativeElement.querySelector('h1').textContent).toContain('Admin panel');
    expect(rows.length).toBe(10);

    const rowContent = rows[3].nativeElement.textContent;
    expect(rowContent).toContain('WILD');
    // expect(true).toBeTruthy();

  }));





});
