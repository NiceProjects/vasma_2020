import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevService {
  host: string;
  devEnv = ['localhost:4301'];
  constructor() { }

  consoleIt(a?: any, b?: any, c?: any) {
    const host = window.location.host;
    // console.log(host);
    if (host.startsWith('localhost') || this.devEnv.indexOf(host) >= 0) {
      if (a && b && c) return console.log(a, b, c);
      if (a && b && !c) return console.log(a, b);
      if (a && !b && !c) return console.log(a);
    }
  }
}
