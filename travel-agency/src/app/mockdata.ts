import { TripModel } from './models/trip.model';

export class MockData {

  static tripsDataSource: TripModel[] =
  [
    new TripModel('1', 'Romantic Story', 'Italy', '2019/11/30',
      '2019/12/06', 500, 3, 'Romantic journey in Venice !',
      'assets/tripImages/italy.jpg', 6, 0),
    new TripModel('2', 'Ancient Taste', 'Greece', '2020/01/30',
      '2020/02/30', 300, 0, 'Get to know ancient Greece !',
      'assets/tripImages/greece.jpg', 10, 0),
    new TripModel('3', 'Wild Adventure', 'Africa', '2020/02/30',
      '2020/03/10', 1400, 0, 'Meet wildest animals eye-to-eye !',
      'assets/tripImages/africa.jpg', 5, 0),
    new TripModel('4', 'Freezing Cold', 'Greenland', '2020/01/01',
      '2020/01/07', 200, 2, 'Build your own igloo !',
      'assets/tripImages/greenland.jpg', 4, 0),
    new TripModel('5', 'Oriental Journey', 'China', '2020/03/30',
      '2020/04/09', 800, 0, 'Walk the Chinese Wall !',
      'assets/tripImages/china.jfif', 8, 0),
    new TripModel('6', 'Sun, beach and sea !', 'Maldives', '2020/04/30',
      '2020/05/09', 1000, 0, 'Explore tropical island !',
      'assets/tripImages/maldives.jfif', 6, 0),
    new TripModel('7', 'Highlights of Brasil', 'Brasil', '2020/06/15',
      '2020/06/20', 500, 5, 'Join multi-centre tours !',
      'assets/tripImages/brasil.jpg', 10, 0),
    new TripModel('8', 'Great pyramids', 'Egypt', '2020/05/01',
      '2020/05/30', 4000, 0, 'Explore great pyramids !',
      'assets/tripImages/egypt.jfif', 10, 0),
  ];


  constructor() {
  }

}
