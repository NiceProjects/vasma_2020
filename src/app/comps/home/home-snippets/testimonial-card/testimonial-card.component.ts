import { Component, OnInit, Input } from '@angular/core';
import { Testimonial } from 'src/app/services/home-services/testimonials/testimonials-model';

@Component({
  selector: 'app-testimonial-card',
  templateUrl: './testimonial-card.component.html',
  styleUrls: ['./testimonial-card.component.scss']
})
export class TestimonialCardComponent implements OnInit {

  @Input('data-testimonial') testimonial: Testimonial
  constructor() { }

  ngOnInit() {
  }

}
