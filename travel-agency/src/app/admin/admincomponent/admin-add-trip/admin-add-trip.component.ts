import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TripModel } from '../../../models/trip.model';
import { Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-add-trip',
  templateUrl: './admin-add-trip.component.html',
  styleUrls: ['./admin-add-trip.component.css']
})
export class AdminAddTripComponent implements OnInit {

    // MDF Model-driven-form
    addTripModelForm: FormGroup;
    formBuilder: FormBuilder;
    @Output() newTripAdded = new EventEmitter<TripModel>();


    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
      this.addTripModelForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
        country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
        price: ['', [Validators.required, Validators.min(1), Validators.max(1000000)]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        maxAvailableTrips: ['', [Validators.required, Validators.min(1), Validators.max(200)]],
        tripDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
      });
    }

    onAddTripFormSubmit(form): void {

      // Parse date form form
       const startDate = form.value.startDate.year + '/' + form.value.startDate.month + '/' + form.value.startDate.day;
       const endDate = form.value.endDate.year + '/' + form.value.endDate.month + '/' + form.value.endDate.day;

      // If form is valid then add new trip
       const newTrip = new TripModel(
         '-1',
         form.value.name,
         form.value.country,
         startDate,
         endDate,
         form.value.price,
         0,
         form.value.tripDescription,
         'https://source.unsplash.com/_g1WdcKcV3w/1500x700',
         form.value.maxAvailableTrips,
         0);

       console.log('emmiting' + newTrip);
       this.newTripAdded.emit(newTrip);
     }

     get name() { return this.addTripModelForm.get('name'); }
     get country() { return this.addTripModelForm.get('country'); }
     get price() { return this.addTripModelForm.get('price'); }
     get startDate() { return this.addTripModelForm.get('startDate'); }
     get endDate() { return this.addTripModelForm.get('endDate'); }
     get maxAvailableTrips() { return this.addTripModelForm.get('maxAvailableTrips'); }
     get tripDescription() { return this.addTripModelForm.get('tripDescription'); }

}

