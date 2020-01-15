import { fakeAsync, inject, tick, async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { TripModel } from './../models/trip.model';
import { UserModel } from './../models/user.model';

// components imports
import { AdminComponent } from './../admin/admincomponent/admincomponent.component';
import { AdminAddTripComponent } from './../admin/admincomponent/admin-add-trip/admin-add-trip.component';
import { AdminRemoveTripComponent } from './../admin/admincomponent/admin-remove-trip/admin-remove-trip.component';
import { LoginComponent } from './../auth/login/login.component';
import { SignupComponent } from './../auth/signup/signup.component';
import { AppViewComponent } from './../app-view/app-view.component';
import { TripsComponent } from './../trips/trips.component';
import { HeaderComponent } from './header.component';
import { UserBasketComponent } from './../user-basket/user-basket.component';
import { TripcarddetailsComponent } from './../trips/tripcarddetails/tripcarddetails.component';
import { TripsFilterCriteriaComponent } from './../trips/trips-filter-criteria/trips-filter-criteria.component';
import { TripDetailedViewComponent } from './../trips/trip-detailed-view/trip-detailed-view.component';
import { FooterComponent } from './../footer/footer.component';
import { UserHistoryComponent } from './../user-history/user-history.component';



// servies imports
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



import { MockData } from './../mockdata';
import { environment } from './../../environments/environment';


// mock firebase data service class
class MockAuthService {

    authChange = new Subject<boolean>();
    roleChange = new Subject<string>();

    private isAuthenticated = false;
    private currentUserId: string;
    private currentUserRole: string;

    constructor() {
    }


   loginUser(user: UserModel) {

     if (user.email === 'admin@admin.com') {
       this.currentUserRole = 'admin';
       this.currentUserId = 'test';
       this.authSuccessfully();
     }

     if (user.email === 'test@test.com') {
       this.currentUserRole = 'user';
       this.currentUserId = 'test';
       this.authSuccessfully();
     }

  }

  logout() {
    this.currentUserRole = 'none';
    this.isAuthenticated = false;
    this.authChange.next(false);
    this.roleChange.next('none');
  }

   private authSuccessfully() {
      this.isAuthenticated = true;
      this.authChange.next(true);
      this.roleChange.next(this.currentUserRole);
   }


}


describe('Header Component and Auth Service', () => {

  // admin component and admin component fixture
  let headerComponent: HeaderComponent;
  let headerComponentFixture: ComponentFixture<HeaderComponent>;
  let headerComponentDebugElement: DebugElement;

  // mock backend firebase service
  let mockAuthService: MockAuthService;

  beforeEach(async( () => {

    mockAuthService = new MockAuthService();

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
        TripsService,
        BasketService,
        { provide: AuthService, useValue: mockAuthService},
        CommentsService,
        UserHistoryService
      ]
    })
      .compileComponents()
      .then( () => {

        headerComponentFixture = TestBed.createComponent(HeaderComponent);
        headerComponent = headerComponentFixture.componentInstance;
        headerComponentDebugElement = headerComponentFixture.debugElement;

      });

  }));


  it('should create component',  fakeAsync( () => {

    headerComponent.ngOnInit();

    expect(headerComponent).toBeTruthy();

  }));


  it('should dispay menu for anathorised users', () => {

    headerComponent.ngOnInit();

    const menuItems = headerComponentDebugElement.queryAll(By.css('.nav-item'));

    expect(headerComponent.isAdmin).toBe(false);
    expect(headerComponent.isAuth).toBe(false);

    // expect(menuItems.length).toBe(2);
    // console.log(menuItems);

  });


  it('should dispay menu for logged admin', fakeAsync( () => {

    headerComponent.ngOnInit();

    const menuItems = headerComponentDebugElement.queryAll(By.css('.nav-item'));

    mockAuthService.loginUser({
      userId: '1234',
      email: 'admin@admin.com',
      password: 'adminadmin',
      role: 'admin'
    });

    tick();

    expect(headerComponent.isAdmin).toBe(true);
    expect(headerComponent.isAuth).toBe(true);

    //expect(menuItems.length).toBe(5);
    // console.log(menuItems);

  }));


  it('should dispay menu for logged user', fakeAsync( () => {

    headerComponent.ngOnInit();

    const menuItems = headerComponentDebugElement.queryAll(By.css('.nav-item'));

    mockAuthService.loginUser({
      userId: '1234',
      email: 'test@test.com',
      password: 'test',
      role: 'user'
    });

    tick();

    expect(headerComponent.isAdmin).toBe(false);
    expect(headerComponent.isAuth).toBe(true);

    //expect(menuItems.length).toBe(5);
    // console.log(menuItems);

  }));



  it('should dispay menu after user logout', fakeAsync( () => {

    headerComponent.ngOnInit();

    const menuItems = headerComponentDebugElement.queryAll(By.css('.nav-item'));

    mockAuthService.loginUser({
      userId: '1234',
      email: 'test@test.com',
      password: 'test',
      role: 'user'
    });

    tick();

    headerComponent.onLogout();

    tick();

    headerComponentFixture.detectChanges();

    expect(headerComponent.isAdmin).toBe(false);
    expect(headerComponent.isAuth).toBe(false);

    //expect(menuItems.length).toBe(5);
    // console.log(menuItems);

  }));







});
