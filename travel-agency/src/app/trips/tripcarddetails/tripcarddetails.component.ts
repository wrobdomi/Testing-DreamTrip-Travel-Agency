import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TripModel } from '../../models/trip.model';
import { BasketService } from 'src/app/basket.service';

@Component({
  selector: 'app-tripcarddetails',
  templateUrl: './tripcarddetails.component.html',
  styleUrls: ['./tripcarddetails.component.css']
})
export class TripcarddetailsComponent implements OnInit {

  @Input() tripCardDetail: TripModel;

  @Input() currentMaxTripPrice: number;
  @Input() currentMinTripPrice: number;

  @Output() tripAddedBasket = new EventEmitter<TripModel>();
  @Output() tripRemovedBasket = new EventEmitter<TripModel>();

  @Output() tripRatingAdded = new EventEmitter<any>();

  @Output() tripRemoved = new EventEmitter<string>();

  maxAvailableRating = 5;
  showFront = true;

  constructor(private basketService: BasketService) { }

  ngOnInit() {
  }


  flipToFront() {
    console.log('Switch to true');
    this.showFront = true;
  }

  flipToBack() {
    console.log('Switch to false');
    this.showFront = false;
  }

  onTripAddedToBasket(tripCardDetail) {
    this.tripAddedBasket.emit(tripCardDetail);
  }

  onTripRemovedFromBasket(tripCardDetail) {
   this.tripRemovedBasket.emit(tripCardDetail);
  }

  onTripRemoved(tripId) {
    this.tripRemoved.emit(tripId);
  }

  checkIfInBasket(tripId: string){
    return this.basketService.isInBasket(tripId);
  }

}
