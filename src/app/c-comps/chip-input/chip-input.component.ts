import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss']
})
export class ChipInputComponent implements OnInit {

  @Input('data-input') inputChips: string[];
  @Input('data-auto-complete') autoCompleteList: string[];
  @Input('data-label') label: string;
  @Input('data-hint') hint: any;
  @Output('data-out') outputData = new EventEmitter<string[]>();

  tmpData = '';
  filteredList = [];
  constructor() { }

  ngOnInit() {
    if (!this.inputChips) {
      this.inputChips = [];
    }
    if (this.inputChips.length < 1)  {
      this.inputChips = [];
    }
  }

  onChange() {
    this.outputData.emit(this.inputChips);
  }

  removeIt(id: number) {
    this.inputChips.splice(id, 1);
    this.onChange();
  }

  addIt(val: string) {
    if (val.length && val !== ' ') {
      const arr = val.split(',');
      arr.forEach(e => this.inputChips.push(e.replace(/\s+/g, ' ').trim()));
      this.onChange();
    }
    this.tmpData = '';
  }

  filterAutoComplete(str) {
    // console.log(str);
    if (this.autoCompleteList && str) {
      const key = str.toLowerCase();
      this.filteredList = this.autoCompleteList.filter((e: any) => e.key.toLowerCase().match(key));
    }
  }
}
