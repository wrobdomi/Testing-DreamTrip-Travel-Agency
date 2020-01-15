import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth = false;
  authSubscription: Subscription;

  isAdmin = false;
  roleSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
       this.isAuth = authStatus;
    });

    this.roleSubscription = this.authService.roleChange.subscribe(role => {
      if (role === 'admin') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    });

  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.roleSubscription.unsubscribe();
  }


}
