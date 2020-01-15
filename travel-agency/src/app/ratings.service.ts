import { Injectable } from '@angular/core';
import { RatingModel } from './models/rating.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RatingsService {

  constructor(private db: AngularFirestore) { }

  readonly usersRatingSubject = new Subject<RatingModel>();
  private usersRating: RatingModel = null;

  isTripRatedByUser(userId$: string, tripId$: string) {
    this.db
      .collection('ratings', ref => ref.where('userId', '==', userId$).where('tripId', '==', tripId$))
      .snapshotChanges()
      .pipe(
      map(docArray => {
        return docArray.map(doc => {
          return {
            userId: doc.payload.doc.data()['userId'],
            tripId: doc.payload.doc.data()['tripId'],
            rating: doc.payload.doc.data()['rating']
          };
        });
      }))
      .subscribe( (result: RatingModel[]) => {
        console.log('From isTripRatedByUser: ');
        console.log(result);
        if (result.length === 0) {
          this.usersRating = null;
          this.usersRatingSubject.next(this.usersRating);
        } else {
          this.usersRating = result[0];
          this.usersRatingSubject.next(this.usersRating);
        }

      });
  }


  setUsersRating(userId$: string, tripId$: string, rating$: number) {
    this.db
      .collection('ratings')
      .add({
        userId: userId$,
        tripId: tripId$,
        rating: rating$
      });
  }


}
