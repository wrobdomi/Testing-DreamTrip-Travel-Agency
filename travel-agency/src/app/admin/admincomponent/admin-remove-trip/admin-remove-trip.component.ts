import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TripModel } from 'src/app/models/trip.model';

@Component({
  selector: '[app-admin-remove-trip]',
  templateUrl: './admin-remove-trip.component.html',
  styleUrls: ['./admin-remove-trip.component.css']
})
export class AdminRemoveTripComponent implements OnInit {

  @Input() tripDetail: TripModel;
  @Output() tripRemoved = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  onTripRemoved(tripId) {
    this.tripRemoved.emit(tripId);
  }

}
