import { Component, OnInit, OnDestroy } from '@angular/core';
import {TripModel} from '../models/trip.model';
import { TripsService } from '../trips.service';
import { BasketService } from '../basket.service';
import { FilteringCriteria } from '../filtering-criteria.model';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit, OnDestroy {


  title = 'travel-agency';

  private productsService: TripsService;
  private basketService: BasketService;

  showFilterCriteria = true;

  tripsArray: TripModel[] = [];
  tripsSubscription: Subscription;


  tripsMaxPrice = 0;
  tripsMinPrice = 100000;
  allBookedTripsNumber = 0;

  private displayCriteria: FilteringCriteria;

  constructor(productsService: TripsService, basketService: BasketService) {
    this.productsService = productsService;
    this.basketService = basketService;
  }

  ngOnInit(): void {

    // subscribe to service trips array
    this.tripsSubscription = this.productsService.tripsObservable.subscribe(
      res => {
        this.tripsArray = res;
        this.updateMinMaxPriceAndAllBookedTrips();
        // this.onFilteringCriteriaApplied(this.displayCriteria);
      },
      error => console.log('Can not load trips array from service')
    );

    // service subscribes to db, fills its table with products adn emits
    this.productsService.getAllProducts();

  }

  ngOnDestroy(): void {
    this.tripsSubscription.unsubscribe();
  }


  // Receiving events ------------------------------------------------------ //

  onTripAddedToBasketReceived(trip) {

    this.basketService.addToBasket(
      trip.id, {
      tripId: trip.id,
      name: trip.name,
      price: trip.price,
      allBooked: 1
    });

    this.productsService.updateProductBookingsNumber(trip.id, 1);
  }

  onTripRemovedFromBasketReceived(trip) {

    this.basketService.removeFromBasket(
      trip.id,
      {
      tripId: trip.id,
      name: trip.name,
      price: trip.price,
      allBooked: 1
    });

    this.productsService.updateProductBookingsNumber(trip.id, -1);
  }



  // ----------------------------------------------------------------------- //



  getTripsMaxPrice() {
    this.tripsMaxPrice = 0;
    for (const i of this.tripsArray) {
      if (i.price > this.tripsMaxPrice) {
        this.tripsMaxPrice = i.price;
      }
    }
  }

  getTripsMinPrice() {
    this.tripsMinPrice = 10000000;
    for (const i of this.tripsArray) {
      if (i.price < this.tripsMinPrice) {
        this.tripsMinPrice = i.price;
      }
    }
  }

  getAllBookedTripsNumber() {
    let allReservedTrips = this.tripsArray.map(x => x.bookedTrips);
    if (allReservedTrips.length === 0) {
      allReservedTrips = [0];
    }
    this.allBookedTripsNumber = allReservedTrips.reduce( (accumulator, current) =>
        accumulator + current
    );
  }

  updateMinMaxPriceAndAllBookedTrips() {
    this.getTripsMaxPrice();
    this.getTripsMinPrice();
    this.getAllBookedTripsNumber();
  }

  showFilterCriteriaPanel() {
    this.showFilterCriteria = !this.showFilterCriteria;
  }



}


