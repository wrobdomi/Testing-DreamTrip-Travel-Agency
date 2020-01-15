export class FilteringCriteria {

  readonly priceChecked: boolean;
  readonly priceFrom: number;
  readonly priceTo: number;

  readonly dateChecked: boolean;
  readonly startDate: string;
  readonly endDate: string;

  readonly ratingChecked: boolean;
  readonly minRating: number;

  readonly countryChecked: boolean;
  readonly countryName: string;

  constructor($priceChecked, $priceFrom, $priceTo,
              $dateChecked, $startDate, $endDate,
              $ratingChecked, $minRating,
              $countryChecked, $countryName) {

    this.priceChecked = $priceChecked;
    this.priceFrom = $priceFrom;
    this.priceTo = $priceTo;

    this.dateChecked = $dateChecked;
    this.startDate = $startDate;
    this.endDate = $endDate;

    this.ratingChecked = $ratingChecked;
    this.minRating = $minRating;

    this.countryChecked = $countryChecked;
    this.countryName = $countryName;

  }
}
