import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { DevService } from 'src/app/services/dev.service';
import { TpOutput } from 'src/app/models/date-time-picker-output-model';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent implements OnInit, OnChanges {
  @Input('input-mode') mode: 'date' | 'time';
  @Input('data-value') value: number;
  @Input('data-invalid') invalidInput: boolean | null;
  @Input('data-read-only') readOnly?: boolean;
  @Output('onValueSet') onValueSet = new EventEmitter<any>();

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#555',
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#e10000',
      clockFaceTimeInactiveColor: '#fff'
    }
  };
  inputDateValue;
  inputTimeValue;
  smallScreenMode;
  constructor(
    private _dev: DevService
  ) { }

  ngOnInit() {
    this.smallScreenMode = window.innerWidth < 1024;
    if (!this.mode) this.mode = 'time';
    if (this.mode == 'time') this.inputTimeValue = this.value;
    else this.inputDateValue = this.value;
  }

  ngOnChanges() {
    // console.log(`Value change detected, ${this.mode}, ${this.value}`);
  }

  onDateChange(e) {
    this.onValueSet.emit(new Date(e).getTime());
  }

  onTimeChange(e) {
    this.onValueSet.emit(new TpOutput(e));
  }

}
