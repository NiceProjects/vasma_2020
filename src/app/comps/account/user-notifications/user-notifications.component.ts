import { Component, OnInit } from '@angular/core';
import { FireService } from 'src/app/services/fire.service';
import { AppDefService } from 'src/app/services/app-def.service';
import { NotificationModel } from 'src/app/models/notification.model';
import { CusService } from 'src/app/services/cus.service';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit {
  allNotifications: NotificationModel[];
  filteredNotifications: NotificationModel[] = [];
  notificationsLoaded = false;
  filterKey = 'all';
  filterKeys = ['all'];
  constructor(
    private fs: FireService,
    private ads: AppDefService,
    private cus: CusService
  ) { }

  ngOnInit() {
    this.fs.resetUNC(2000);
    this.filterKeys = this.ads.defNotificationTypes;

    this.setAllNotifications(this.cus.getNotifications());
    this.cus.onNotificationsUpdated.subscribe(d => this.setAllNotifications(d));
  }

  selectFilterKey(key: string) {
    this.filterKey = key;
    if (this.filterKey === 'all') {
      this.filteredNotifications = this.allNotifications;
    } else {
      this.filteredNotifications = this.allNotifications.filter(a => a.type === key);
    }
  }

  setAllNotifications(e) {
    this.allNotifications = e;
    this.selectFilterKey(this.filterKey);
    this.notificationsLoaded = true;
  }

}
