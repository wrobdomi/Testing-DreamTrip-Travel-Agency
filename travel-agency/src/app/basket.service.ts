import { Injectable, OnInit } from '@angular/core';
import { TripModel } from './models/trip.model';
import { BehaviorSubject } from 'rxjs';
import { TripInBasket } from './models/tripinbasket.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {


  private tripsInBasketMap: Map<string, TripInBasket> = new Map();

  private basketMapBehaviourSubject = new BehaviorSubject<Map<string, TripInBasket>>(new Map());
  readonly basketMapObservable = this.basketMapBehaviourSubject.asObservable();



  addToBasket( tripId: string, tripInBasket: TripInBasket) {

    if (this.tripsInBasketMap.has(tripId)) {
      const tib = this.tripsInBasketMap.get(tripId);
      tib.allBooked = tib.allBooked + 1;
      this.tripsInBasketMap.set(tripId, tib);
    } else {
      this.tripsInBasketMap.set(tripId, tripInBasket);
    }

    console.log('Add to basket called');
    console.log(this.tripsInBasketMap);

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

    console.log('Remove from basket called');
    console.log(this.tripsInBasketMap);

    this.basketMapBehaviourSubject.next(this.tripsInBasketMap);

  }


  isInBasket(tripId: string) {

    if (this.tripsInBasketMap.has(tripId)) {
      return true;
    } else {
      return false;
    }

  }

  clearBasket() {
    this.tripsInBasketMap.clear();
  }



}
