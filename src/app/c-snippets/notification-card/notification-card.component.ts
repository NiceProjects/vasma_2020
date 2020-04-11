import { Component, OnInit, Input } from '@angular/core';
import { NotificationModel } from 'src/app/models/notification.model';
import { FireService } from 'src/app/services/fire.service';
import { CommentModel } from 'src/app/models/comment.model';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {
  @Input('data-object') nc: NotificationModel;

  isComment: boolean;
  isProspect: boolean;
  isOthers: boolean;

  commentObject: CommentModel;
  NO = {
    type: null,
    avatar: null,
    refDispName: 'A user',
    refBName: null,
    refUserName: null,
    commentData: null,
    nError: false
  };
  constructor(
    private fs: FireService
  ) { }

  ngOnInit() {
    this.NO.type = this.nc.type;
    this.setNotificationType().then(() => {
      if (this.isComment || this.isProspect) {
        this.fs.getUserDp(this.nc.refUserId).once('value').then(snap => {
          this.NO.avatar = snap.val();
        });
        this.fs.getUserName(this.nc.refUserId).once('value').then(snap => {
          if (snap.val()) {
            this.NO.refDispName = snap.val();
          } else {
            this.NO.refUserName = 'A user';
          }
        });
        this.fs.getUniqueId(this.nc.refUserId).once('value').then(snap => {
          this.NO.refUserName = snap.val();
        });
        this.fs.getBusinessName(this.nc.refUserId).once('value').then(snap => this.NO.refBName = snap.val());
      }
      if (this.isComment) {
        this.fs.getSingleCommentData(this.nc.refObjId).once('value').then(snap => {
          this.commentObject = snap.val();
        }).catch(err => {
          // console.log(err);
          this.NO.nError = true;
        });
      }
    });
  }

  setNotificationType() {
    return new Promise((res, rej) => {
      switch (this.nc.type) {
        case 'comment': this.isComment = true; break;
        case 'prospect': this.isProspect = true; break;
        case 'others': this.isOthers = true; break;
      }
      res();
    });
  }
}
