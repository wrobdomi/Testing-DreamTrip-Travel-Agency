import { Component, OnInit, ViewChild, OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { TripModel } from 'src/app/models/trip.model';
import { TripsService } from 'src/app/trips.service';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { BasketService } from 'src/app/basket.service';
import { CommentModel } from 'src/app/models/comment.model';
import { CommentsService } from 'src/app/comments.service';
import { Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserHistoryService } from 'src/app/user-history.service';
import { RatingsService } from 'src/app/ratings.service';
import { RatingModel } from 'src/app/models/rating.model';


@Component({
  selector: 'app-trip-detailed-view',
  templateUrl: './trip-detailed-view.component.html',
  styleUrls: ['./trip-detailed-view.component.css']
})
export class TripDetailedViewComponent implements OnInit, OnDestroy {

  detailedTrip: TripModel;
  tripsComments: CommentModel[];

  images = [
    'https://source.unsplash.com/jTknOGI18us/1500x700',
    'https://source.unsplash.com/sC-BXbi9ajw/1500x700',
    'https://source.unsplash.com/T6zu4jFhVwg/1500x700',
    'https://source.unsplash.com/qLW70Aoo8BE/1500x700',
    'https://source.unsplash.com/rB7-LCa_diU/1500x700',
    'https://source.unsplash.com/Ji_G7Bu1MoM/1500x700'
  ];

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;

  reservedByCustomer: string;
  inUserHistory = false;
  userRating: RatingModel = null;

  addCommentForm: FormGroup;
  formBuilder: FormBuilder;

  private specificTripSubscription: Subscription;
  private commentsSubscription: Subscription;
  private isInHistorySubcription: Subscription;
  private isRatedByUserSubcription: Subscription;

  maxAvailableRating = 5;
  initialRate = 3;

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripsService: TripsService,
    private basketService: BasketService,
    private commentsService: CommentsService,
    formBuilder: FormBuilder,
    private productsService: TripsService,
    private authService: AuthService,
    private userHistoryService: UserHistoryService,
    private ratingsService: RatingsService
      ) {
        this.formBuilder = formBuilder;
  }

  ngOnInit() {

    // subscribe to chosen trip
    this.specificTripSubscription = this.productsService.singleTripSubject.subscribe(
      res => {
        console.log('Inside subscribe of specific trip, specific trip is: ');
        console.log(res);
        this.detailedTrip = res;
      },
      error => console.log('Can not load trips array from service')
    );

    const id = this.route.snapshot.paramMap.get('id');

    this.tripsService.getSingleProduct(id);


   // subscribe to comments for the specific trip
    this.commentsSubscription = this.commentsService.commentsObservable.subscribe(
      res => {
        this.tripsComments = res;
      },
      error => console.log('Can not load trips array from service')
    );

    this.commentsService.getTripsComments(id);



    // subsribe to isInUserHistory
    this.isInHistorySubcription = this.userHistoryService.isInHistorySubject.subscribe(
      res => {
        this.inUserHistory = res;
        if (this.inUserHistory) {
          this.reservedByCustomer = 'Yes';
        } else {
          this.reservedByCustomer = 'No';
        }
      }
    );

    this.userHistoryService.isTripInHistory(id, this.authService.getCurrentUserId());



    // subscribe to isRatedByUser
    this.isRatedByUserSubcription = this.ratingsService.usersRatingSubject.subscribe(
      res => {
        this.userRating = res;
      }
    );

    this.ratingsService.isTripRatedByUser(this.authService.getCurrentUserId(), id);

    this.addCommentForm = this.formBuilder.group({
        feedback: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
        negative: ['', []]
      });


  }

  ngOnDestroy() {
    this.specificTripSubscription.unsubscribe();
    this.commentsSubscription.unsubscribe();
    this.isInHistorySubcription.unsubscribe();
    this.isRatedByUserSubcription.unsubscribe();
  }


  goBackToTrips() {
    this.router.navigate(['/trips']);
  }

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }


  onCommentAdded(form): void {

      // Get current date
    const todayDate = new Date();
    const dd = String(todayDate.getDate()).padStart(2, '0');
    const mm = String(todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = todayDate.getFullYear();

    const today = mm + '/' + dd + '/' + yyyy;

    let feedbackType = true;

    if (form.value.negative === true) {
      feedbackType = false;
    }

    console.log(form.value.feedback);
    console.log(form.value.negative);

    // If form is valid then add new trip
    const newComment: CommentModel = {
      tripId: this.detailedTrip.id,
      commentContent: form.value.feedback,
      positive: feedbackType,
      date: today
    };

    this.commentsService.addComment(newComment);
}

  onTripRatingAdded(event) {
    this.productsService.updateProductRating(this.detailedTrip.id, event);
    this.ratingsService.setUsersRating(
      this.authService.getCurrentUserId(),
      this.detailedTrip.id,
      event);
  }

  get feedback() { return this.addCommentForm.get('feedback'); }
  get negative() { return this.addCommentForm.get('negative'); }

}
