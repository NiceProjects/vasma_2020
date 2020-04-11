import { Component, OnInit, Input } from '@angular/core';
import { NotificationModel } from 'src/app/models/notification.model';
import { FireService } from 'src/app/services/fire.service';
import { PublicUser } from 'src/app/models/user.model';

@Component({
  selector: 'app-notification-prev-link',
  templateUrl: './notification-prev-link.component.html',
  styleUrls: ['./notification-prev-link.component.scss']
})
export class NotificationPrevLinkComponent implements OnInit {
  @Input('data-notify') notify: NotificationModel;

  isComment: boolean;
  isProspect: boolean;
  isOthers: boolean;

  cmtrData: PublicUser;
  commentor: any = {
    userName: 'A user',
    uniqId: null,
    businessName: null
  };
  constructor(
    private fs: FireService
  ) { }

  ngOnInit() {
    this.setNotificationType().then(() => {
      if (['comment', 'prospect'].indexOf(this.notify.type) >= 0) {
        this.fs.getBusinessName(this.notify.refUserId).once('value').then(res => this.commentor.businessName = res.val());
        this.fs.getUserName(this.notify.refUserId).once('value').then(res => this.commentor.userName = res.val());
        this.fs.getUniqueId(this.notify.refUserId).once('value').then(res => this.commentor.uniqId = res.val());
      }
    });
  }

  setNotificationType() {
    return new Promise((res, rej) => {
      switch (this.notify.type) {
        case 'comment': this.isComment = true; break;
        case 'prospect': this.isProspect = true; break;
        case 'others': this.isOthers = true; break;
      }
      res();
    });
  }

  // getIcon(type: string) {
  //   let icon = '';
  //   switch (type) {
  //     case 'comment': icon = 'comment'; break;
  //   }
  // }

}
