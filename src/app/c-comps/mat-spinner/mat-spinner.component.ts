import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { spinnerConfig } from './spinner-model';

@Component({
  selector: 'app-mat-spinner',
  templateUrl: './mat-spinner.component.html',
  styleUrls: ['./mat-spinner.component.scss']
})
export class MatSpinnerComponent implements OnInit, OnChanges {
  @Input('data-config') initConfig: spinnerConfig;
  // @Input('mode') mode: string;
  // @Input('diameter') dia: number;
  // @Input('s-width') sw: number;
  // @Input('value') val: number;
  // @Input('type') type: 'bar' | 'spinner';
  // @Input('show-percent') svp: boolean;
  // @Input('show-value') sv: boolean;

  config: spinnerConfig;
  constructor() { }

  ngOnInit() {
    this.setConfig();
  }

  ngOnChanges() {
    this.setConfig();
  }

  setConfig() {
    if (this.initConfig) {
      this.config = {
        color: this.initConfig.color || 'warn',
        mode: this.initConfig.mode || 'determinate',
        dia: this.initConfig.dia || 80,
        sWidth: this.initConfig.sWidth || 7,
        value: this.initConfig.value || 50,
        type: this.initConfig.type || 'bar',
        showPerc: this.initConfig.showPerc || true,
        showVal: this.initConfig.showVal || true
      };
    } else {
      this.config = new spinnerConfig();
    }
  }


  get spinnerBoxStyle() {
    const style = {
      'min-height': this.config.dia + 'px',
      'min-width': this.config.dia + 'px',
    };
    return style;
  }

  get spinnerStyle() {
    const style = {
        'min-height': this.config.dia + 'px',
        'min-width': this.config.dia + 'px',
      };
    return style;
  }

  get valueStyle() {
    const style = {
      'font-size': (this.config.dia * 0.3) + 'px',
      'line-height': 1,
      'font-family': '"Roboto Condensed", sans-serif',
      'font-weight': 300
    };
    return style;
  }


}
