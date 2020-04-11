import { Component, OnInit, Input } from '@angular/core';
import { FireService } from 'src/app/services/fire.service';
import { VenueEventData } from 'src/app/models/venue-event.model';

@Component({
  selector: 'app-venue-event-card',
  templateUrl: './venue-event-card.component.html',
  styleUrls: ['./venue-event-card.component.scss']
})
export class VenueEventCardComponent implements OnInit {
  venueEvent: VenueEventData;
  isLoading = true;
  loadingErr = false;

  @Input('data-event-id') eventId: string;
  constructor(
    private _fs: FireService
  ) { }

  ngOnInit() {
    console.log(this.eventId);
    this._fs.getVenueEventWithEventId(this.eventId).on('value', snap => {
      const resp = snap.val();
      if (!resp) return;
      this.venueEvent = resp;
      this.isLoading = false;
    }, err => {
      console.log(err);
      this.isLoading = false;
      this.loadingErr = true;
    });
  }

  updatePublishState(e) {
    console.log(e.checked);
    this._fs.getVenueEventWithEventId(this.eventId).child('publish').set(e.checked)
    .then(snap => console.log(snap))
    .catch(err => console.log(err));
  }

}
