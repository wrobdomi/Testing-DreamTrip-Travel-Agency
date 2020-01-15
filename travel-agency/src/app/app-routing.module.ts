import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TripsComponent } from './trips/trips.component';
import { UserBasketComponent } from './user-basket/user-basket.component';
import { AdminComponent } from './admin/admincomponent/admincomponent.component';
import { TripDetailedViewComponent } from './trips/trip-detailed-view/trip-detailed-view.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { UserHistoryComponent } from './user-history/user-history.component';
import { AdminGuard } from './auth/admin.guard';

const routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'trips', component: TripsComponent, canActivate: [AuthGuard]},
  {path: 'trip/:id', component: TripDetailedViewComponent, canActivate: [AuthGuard]},
  {path: 'basket', component: UserBasketComponent, canActivate: [AuthGuard]},
  {path: 'history', component: UserHistoryComponent, canActivate: [AuthGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard,
    AdminGuard
  ]
})
export class AppRoutingModule { }
