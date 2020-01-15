import { Injectable } from '@angular/core';
import { TripModel } from './models/trip.model';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { FilteringCriteria } from './filtering-criteria.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TripsService {

  // In memory store ---------------------- //
  // in-memory store for trips
  private tripsArray: TripModel[];
  // in-memroy store for specific trip
  private tripForDetailedView: TripModel;

  // Observables -------------------------- //
  // all trips observable
  private tripsBehaviourSubject = new BehaviorSubject<TripModel[]>([]);
  readonly tripsObservable = this.tripsBehaviourSubject.asObservable();

  // single trip obervable
  readonly singleTripSubject = new Subject<TripModel>();

  // Filtering ---------------------------- //
  private filteringCriteria: FilteringCriteria = null;


  constructor(private db: AngularFirestore) {}

  // CRUD -------------------------------------------------------------------- //

  // read all
  getAllProducts() {
    this.db
      .collection('trips')
      .snapshotChanges()
      .pipe(
      map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            countryDestination: doc.payload.doc.data()['countryDestination'],
            tripStarts: doc.payload.doc.data()['tripStarts'],
            tripEnds: doc.payload.doc.data()['tripEnds'],
            price: doc.payload.doc.data()['price'],
            bookedTrips: doc.payload.doc.data()['bookedTrips'],
            description: doc.payload.doc.data()['description'],
            imageLink: doc.payload.doc.data()['imageLink'],
            maxAvailableBookings: doc.payload.doc.data()['maxAvailableBookings'],
            rating: doc.payload.doc.data()['rating'],
            ratingsArray: doc.payload.doc.data()['ratingsArray']
          };
        });
      }))
      .subscribe( (result: TripModel[]) => {
        this.tripsArray = result;
        this.applyFilteringCriteria(); // fiflter and emit
      });
  }

  // read single
  getSingleProduct(tripId: string) {
    this.db
      .collection('trips')
      .doc(tripId)
      .valueChanges()
      .pipe(
      map(doc => {
            return {
            id: tripId,
            ...doc
          };
      }))
      .subscribe( (specificTrip: TripModel) => {
        this.tripForDetailedView = specificTrip;
        this.singleTripSubject.next(this.tripForDetailedView);
      });
  }

  // delete single
  deleteProduct(tripId: string) {
    this.db
      .collection('trips')
      .doc(tripId)
      .delete();
  }

  // add single
  addProduct(newTrip: TripModel) {
    this.db
      .collection('trips')
      .add({
        bookedTrips: newTrip.bookedTrips,
        countryDestination: newTrip.countryDestination,
        description: newTrip.description,
        imageLink: newTrip.imageLink,
        maxAvailableBookings: newTrip.maxAvailableBookings,
        name: newTrip.name,
        price: newTrip.price,
        rating: newTrip.rating,
        ratingsArray: newTrip.ratingsArray,
        tripEnds: newTrip.tripEnds,
        tripStarts: newTrip.tripStarts
      });
  }

  // update single trip rating ad rating array
  updateProductRating(tripId, newRating) {

    const updatingTrip =  this.tripsArray
      .find(t => t.id === tripId);

    const updatingTripRatingArr = updatingTrip.ratingsArray;
    updatingTripRatingArr.push(newRating);

    const total = updatingTripRatingArr.reduce((accumulator, currentValue) => accumulator + currentValue);
    const totalNumber = updatingTripRatingArr.length;

    const newR = total / totalNumber;

    this.db
      .collection('trips')
      .doc(tripId)
      .set(
        {
          ratingsArray: updatingTripRatingArr,
          rating: newR
        },
          {merge: true}
      );

  }

  // update single trip bookings number
  updateProductBookingsNumber(tripId, howMany) {
    const currentBookings = this.tripsArray
      .find(t => t.id === tripId)
      .bookedTrips;

    const newBookings = currentBookings + howMany;

    this.db
      .collection('trips')
      .doc(tripId)
      .set(
        {
          bookedTrips: newBookings,
        },
          {merge: true}
      );
  }

  // CRUD ends --------------------------------------------------------------- //

  setFilteringCriteria(criteria: FilteringCriteria){
    this.filteringCriteria = criteria;
    this.applyFilteringCriteria();
  }

  applyFilteringCriteria() {

    if (this.filteringCriteria === null) {
      this.tripsBehaviourSubject.next(this.tripsArray);
      return;
    }

    let tripFilteredArray = this.tripsArray;
    let anyCriteria = false;

    if (this.filteringCriteria.priceChecked === true) {
      tripFilteredArray = tripFilteredArray
        .filter(x => x.price > this.filteringCriteria.priceFrom && x.price < this.filteringCriteria.priceTo);
      anyCriteria = true;
    }
    if (this.filteringCriteria.dateChecked === true) {
      let dateArrayFrom = this.filteringCriteria.startDate.split('/');
      let dateArrayTo = this.filteringCriteria.endDate.split('/');

      let startCriteriaDate = new Date(parseInt(dateArrayFrom[0]), parseInt(dateArrayFrom[1]), parseInt(dateArrayFrom[2]));
      let endCriteriaDate = new Date(parseInt(dateArrayTo[0]), parseInt(dateArrayTo[1]), parseInt(dateArrayTo[2]));

      tripFilteredArray =  tripFilteredArray.filter( x => {
        let tripDateArrayFrom = x.tripStarts.split('/');
        let tripDateArrayTo = x.tripEnds.split('/');

        let tripStartDate = new Date(parseInt(tripDateArrayFrom[0]), parseInt(tripDateArrayFrom[1]), parseInt(tripDateArrayFrom[2]));
        let tripEndDate = new Date(parseInt(tripDateArrayTo[0]), parseInt(tripDateArrayTo[1]), parseInt(tripDateArrayTo[2]));

        return (tripStartDate >= startCriteriaDate && tripEndDate <= endCriteriaDate);
      });

      anyCriteria = true;
    }
    if (this.filteringCriteria.ratingChecked === true) {
      tripFilteredArray = tripFilteredArray.filter(x => x.rating > this.filteringCriteria.minRating);
      anyCriteria = true;
    }
    if (this.filteringCriteria.countryChecked === true) {
      const regex =  new RegExp(this.filteringCriteria.countryName + '*', 'i');
      console.log(regex);
      tripFilteredArray = tripFilteredArray.filter(x => regex.test(x.countryDestination));
      anyCriteria = true;
    }

    this.tripsBehaviourSubject.next(tripFilteredArray);

  }








}
