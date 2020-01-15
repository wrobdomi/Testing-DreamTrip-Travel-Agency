export class TripModel {

    readonly id: string;
    readonly name: string;
    readonly countryDestination: string;
    readonly tripStarts: string;
    readonly tripEnds: string;
    readonly price: number;
    bookedTrips: number;
    readonly description: string;
    readonly imageLink: string;
    readonly maxAvailableBookings: number;
    rating: number;
    ratingsArray: number[];


    constructor($id: string, $name: string, $countryDestination: string, $tripStarts: string, $tripEnds: string,
                $price: number, $bookedTrips: number, $description: string, $imageLink: string,
                $maxAavailableBookings: number, $rating: number) {
        this.id = $id;
        this.name = $name;
        this.countryDestination  = $countryDestination;
        this.tripStarts = $tripStarts;
        this.tripEnds = $tripEnds;
        this.price = $price;
        this.bookedTrips = $bookedTrips;
        this.description = $description;
        this.imageLink = $imageLink;
        this.maxAvailableBookings = $maxAavailableBookings;
        this.rating = $rating;
        this.ratingsArray = [];
    }


}
