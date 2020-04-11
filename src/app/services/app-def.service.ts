import { Injectable } from '@angular/core';
import { DefKVPairs } from '../models/commercial-service.model';

@Injectable({
  providedIn: 'root'
})
export class AppDefService {
  appDefaults = {
    logo: '',
    userAvatar: '/assets/icons/user.png',
    businessOwnersLimit: 2,
    fixedCharges: {
      commTaxPerc: 0.0625,
      vasmaMargin: 0.1,
      paypalGatewayFeePerc: 0.06,
      paypalGatewayFixedFee: 0.3
    }
  };
  userSpecTypes = {
    defArtistTypes: [
      {key: 'dj', type: 'DJ'},
      {key: 'vocal', type: 'Vocal'},
      {key: 'instrumentalist', type: 'Instrumentalist'}
    ],
    defStyles: [
      {key: 'hip hop', type: 'Hip hop'},
      {key: 'pop', type: 'Pop'},
      {key: 'r&b', type: 'R&B'},
      {key: 'rock', type: 'Rock'},
      {key: 'electronic', type: 'Electronic'},
      {key: 'reggae', type: 'Reggae'},
      {key: 'country', type: 'Country'},
      {key: 'world', type: 'World'},
    ],
    defVenueTypes: [
      {key: 'bar/lounge', type: 'Bar/Lounge'},
      {key: 'nightclub', type: 'Night club'},
      {key: 'restaurant', type: 'Restaurant'},
      {key: 'open-mic-entertainment', type: 'Open mic entertainment'}
    ],
    defStudioTypes: [
      {key: 'registered professional establishment', type: 'Registered professional establishment'},
      {key: 'home studio', type: 'Home studio'},
      {key: 'engineer (mix + master features only)', type: 'Engineer (Mix + Master features only)'}
    ]
  };
  defNotifTypes = [
    'all', 'comment', 'prospect', 'others'
  ];
  dayArr = [
    {a: 'S', aa: 'Su', aaa: 'Sun', aaaa: 'Sunday'},
    {a: 'M', aa: 'Mo', aaa: 'Mon', aaaa: 'Monday'},
    {a: 'T', aa: 'Tu', aaa: 'Tue', aaaa: 'Tuesday'},
    {a: 'W', aa: 'We', aaa: 'Wed', aaaa: 'Wednusday'},
    {a: 'T', aa: 'Th', aaa: 'Thu', aaaa: 'Thursday'},
    {a: 'F', aa: 'Fr', aaa: 'Fri', aaaa: 'Friday'},
    {a: 'S', aa: 'Sa', aaa: 'Sat', aaaa: 'Saturday'},
  ];
  monthArr = [
    {mmm: 'Jan', mmmm: 'January'},
    {mmm: 'Feb', mmmm: 'February'},
    {mmm: 'Mar', mmmm: 'March'},
    {mmm: 'Apr', mmmm: 'April'},
    {mmm: 'May', mmmm: 'May'},
    {mmm: 'Jun', mmmm: 'June'},
    {mmm: 'Jul', mmmm: 'July'},
    {mmm: 'Aug', mmmm: 'August'},
    {mmm: 'Sep', mmmm: 'September'},
    {mmm: 'Oct', mmmm: 'October'},
    {mmm: 'Nov', mmmm: 'November'},
    {mmm: 'Dec', mmmm: 'December'}
  ];
  defCities = [];
  defPricingModels: DefKVPairs[] = [
    {key: 'HR', type: 'Charged per hour', defUnit: 'hour', defUnits: 'hours'},
    {key: 'DY', type: 'Charged per day', defUnit: 'day', defUnits: 'days'},
    // {key: 'WK', type: 'Charged per week', defUnit: 'week', defUnits: 'weeks'},
    // {key: 'MO', type: 'Charged per month', defUnit: 'month', defUnits: 'months'},
    {key: 'SV', type: 'Charged per Service / others', defUnit: 'service', defUnits: 'services'},
  ];
  businessHours: DefKVPairs[] = [
    // {key: '24h', type: '24 hours'},
    {key: 0, type: '12:00 am'},
    {key: 30, type: '12:30 am'},
    {key: 60, type: '1:00 am'},
    {key: 90, type: '1:30 am'},
    {key: 120, type: '2:00 am'},
    {key: 150, type: '2:30 am'},
    {key: 180, type: '3:00 am'},
    {key: 210, type: '3:30 am'},
    {key: 240, type: '4:00 am'},
    {key: 270, type: '4:30 am'},
    {key: 300, type: '5:00 am'},
    {key: 330, type: '5:30 am'},
    {key: 360, type: '6:00 am'},
    {key: 390, type: '6:30 am'},
    {key: 420, type: '7:00 am'},
    {key: 450, type: '7:30 am'},
    {key: 480, type: '8:00 am'},
    {key: 510, type: '8:30 am'},
    {key: 540, type: '9:00 am'},
    {key: 570, type: '9:30 am'},
    {key: 600, type: '10:00 am'},
    {key: 630, type: '10:30 am'},
    {key: 660, type: '11:00 am'},
    {key: 690, type: '11:30 am'},
    {key: 720, type: '12:00 pm'},
    {key: 750, type: '12:30 pm'},
    {key: 780, type: '1:00 pm'},
    {key: 810, type: '1:30 pm'},
    {key: 840, type: '2:00 pm'},
    {key: 870, type: '2:30 pm'},
    {key: 900, type: '3:00 pm'},
    {key: 930, type: '3:30 pm'},
    {key: 960, type: '4:00 pm'},
    {key: 990, type: '4:30 pm'},
    {key: 1020, type: '5:00 pm'},
    {key: 1050, type: '5:30 pm'},
    {key: 1080, type: '6:00 pm'},
    {key: 1110, type: '6:30 pm'},
    {key: 1140, type: '7:00 pm'},
    {key: 1170, type: '7:30 pm'},
    {key: 1200, type: '8:00 pm'},
    {key: 1230, type: '8:30 pm'},
    {key: 1260, type: '9:00 pm'},
    {key: 1290, type: '9:30 pm'},
    {key: 1320, type: '10:00 pm'},
    {key: 1350, type: '10:30 pm'},
    {key: 1380, type: '11:00 pm'},
    {key: 1410, type: '11:30 pm'}
  ];
  appdefStates = [
    { name: 'Alabama', abbr: 'AL'},
    { name: 'Alaska', abbr: 'AK'},
    { name: 'American Samoa', abbr: 'AS'},
    { name: 'Arizona', abbr: 'AZ'},
    { name: 'Arkansas', abbr: 'AR'},
    { name: 'California', abbr: 'CA'},
    { name: 'Colorado', abbr: 'CO'},
    { name: 'Connecticut', abbr: 'CT'},
    { name: 'Delaware', abbr: 'DE'},
    { name: 'District Of Columbia', abbr: 'DC'},
    { name: 'Federated States Of Micronesia', abbr: 'FM'},
    { name: 'Florida', abbr: 'FL'},
    { name: 'Georgia', abbr: 'GA'},
    { name: 'Guam Gu', abbr: 'GU'},
    { name: 'Hawaii', abbr: 'HI'},
    { name: 'Idaho', abbr: 'ID'},
    { name: 'Illinois', abbr: 'IL'},
    { name: 'Indiana', abbr: 'IN'},
    { name: 'Iowa', abbr: 'IA'},
    { name: 'Kansas', abbr: 'KS'},
    { name: 'Kentucky', abbr: 'KY'},
    { name: 'Louisiana', abbr: 'LA'},
    { name: 'Maine', abbr: 'ME'},
    { name: 'Marshall Islands', abbr: 'MH'},
    { name: 'Maryland', abbr: 'MD'},
    { name: 'Massachusetts', abbr: 'MA'},
    { name: 'Michigan', abbr: 'MI'},
    { name: 'Minnesota', abbr: 'MN'},
    { name: 'Mississippi', abbr: 'MS'},
    { name: 'Missouri', abbr: 'MO'},
    { name: 'Montana', abbr: 'MT'},
    { name: 'Nebraska', abbr: 'NE'},
    { name: 'Nevada', abbr: 'NV'},
    { name: 'New Hampshire', abbr: 'NH'},
    { name: 'New Jersey', abbr: 'NJ'},
    { name: 'New Mexico', abbr: 'NM'},
    { name: 'New York', abbr: 'NY'},
    { name: 'North Carolina', abbr: 'NC'},
    { name: 'North Dakota', abbr: 'ND'},
    { name: 'Northern Mariana Islands', abbr: 'MP'},
    { name: 'Ohio', abbr: 'OH'},
    { name: 'Oklahoma', abbr: 'OK'},
    { name: 'Oregon', abbr: 'OR'},
    { name: 'Palau', abbr: 'PW'},
    { name: 'Pennsylvania', abbr: 'PA'},
    { name: 'Puerto Rico', abbr: 'PR'},
    { name: 'Rhode Island', abbr: 'RI'},
    { name: 'South Carolina', abbr: 'SC'},
    { name: 'South Dakota', abbr: 'SD'},
    { name: 'Tennessee', abbr: 'TN'},
    { name: 'Texas', abbr: 'TX'},
    { name: 'Utah', abbr: 'UT'},
    { name: 'Vermont', abbr: 'VT'},
    { name: 'Virgin Islands', abbr: 'VI'},
    { name: 'Virginia', abbr: 'VA'},
    { name: 'Washington', abbr: 'WA'},
    { name: 'West Virginia', abbr: 'WV'},
    { name: 'Wisconsin', abbr: 'WI'},
    { name: 'Wyoming', abbr: 'WY'}
  ];
  constructor() { }

  get appDefs() {
    return this.appDefaults;
  }

  get _businessHours() {
    return this.businessHours;
  }
  get defPricing() {
    return this.defPricingModels;
  }

  get defNotificationTypes() {
    return this.defNotifTypes;
  }

  get defStates() {
    return this.appdefStates;
  }

  get defUserTypes() {
    return this.userSpecTypes;
  }

  get daysArr() {
    return this.dayArr;
  }

  get monthsArr() {
    return this.monthArr;
  }
}
