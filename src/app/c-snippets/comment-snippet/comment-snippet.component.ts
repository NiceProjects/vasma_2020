import { Component, OnInit, Input } from '@angular/core';
import { CommentModel } from 'src/app/models/comment.model';
import { FireService } from 'src/app/services/fire.service';

@Component({
  selector: 'app-comment-snippet',
  templateUrl: './comment-snippet.component.html',
  styleUrls: ['./comment-snippet.component.scss']
})
export class CommentSnippetComponent implements OnInit {
  @Input('data-comment') comment: CommentModel;

  businessName;
  userDp;
  userName;
  userKey;
  constructor(
    private fs: FireService
  ) { }

  ngOnInit() {
    this.getUserData(this.comment.cBy);
  }

  getUserData(uid?: string) {
    this.fs.getUserDp(uid).once('value').then(snap => {
      this.userDp = snap.val();
    });
    this.fs.getBusinessName(uid).once('value').then(snap => {
      this.businessName = snap.val();
    });
    this.fs.getUserName(uid).once('value').then(snap => {
      this.userName = snap.val();
    });
    this.fs.getUniqueId(uid).once('value').then(snap => {
      this.userKey = snap.val();
    });
  }

}
