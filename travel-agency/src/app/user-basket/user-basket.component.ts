import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { TripModel } from '../models/trip.model';
import { BasketService } from '../basket.service';
import { Subscription } from 'rxjs';
import { TripInBasket } from '../models/tripinbasket.model';
import { UserHistoryService } from '../user-history.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-basket',
  templateUrl: './user-basket.component.html',
  styleUrls: ['./user-basket.component.css']
})
export class UserBasketComponent implements OnInit, OnDestroy {

  private basketService: BasketService;
  tripsInBasketMap: Map<string, TripInBasket>;

  private totalPrice;

  private basketSubscription: Subscription;


  constructor(basketService: BasketService, private userHistoryService: UserHistoryService, private router: Router,
              private authService: AuthService) {
    this.basketService = basketService;
  }


  ngOnInit() {

    // subscribe to service trips array
    this.basketSubscription = this.basketService.basketMapObservable.subscribe(
      res => {
        this.tripsInBasketMap = res;
        this.updateTotal();
      },
      error => console.log('Can not load trips array from service')
    );

  }

  ngOnDestroy() {
    this.basketSubscription.unsubscribe();
  }

  updateTotal(): number {
    // console.log('Updating total');
    this.totalPrice = 0;
    this.tripsInBasketMap.forEach((value: TripInBasket, key: string) => {
      this.totalPrice += value.price * value.allBooked;
    });
    return this.totalPrice;
  }

  basketToOrder() {
    const tripsArr = [];
    const tripsNum = [];
    const tripsIdsArr = [];

    this.tripsInBasketMap.forEach((value: TripInBasket, key: string) => {
      tripsArr.push(value.name);
      tripsNum.push(value.allBooked);
      tripsIdsArr.push(value.tripId);
    });

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    const currentDate = mm + '/' + dd + '/' + yyyy;

    return {
      userId: this.authService.getCurrentUserId(),
      orderId: 'orderId',
      status: 'Paid',
      total: this.totalPrice,
      tripsNames: tripsArr,
      tripsReserved: tripsNum,
      tripsIds: tripsIdsArr,
      date: currentDate
    };

  }

  onUserBoughtTrip() {
    this.userHistoryService.addOrderToHistory(this.basketToOrder());
    this.basketService.clearBasket();
    this.router.navigate(['/history']);
  }


}
