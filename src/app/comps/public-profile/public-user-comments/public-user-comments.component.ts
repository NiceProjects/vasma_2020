import { Component, OnInit } from '@angular/core';
import { FireService } from 'src/app/services/fire.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CusService } from 'src/app/services/cus.service';
import { CommentModel } from 'src/app/models/comment.model';
import { filter } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { PublicUser } from 'src/app/models/user.model';
import { RegExps } from 'src/app/models/regExp.model';
import { ProfileViewService } from 'src/app/services/profile-view.service';

@Component({
  selector: 'app-public-user-comments',
  templateUrl: './public-user-comments.component.html',
  styleUrls: ['./public-user-comments.component.scss']
})
export class PublicUserCommentsComponent implements OnInit {
  profileKey;
  userId: string;
  userComments: CommentModel[];
  commentsLoaded = false;
  singleCommentId: string;
  singleComment: CommentModel;
  authUser: PublicUser;
  regEx: RegExps = new RegExps();
  showUserAvatar = true;
  commentInput;
  constructor(
    private fs: FireService,
    private route: ActivatedRoute,
    private router: Router,
    private cus: CusService,
    private ds: DataService,
    private _pv: ProfileViewService
  ) { }

  ngOnInit() {
    this.userId = this._pv.getProfUID;
    if (this.userId) this.listenToComments();
    this._pv.onProfUidUpdate.subscribe(uid => {
      this.userId = uid;
      if (this.userId) this.listenToComments();
      else this.userComments = [];
    });

    this.authUser = this.cus.getAuthUser();
    this.cus.onAuthUserUpdate.subscribe(udt => {
      this.authUser = udt;
    });
  }

  listenToComments() {
    this.fs.getUserComments(this.userId).once('value').then(res => {
      this.continueWithCmmentsResponse(res.val());
    });
    this.fs.getUserComments(this.userId).on('child_added', child => {
      let data = [];
      data.push(child.val());
      data.push(...this.userComments);
      // console.log(data);
      this.userComments = data;
    });
  }

  continueWithCmmentsResponse(data) {
    if (data) {
      const _arr = this.ds.getDataWithObjWithKeys(data);
      this.userComments = _arr.sort((a: CommentModel, b: CommentModel) => b.cTime - a.cTime);
    } else {
      this.userComments = null;
    }
    this.commentsLoaded = true;
    // console.log(this.userComments);
  }

  submitComment() {
    if (!this.authUser) {
      alert('Unable to submit comment. Please login to submit your comment');
    } else {
      if (this.commentInput && this.commentInput !== '') {
        const comment = new CommentModel(
          this.userId,
          this.authUser.uid,
          new Date().getTime(),
          this.ds.trimData(this.commentInput)
        );
        this.fs.submitComment(comment).then(() => {
          this.commentInput = '';
          // alert('Your comment submitted successfully');
        });
      }
    }
  }

}

