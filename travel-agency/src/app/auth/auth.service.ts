import { UserModel } from '../models/user.model';

import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserRoleModel } from '../models/userrole.model';


@Injectable()
export class AuthService {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore) {}

  authChange = new Subject<boolean>();
  roleChange = new Subject<string>();

  private isAuthenticated = false;
  private currentUserId: string;
  private currentUserRole: string;

  registerUser(user: UserModel) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(result => {
        console.log(result);
        this.currentUserId = result.user.uid;

        // save user role
        this.addUsersRole({
          userId: result.user.uid,
          role: 'user'
        });

        this.currentUserRole = 'user';

        this.authSuccessfully();
      })
      .catch(error => {
        console.log(error);
      });
  }

  loginUser(user: UserModel) {

    this.afAuth.auth
      .signInWithEmailAndPassword(user.email, user.password)
       .then(result => {
        console.log(result);
        this.currentUserId = result.user.uid;

        this.db.collection('usersroles', ref => ref.where('userId', '==', result.user.uid))
        .valueChanges()
        .subscribe((res: UserRoleModel[]) => {
          // console.log('I got data from usersroles: ');
          // console.log(res[0].role);
          this.currentUserRole = res[0].role;
          this.authSuccessfully();
        });

      })
      .catch(error => {
        console.log(error);
      });

  }

  logout() {
    this.currentUserRole = 'none';
    this.isAuthenticated = false;
    this.authChange.next(false);
    this.router.navigate(['/logout']);
  }


  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.roleChange.next(this.currentUserRole);
    this.router.navigate(['/trips']);
  }

  getCurrentUserId() {
    return this.currentUserId;
  }

  getUserRole() {
    return this.currentUserRole;
  }

  addUsersRole($role: UserRoleModel) {
       this.db
      .collection('usersroles')
      .add({
        userId: $role.userId,
        role: $role.role
      });
  }




}
