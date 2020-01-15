import { Injectable } from '@angular/core';
import { CommentModel } from './models/comment.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CommentsService {


  private commentsArray: CommentModel[];

  private commentsBehaviourSubject = new BehaviorSubject<CommentModel[]>([]);
  readonly commentsObservable = this.commentsBehaviourSubject.asObservable();

  constructor(private db: AngularFirestore) { }

  addComment(comment: CommentModel) {

    this.db
      .collection('comments')
      .add({
        ...comment
      });

  }

  getTripsComments(tripId: string) {

      this.db
      .collection('comments', ref => ref.where('tripId', '==', tripId))
      .snapshotChanges()
      .pipe(
      map(docArray => {
        return docArray.map(doc => {
          return {
            tripId: doc.payload.doc.data()['tripId'],
            commentContent: doc.payload.doc.data()['commentContent'],
            positive: doc.payload.doc.data()['positive'],
            date: doc.payload.doc.data()['date']
          };
        });
      }))
      .subscribe( (result: CommentModel[]) => {
        this.commentsArray = result;
        this.commentsBehaviourSubject.next(this.commentsArray);
      });

  }

}
