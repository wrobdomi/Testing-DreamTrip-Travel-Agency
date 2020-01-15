// import test utilities
import { fakeAsync, inject, tick, async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

// components imports
import { AdminComponent } from './../../admin/admincomponent/admincomponent.component';
import { AdminAddTripComponent } from './../../admin/admincomponent/admin-add-trip/admin-add-trip.component';
import { AdminRemoveTripComponent } from './../../admin/admincomponent/admin-remove-trip/admin-remove-trip.component';
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

// services imports
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

// models imports
import { TripModel } from './../../models/trip.model';
import { FilteringCriteria } from './../../filtering-criteria.model';

// other
import { MockData } from './../../mockdata';
import { environment } from './../../../environments/environment';


// mock firebase data service class
class MockTripsService {

    mockTrips: TripModel[];

    private tripsBehaviourSubject = new BehaviorSubject<TripModel[]>([]);
    readonly tripsObservable = this.tripsBehaviourSubject.asObservable();

    private filteringCriteria: FilteringCriteria = null;

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

  setFilteringCriteria(criteria: FilteringCriteria){
    this.filteringCriteria = criteria;
    this.applyFilteringCriteria();
  }


  applyFilteringCriteria() {

    if (this.filteringCriteria === null) {
      this.tripsBehaviourSubject.next(this.mockTrips);
      return;
    }

    let tripFilteredArray = this.mockTrips;
    let anyCriteria = false;

    if (this.filteringCriteria.priceChecked === true) {
      tripFilteredArray = tripFilteredArray
        .filter(x => x.price > this.filteringCriteria.priceFrom && x.price < this.filteringCriteria.priceTo);
      anyCriteria = true;
    }
    if (this.filteringCriteria.dateChecked === true) {
      let dateArrayFrom = this.filteringCriteria.startDate.split('/');
      let dateArrayTo = this.filteringCriteria.endDate.split('/');

      let startCriteriaDate = new Date(parseInt(dateArrayFrom[0]), parseInt(dateArrayFrom[1]), parseInt(dateArrayFrom[2]));
      let endCriteriaDate = new Date(parseInt(dateArrayTo[0]), parseInt(dateArrayTo[1]), parseInt(dateArrayTo[2]));

      tripFilteredArray =  tripFilteredArray.filter( x => {
        let tripDateArrayFrom = x.tripStarts.split('/');
        let tripDateArrayTo = x.tripEnds.split('/');

        let tripStartDate = new Date(parseInt(tripDateArrayFrom[0]), parseInt(tripDateArrayFrom[1]), parseInt(tripDateArrayFrom[2]));
        let tripEndDate = new Date(parseInt(tripDateArrayTo[0]), parseInt(tripDateArrayTo[1]), parseInt(tripDateArrayTo[2]));

        return (tripStartDate >= startCriteriaDate && tripEndDate <= endCriteriaDate);
      });

      anyCriteria = true;
    }
    if (this.filteringCriteria.ratingChecked === true) {
      tripFilteredArray = tripFilteredArray.filter(x => x.rating > this.filteringCriteria.minRating);
      anyCriteria = true;
    }
    if (this.filteringCriteria.countryChecked === true) {
      const regex =  new RegExp(this.filteringCriteria.countryName + '*', 'i');
      console.log(regex);
      tripFilteredArray = tripFilteredArray.filter(x => regex.test(x.countryDestination));
      anyCriteria = true;
    }

    this.tripsBehaviourSubject.next(tripFilteredArray);

  }


}


describe('Trips Filtering and Trips Service', () => {

  // trips component and trips component fixture
  let filteringComponent: TripsFilterCriteriaComponent;
  let filteringComponentFixture: ComponentFixture<TripsFilterCriteriaComponent>;
  let filteringComponentDebugElement: DebugElement;

  // mock services
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

        filteringComponentFixture = TestBed.createComponent(TripsFilterCriteriaComponent);
        filteringComponent = filteringComponentFixture.componentInstance;
        filteringComponentDebugElement = filteringComponentFixture.debugElement;

      });

  }));


  it('should create filtering component',  fakeAsync( () => {

    filteringComponent.ngOnInit();

    expect(filteringComponent).toBeTruthy();

  }));


  it('should filter by low and high price',  fakeAsync( () => {

    filteringComponent.ngOnInit();
    filteringComponentFixture.detectChanges();

    filteringComponent.filterTripsModelForm.controls['priceChecked'].setValue(true);
    filteringComponent.filterTripsModelForm.controls['dateChecked'].setValue(false);
    filteringComponent.filterTripsModelForm.controls['ratingChecked'].setValue(false);
    filteringComponent.filterTripsModelForm.controls['countryChecked'].setValue(false);
    filteringComponent.filterTripsModelForm.controls['priceFrom'].setValue(999);
    filteringComponent.filterTripsModelForm.controls['priceTo'].setValue(5000);
    filteringComponent.filterTripsModelForm.controls['startDate'].setValue('05/12/2020');
    filteringComponent.filterTripsModelForm.controls['endDate'].setValue('07/12/2020');
    filteringComponent.filterTripsModelForm.controls['minRating'].setValue(2);
    filteringComponent.filterTripsModelForm.controls['countryName'].setValue('Poland');

    filteringComponentFixture.detectChanges();

    let receivedTrips: TripModel[];


    filteringComponent.onApplyFilterFormSubmit(filteringComponent.filterTripsModelForm);

    tick();

    mockTripsService.tripsObservable.subscribe( (trips) => receivedTrips = trips);
    expect(receivedTrips.length).toBe(3);

  }));


});
