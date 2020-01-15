import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FilteringCriteria } from '../../filtering-criteria.model';
import { TripsService } from '../../trips.service';

@Component({
  selector: 'app-trips-filter-criteria',
  templateUrl: './trips-filter-criteria.component.html',
  styleUrls: ['./trips-filter-criteria.component.css']
})
export class TripsFilterCriteriaComponent implements OnInit {

  private tripsService: TripsService;

  @Input() isCollapsed;

  // MDF Model-driven-form
  filterTripsModelForm: FormGroup;
  formBuilder: FormBuilder;
  @Output() filteringCriteriaApplied = new EventEmitter<FilteringCriteria>();


  constructor(formBuilder: FormBuilder, tripsService: TripsService) {
    this.formBuilder = formBuilder;
    this.tripsService = tripsService;
  }

  ngOnInit() {
    this.filterTripsModelForm = this.formBuilder.group({
      priceChecked: ['', []],
      dateChecked: ['', []],
      ratingChecked: ['', []],
      countryChecked: ['', []],
      priceFrom: ['', [Validators.min(1), Validators.max(1000000)]],
      priceTo: ['', [Validators.min(1), Validators.max(1000000)]],
      startDate: ['', []],
      endDate: ['', []],
      minRating: ['', [Validators.min(1), Validators.max(5)]],
      countryName: ['', [Validators.minLength(3), Validators.maxLength(40)]]
    });
  }

  onApplyFilterFormSubmit(form) {

    console.log(form.value.priceChecked);
    console.log(form.value.priceFrom);
    console.log(form.value.priceTo);

    console.log(form.value.dateChecked);
    // Parse date form form
    const startDate = form.value.startDate.year + '/' + form.value.startDate.month + '/' + form.value.startDate.day;
    const endDate = form.value.endDate.year + '/' + form.value.endDate.month + '/' + form.value.endDate.day;

    console.log(form.value.ratingChecked);
    console.log(form.value.minRating);

    console.log(form.value.countryChecked);
    console.log(form.value.countryName);


    const fc = new FilteringCriteria(form.value.priceChecked, form.value.priceFrom, form.value.priceTo,
                                     form.value.dateChecked, startDate, endDate,
                                     form.value.ratingChecked, form.value.minRating,
                                      form.value.countryChecked, form.value.countryName
                                     );

    this.tripsService.setFilteringCriteria(fc);

    // console.log(form);
  }


  get priceChecked() { return this.filterTripsModelForm.get('priceChecked'); }
  get dateChecked() { return this.filterTripsModelForm.get('dateChecked'); }
  get ratingChecked() { return this.filterTripsModelForm.get('ratingChecked'); }
  get countryChecked() { return this.filterTripsModelForm.get('countryChecked'); }
  get priceFrom() { return this.filterTripsModelForm.get('priceFrom'); }
  get priceTo() { return this.filterTripsModelForm.get('priceTo'); }
  get startDate() { return this.filterTripsModelForm.get('startDate'); }
  get endDate() { return this.filterTripsModelForm.get('endDate'); }
  get minRating() { return this.filterTripsModelForm.get('minRating'); }
  get countryName() { return this.filterTripsModelForm.get('countryName'); }

}
