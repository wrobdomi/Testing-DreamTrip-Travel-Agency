import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  formBuilder: FormBuilder;


  constructor(formBuilder: FormBuilder, private authService: AuthService) {
    this.formBuilder = formBuilder;
  }

   ngOnInit() {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

  }

  onLoginFormSubmit(form) {

    console.log(form.value.email);
    console.log(form.value.password);

    this.authService.loginUser({
      userId: '1',
      email: form.value.email,
      password: form.value.password,
      role: 'user'
    });

    // console.log(form.value.priceChecked);
    // console.log(form.value.priceFrom);
    // console.log(form.value.priceTo);

    // console.log(form.value.dateChecked);
    // // Parse date form form
    // const startDate = form.value.startDate.year + '/' + form.value.startDate.month + '/' + form.value.startDate.day;
    // const endDate = form.value.endDate.year + '/' + form.value.endDate.month + '/' + form.value.endDate.day;

    // console.log(form.value.ratingChecked);
    // console.log(form.value.minRating);

    // console.log(form.value.countryChecked);
    // console.log(form.value.countryName);


    // const fc = new FilteringCriteria(form.value.priceChecked, form.value.priceFrom, form.value.priceTo,
    //                                  form.value.dateChecked, startDate, endDate,
    //                                  form.value.ratingChecked, form.value.minRating,
    //                                   form.value.countryChecked, form.value.countryName
    //                                  );

    // this.tripsService.setFilteringCriteria(fc);

    // console.log(form);
  }



  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }


}
