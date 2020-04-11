import { Component, OnInit } from '@angular/core';
import { TestimonialsDataService } from 'src/app/services/home-services/testimonials/testimonials-data.service';
import { Testimonial } from 'src/app/services/home-services/testimonials/testimonials-model';

@Component({
  selector: 'app-home-lg',
  templateUrl: './home-lg.component.html',
  styleUrls: ['./home-lg.component.scss']
})
export class HomeLgComponent implements OnInit {
  rippleColor = `rgba(0, 0, 0, 0.125)`;
  userType = 'venue';
  testimonials: Testimonial[] = [];
  constructor(
    private _testimonials: TestimonialsDataService
  ) { }

  ngOnInit() {
    this.testimonials = this._testimonials.getTestimonials();
  }

  onSelectUserType(type) {
    this.userType = type;
  }

  // Carousel functions
  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    lazyLoad: false,
    nav: false,
    dots: false,
    navSpeed: 300,
    navText: ['', ''],
    margin: 20,
    responsive: {
      0: { items: 2, slideBy: 1, stagePadding: 15 },
      900: { items: 3, slideBy: 1, stagePadding: 15 }
    }
  };

  carTranslated(e) {
    console.log(e);
  }

  carInit(e) {
    console.log(e);
  }

  // Carousel functions ends

}
