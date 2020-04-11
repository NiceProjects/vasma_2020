import { Component, OnInit, Input } from '@angular/core';
import { ChatListItem } from 'src/app/models/chat-box.model';
import { FireService } from 'src/app/services/fire.service';
import { PublicUser } from 'src/app/models/user.model';
import { CusService } from 'src/app/services/cus.service';
import { ChatMessage } from 'src/app/models/message.model';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.scss', 'chat-list-item.component.css']
})
export class ChatListItemComponent implements OnInit {
  @Input('data-chat-id') clUid?: string;
  chatItem: ChatListItem;
  authUser: PublicUser;
  allParticipants;
  participants = [];
  hasUnreadMessages = false;
  lastMessageTime;
  constructor(
    private _fs: FireService,
    private _cus: CusService
  ) { }

  ngOnInit() {
    this.authUser = this._cus.getAuthUser();
    this._cus.onAuthUserUpdate.subscribe(user => {
      this.authUser = user;
    })
    if(this.clUid) {
      this._fs.getChatListItem(this.clUid).once('value', snap => {
        this.chatItem = snap.val();
        // console.log(this.chatItem);
        this.getParticipants();
        this.checkUnreadMessages();
        this.watchChatObject();
      });
    }
  }

  watchChatObject() {
    this._fs.getChatListItem(this.clUid).on('value', snap => {
      this.chatItem = snap.val();
      // console.log(this.chatItem);
      this.getParticipants();
      this.checkUnreadMessages();
    });
  }

  getParticipants() {
    if (this.chatItem && this.chatItem.pt && this.authUser) {
      this.allParticipants = this.chatItem.pt;
      const _tmpPtArr = Object.keys(this.chatItem.pt);
      this.participants = _tmpPtArr.filter(e => e !== this.authUser.uid);
      this.participants.forEach(e => {
        this._fs.getUserDp(e).on('value', snap => this.allParticipants[e].dp = snap.val());
        this._fs.getUserName(e).on('value', snap => this.allParticipants[e].uName = snap.val());
        this._fs.getBusinessName(e).on('value', snap => this.allParticipants[e].bName = snap.val());
      })
    }
  }

  checkUnreadMessages() {
    if (this.chatItem && this.chatItem.msgs) {
      const msgs = Object.values(this.chatItem.msgs);
      const sortedMsgs: any = msgs.sort((a: any, b: any) => b.time - a.time);
      this.lastMessageTime = sortedMsgs[0].time;
      // console.log('Sorted messages', sortedMsgs);
      if (this.lastMessageTime > this.allParticipants[this.authUser.uid].ls) {
        this.hasUnreadMessages = true;
      }
    }
  }
}
