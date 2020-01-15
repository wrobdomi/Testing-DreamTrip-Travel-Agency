import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserHistoryService } from '../user-history.service';
import { Subscription } from 'rxjs';
import { OrderModel } from '../models/order.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})
export class UserHistoryComponent implements OnInit, OnDestroy {

  private ordersSubscription: Subscription;
  ordersArray: OrderModel[];

  constructor(private userHistoryService: UserHistoryService, private authService: AuthService) { }

  ngOnInit() {

    // subscribe to service trips array
    this.ordersSubscription = this.userHistoryService.ordersObservable.subscribe(
      res => {
        this.ordersArray = res;
      },
      error => console.log('Can not load trips array from service')
    );

    // service subscribes to db, fills its table with products adn emits
    this.userHistoryService.getUserOrders(this.authService.getCurrentUserId());

  }

  ngOnDestroy() {
    this.ordersSubscription.unsubscribe();
  }

}
