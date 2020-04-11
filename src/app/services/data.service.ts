import { Injectable } from '@angular/core';
import { CustDateObj } from '../models/custom-date.model';
import { TO_OBJ, TpOutput } from '../models/date-time-picker-output-model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  // getObjectKeys(obj) {
  // }

  trimData(e: string) {
    return e.replace(/\s+/g, ' ').trim();
  }

  copyObjData(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  getDataWithObj(obj) {
    if (!obj) return null;
    else {
      let dtArr = [];
      const keys = Object.keys(obj);
      for (let x of keys) {
        dtArr.push(obj[x]);
      }
      return dtArr;
    }
  }

  getDataWithObjWithKeys(obj) {
    if (!obj) return null;
    else {
      let dtArr = [];
      const keys = Object.keys(obj);
      for (let x of keys) {
        let _obj = obj[x];
        _obj.uid = x;
        dtArr.push(_obj);
      }
      return dtArr;
    }
  }

  getWeekNameString(id: number, format?: 'aaa' | 'aaaa') {
    const dArr = ['sunday', 'monday', 'tuesday', 'wednusday', 'thursday', 'friday', 'saturday'];
    if (format === 'aaa') return dArr[id].slice(0, 2);
    if (format === 'aaaa' || !format) return dArr[id];
  }

  getFinalPrice(bp) {
    const a = bp + (bp * 0.1);        // Added 10% vasma Margin;
    const b = a * 0.0625;             // Commercial tax value;
    const c = ((a + b) * 0.06) + 0.3; // Added 6% + 0.3 USD payment gateway charges to whole amount (a + b)
    return c;
  }

  getQuillToolbar(n: number) {
    if (n === 0) {
    const controls = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'clean'],         // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],                         // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],                // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],                    // outdent/indent
        [{ 'size': ['small', false, 'large', 'huge'] }],            // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
//        [],                                                       // remove formatting button
        ['link'],
      ]
    }
    return controls;
    }
  }

  getDateObj(dt?: any): CustDateObj {
    const DT = dt || new Date();
    const d = new Date(DT);
    let dtObj: CustDateObj = new CustDateObj();
    dtObj.date = d.getDate();
    dtObj.day = d.getDay();
    dtObj.year = d.getFullYear();
    dtObj.month = d.getMonth();
    dtObj.dayStTime = new Date(dtObj.year, dtObj.month, dtObj.date).getTime();
    dtObj.dayEndTime = new Date(dtObj.year, dtObj.month, dtObj.date + 1).getTime() - 1;
    dtObj.timeStamp = d.getTime();
    return dtObj;
  }

  getTimeObjformString(ts: string): TpOutput  {
    const _tmp = new TpOutput(ts);
    return _tmp;
  }
  getTimeObjformNumber(ts: number): TpOutput  {
    // const _tmp = new TpOutput(ts);
    return;
  }

  getMetaFielName(filename) {
    let obj = {
      rawFileName: filename || null,
      ext: filename.split('.')[1] || null,
      sanitizedFileName: filename.replace('[^a-zA-Z0-9\\.\\-]', '_') || null,
    };
    return obj;
  }

  replaceThumbString(name: string) {
    const thumbs = ['_thumb_xl_', '_thumb_sm_', '_thumb_md_', '_thumb_lg_'];
    if (name.startsWith('_thumb_xl_' || '_thumb_sm_' || '_thumb_md_' || '_thumb_lg_')) return name.slice(10, name.length - 1);
    return name;
  }


  sanitizeFileName(name: string) {
    const replacementObj = {
      'é': 'e',
      'è': 'e',
      'ë': 'e',
      'ê': 'e',
      'à': 'a',
      'ä': 'ae',
      'â': 'a',
      'Ä': 'Ae',
      'ù': 'u',
      'ü': 'ue',
      'û': 'u',
      'Ü': 'Ue',
      'ö': 'oe',
      'ô': 'o',
      'Ö': 'Oe',
      'ï': 'i',
      'î': 'i',
      'ß': 'ss',
      ' ': '_',
    };
    const specialCharac = ['!', '@', '#', '$', '%', '^', '&'];
    const rawArr = name.split('');
  }


  // getFileExt() {

  // }

}
