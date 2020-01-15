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


describe('Admin Add Component form validation', () => {

  // admin component and admin component fixture
  let adminAddComponent: AdminAddTripComponent;
  let adminAddComponentFixture: ComponentFixture<AdminAddTripComponent>;
  let adminAddComponentDebugElement: DebugElement;

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

        adminAddComponentFixture = TestBed.createComponent(AdminAddTripComponent);
        adminAddComponent = adminAddComponentFixture.componentInstance;
        adminAddComponentDebugElement = adminAddComponentFixture.debugElement;

      });

  }));


  it('should validate empty form',  fakeAsync( () => {

    adminAddComponent.ngOnInit();
    expect(adminAddComponent.addTripModelForm.valid).toBeFalsy();

  }));

  it('should disable submit button', () => {

    adminAddComponent.ngOnInit();
    adminAddComponentFixture.detectChanges();

    const buttons = adminAddComponentDebugElement.queryAll(By.css('.btn-primary'));
    // console.log(buttons[0].nativeElement.outerHTML);
    expect(buttons[0].nativeElement.disabled).toBeTruthy();

  });


  it('should validate name field', () => {

    adminAddComponent.ngOnInit();
    adminAddComponentFixture.detectChanges();

    let name = adminAddComponent.addTripModelForm.controls['name'];

    expect(name.valid).toBeFalsy();

    let errors = {};
    errors = name.errors || {};
    expect(errors['required']).toBeTruthy();


    name.setValue('Su');
    errors = name.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeTruthy();


    name.setValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    errors = name.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
    expect(errors['maxlength']).toBeTruthy();

    name.setValue('Super cool trip');
    errors = name.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
    expect(errors['maxlength']).toBeFalsy();

  });



  it('should validate date field', () => {

    adminAddComponent.ngOnInit();
    adminAddComponentFixture.detectChanges();

    let date = adminAddComponent.addTripModelForm.controls['startDate'];

    expect(date.valid).toBeFalsy();

    let errors = {};
    errors = date.errors || {};
    expect(errors['required']).toBeTruthy();


    date.setValue('06/07/2019');
    errors = date.errors || {};
    expect(errors['required']).toBeFalsy();

  });


  it('should validate price field', () => {

    adminAddComponent.ngOnInit();
    adminAddComponentFixture.detectChanges();

    let price = adminAddComponent.addTripModelForm.controls['price'];

    expect(price.valid).toBeFalsy();

    let errors = {};
    errors = price.errors || {};
    expect(errors['required']).toBeTruthy();


    price.setValue(-20);
    errors = price.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['min']).toBeTruthy();

    price.setValue(100000000);
    errors = price.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['min']).toBeFalsy();
    expect(errors['max']).toBeTruthy();

    price.setValue(2000);
    errors = price.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['min']).toBeFalsy();
    expect(errors['max']).toBeFalsy();


  });


  it('should validate submit', () => {

    adminAddComponent.ngOnInit();
    adminAddComponentFixture.detectChanges();

    expect(adminAddComponent.addTripModelForm.valid).toBeFalsy();

    const sampleTrip = MockData.tripsDataSource[0];

    adminAddComponent.addTripModelForm.controls['name'].setValue(sampleTrip.name);
    adminAddComponent.addTripModelForm.controls['country'].setValue(sampleTrip.countryDestination);
    adminAddComponent.addTripModelForm.controls['price'].setValue(sampleTrip.price);
    adminAddComponent.addTripModelForm.controls['startDate'].setValue(sampleTrip.tripStarts);
    adminAddComponent.addTripModelForm.controls['endDate'].setValue(sampleTrip.tripEnds);
    adminAddComponent.addTripModelForm.controls['maxAvailableTrips'].setValue(sampleTrip.maxAvailableBookings);
    adminAddComponent.addTripModelForm.controls['tripDescription'].setValue(sampleTrip.description);

    adminAddComponentFixture.detectChanges();

    let receivedTrip: TripModel;
    adminAddComponent.newTripAdded.subscribe( (newtrip) => receivedTrip = newtrip);

    adminAddComponent.onAddTripFormSubmit(adminAddComponent.addTripModelForm);

    expect(receivedTrip.name).toBe('Romantic Story');

  });

});
