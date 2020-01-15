import { Component, OnInit, Input } from '@angular/core';
import { TripsService } from 'src/app/trips.service';
import { TripModel } from 'src/app/models/trip.model';

@Component({
  selector: 'app-admincomponent',
  templateUrl: './admincomponent.component.html',
  styleUrls: ['./admincomponent.component.css']
})
export class AdminComponent implements OnInit {


  allTrips: TripModel[];
  private productsService: TripsService;

  constructor(productsService: TripsService) {
    this.productsService = productsService;
  }

  ngOnInit() {

    // subscribe to service trips array
    this.productsService.tripsObservable.subscribe(
      res => {
        this.allTrips = res;
      },
      error => console.log('Can not load trips array from service')
    );

    this.productsService.getAllProducts();
  }


  onTripRemovedReceived(tripId) {
    this.productsService.deleteProduct(tripId);
  }

  onNewTripAddedReceived(newTrip) {
    this.productsService.addProduct(newTrip);
  }

}
