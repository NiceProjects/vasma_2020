import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-write-to-us',
  templateUrl: './write-to-us.component.html',
  styleUrls: ['./write-to-us.component.scss']
})
export class WriteToUsComponent implements OnInit {
  formSubmitting = false;
  formSubmitTriggered = false;
  constructor() { }

  ngOnInit() {

  }

  onSubmit(form: NgForm) {
    console.log(form.value);
  }

}
