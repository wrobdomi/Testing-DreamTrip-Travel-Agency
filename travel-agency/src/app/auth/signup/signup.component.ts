import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  formBuilder: FormBuilder;


  constructor(formBuilder: FormBuilder, private authService: AuthService) {
    this.formBuilder = formBuilder;
   }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSignupFormSubmit(form) {

    console.log(form.value.email);
    console.log(form.value.password);
    this.authService.registerUser({
      userId: '1',
      email: form.value.email,
      password: form.value.password,
      role: 'user'
    });
  }


  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }

}
