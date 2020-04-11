import { Component, OnInit } from '@angular/core';
import { TestimonialsDataService } from 'src/app/services/home-services/testimonials/testimonials-data.service';
import { Testimonial } from 'src/app/services/home-services/testimonials/testimonials-model';

@Component({
  selector: 'app-home-sm',
  templateUrl: './home-sm.component.html',
  styleUrls: ['./home-sm.component.scss']
})
export class HomeSmComponent implements OnInit {
  testimonials: Testimonial[] = [];
  constructor(private _testimonials: TestimonialsDataService) { }

  ngOnInit() {
    this.testimonials = this._testimonials.getTestimonials();
  }

  chooseAccountObj = {
    'venue': {
      title: 'venue',
      bgImg: '/assets/img/backgrounds/home/applause-audience-band-1120162.jpg',
      list: [
        {'heading': 'GET THE HOTTEST ARTIST', 'data': 'Have the hottest artists locally come & perform at YOUR ESTABLISHMENT'},
        {'heading': 'GET RATED', 'data': 'View your realtime rating. Get more ratings, more business.'},
        {'heading': 'ADVERTISE', 'data': 'You can advertise your services to get more bookings.'},
        {'heading': 'ENCOURAGE WITH RATING', 'data': 'You can also rate your artist after performance to encourage talent.'},
        {'heading': 'PROMOTE YOUR EVENTS', 'data': 'Promote your events to local talent'},
        {'heading': 'GET MORE BOOKINGS', 'data': 'Robust booking information and tracking.'},
        {'heading': 'GET PAID SECURELY', 'data': 'Most secure financial transactions using PayPal'},
        {'heading': 'SHOWCASE MEMORIES', 'data': 'You can upload and share beautiful images of yur establishment.'},
        {'heading': 'GET INTO YOUR DASHBOARD', 'data': 'Intricate dashboard designed to see quick profile stats and trends.'},
        {'heading': 'AND MANY MORE', 'data': 'You can also get many more features with time.'},
        {'heading': 'BUILD YOUR NETWORK', 'data': '<p>With vasma you can allow artists to auditions for paid gigs or perform for an open mic event you are hosting!</p><p>Wondering about quality for you paid performances? Worry not! All our artists undergo an intense curriculam before they can be paid for performance to make sure you are getting the absolute best.</p>'},
      ]
    },
    'artist': {
      title: 'artist',
      bgImg: '/assets/img/backgrounds/home/artist-concert-entertainment-1425297%20copy.jpg',
      list: [
        {'heading': 'GET THE HOTTEST ARTIST', 'data': 'Have the hottest artists locally come & perform at YOUR ESTABLISHMENT'},
        {'heading': 'GET RATED', 'data': 'View your realtime rating. Get more ratings, more business.'},
        {'heading': 'ADVERTISE', 'data': 'You can advertise your services to get more bookings.'},
        {'heading': 'ENCOURAGE WITH RATING', 'data': 'You can also rate your artist after performance to encourage talent.'},
        {'heading': 'PROMOTE YOUR EVENTS', 'data': 'Promote your events to local talent'},
        {'heading': 'GET MORE BOOKINGS', 'data': 'Robust booking information and tracking.'},
        {'heading': 'GET PAID SECURELY', 'data': 'Most secure financial transactions using PayPal'},
        {'heading': 'SHOWCASE MEMORIES', 'data': 'You can upload and share beautiful images of yur establishment.'},
        {'heading': 'GET INTO YOUR DASHBOARD', 'data': 'Intricate dashboard designed to see quick profile stats and trends.'},
        {'heading': 'AND MANY MORE', 'data': 'You can also get many more features with time.'},
        {'heading': 'BUILD YOUR NETWORK', 'data': '<p>With vasma you can allow artists to auditions for paid gigs or perform for an open mic event you are hosting!</p><p>Wondering about quality for you paid performances? Worry not! All our artists undergo an intense curriculam before they can be paid for performance to make sure you are getting the absolute best.</p>'},
      ]
    },
    'studio': {
      title: 'studio',
      bgImg: '/assets/img/backgrounds/home/audio-b-device-55800_xl.jpg',
      list: [
        {'heading': 'GET THE HOTTEST ARTIST', 'data': 'Have the hottest artists locally come & perform at YOUR ESTABLISHMENT'},
        {'heading': 'GET RATED', 'data': 'View your realtime rating. Get more ratings, more business.'},
        {'heading': 'ADVERTISE', 'data': 'You can advertise your services to get more bookings.'},
        {'heading': 'ENCOURAGE WITH RATING', 'data': 'You can also rate your artist after performance to encourage talent.'},
        {'heading': 'PROMOTE YOUR EVENTS', 'data': 'Promote your events to local talent'},
        {'heading': 'GET MORE BOOKINGS', 'data': 'Robust booking information and tracking.'},
        {'heading': 'GET PAID SECURELY', 'data': 'Most secure financial transactions using PayPal'},
        {'heading': 'SHOWCASE MEMORIES', 'data': 'You can upload and share beautiful images of yur establishment.'},
        {'heading': 'GET INTO YOUR DASHBOARD', 'data': 'Intricate dashboard designed to see quick profile stats and trends.'},
        {'heading': 'AND MANY MORE', 'data': 'You can also get many more features with time.'},
        {'heading': 'BUILD YOUR NETWORK', 'data': '<p>With vasma you can allow artists to auditions for paid gigs or perform for an open mic event you are hosting!</p><p>Wondering about quality for you paid performances? Worry not! All our artists undergo an intense curriculam before they can be paid for performance to make sure you are getting the absolute best.</p>'},
      ]
    }
  };

    // Carousel functions
    customOptions: any = {
      loop: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      lazyLoad: false,
      nav: false,
      dots: true,
      navSpeed: 300,
      navText: ['', ''],
      margin: 20,
      responsive: {
        0: { items: 1, slideBy: 1, stagePadding: 0 }
      },
      autoplay: true
    };
}
