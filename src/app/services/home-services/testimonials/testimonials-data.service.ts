import { Injectable } from '@angular/core';
import { Testimonial } from './testimonials-model';

@Injectable({
  providedIn: 'root'
})
export class TestimonialsDataService {
  testimonials: Testimonial[] = [
    new Testimonial(
      'when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
      'Anthony',
      'Edward',
      'Tony Stark',
      '/assets/img/project-heroes/tony_stark.png'
      ),
    new Testimonial(
      'sum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English. Many desktop publishing packages and web pa.',
      'Mark',
      'Ruffalo',
      'Hulk',
      '/assets/img/project-heroes/hulk.png'
      ),
    new Testimonial(
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
      'Chris',
      'Evans',
      'Captain America',
      '/assets/img/project-heroes/captain.png'
      )
  ];
  constructor() {
  }

  getTestimonials() {
    if (!this.testimonials.length) return null;
    return JSON.parse(JSON.stringify(this.testimonials));
  }
}
