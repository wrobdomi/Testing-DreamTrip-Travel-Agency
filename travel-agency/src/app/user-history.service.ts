import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { OrderModel } from './models/order.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserHistoryService {

  // In memory storage
  private ordersArray: OrderModel[];


  // Observables -------------------------- //
  // all trips observable
  private ordersBehaviourSubject = new BehaviorSubject<OrderModel[]>([]);
  readonly ordersObservable = this.ordersBehaviourSubject.asObservable();

  readonly isInHistorySubject = new Subject<boolean>();

  constructor(private db: AngularFirestore) { }


  getUserOrders(userId: string) {
    this.db
      .collection('orders', ref => ref.where('userId', '==', userId))
      .snapshotChanges()
      .pipe(
      map(docArray => {
        return docArray.map(doc => {
          return {
            orderId: doc.payload.doc.id,
            userId: doc.payload.doc.data()['userId'],
            status: doc.payload.doc.data()['status'],
            total: doc.payload.doc.data()['total'],
            tripsNames: doc.payload.doc.data()['tripsNames'],
            tripsReserved: doc.payload.doc.data()['tripsReserved'],
            date: doc.payload.doc.data()['date'],
            tripsIds: doc.payload.doc.data()['tripsIds']
          };
        });
      }))
      .subscribe( (result: OrderModel[]) => {
        this.ordersArray = result;
        this.ordersBehaviourSubject.next(this.ordersArray);
      });
  }

  addOrderToHistory(order: OrderModel) {

    this.db
      .collection('orders')
      .add({
        userId: order.userId,
        status: order.status,
        total: order.total,
        tripsNames: order.tripsNames,
        tripsReserved: order.tripsReserved,
        date: order.date,
        tripsIds: order.tripsIds
      });

  }

  // TODO
  isTripInHistory(tripId: string, userId: string) {

    this.db
      .collection('orders', ref => ref.where('userId', '==', userId))
      .snapshotChanges()
      .pipe(
      map(docArray => {
        return docArray.map(doc => {
          return {
            tripsArr: doc.payload.doc.data()['tripsIds'],
          };
        });
      }))
      .subscribe( (result) => {

        let found = false;
        loop1: for (const ob of result) {
          for (const arrField of ob.tripsArr) {
            if (arrField === tripId) {
              found = true;
              break loop1;
            }
          }
        }

        if (found) {
          this.isInHistorySubject.next(true);
        } else {
          this.isInHistorySubject.next(false);
        }

      });

  }





}
