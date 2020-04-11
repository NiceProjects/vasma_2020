import { Injectable } from '@angular/core';
import { FireService } from './fire.service';
import * as firebase from 'firebase/app';
import 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class VenueEventService {

  constructor(
    private _fs: FireService
  ) { }

  venueEventActions(eventId: string) {
    return firebase.database().ref(`/privateList/venue_event_responses/${eventId}/actions/`);
  }

  geteventRegStat(eventId: string, userId: string) {
    return firebase.database().ref(`/privateList/venue_event_responses/${eventId}/registrants/${userId}/`);
  }

}
