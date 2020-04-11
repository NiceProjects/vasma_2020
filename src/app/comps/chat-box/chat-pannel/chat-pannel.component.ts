import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatBoxService } from 'src/app/services/chat-box.service';
import { ChatListItem, ChatMessage } from 'src/app/models/chat-box.model';
import { FireService } from 'src/app/services/fire.service';
import { PublicUser } from 'src/app/models/user.model';
import { CusService } from 'src/app/services/cus.service';
import { DataService } from 'src/app/services/data.service';
import * as $ from "jquery";

@Component({
  selector: 'app-chat-pannel',
  templateUrl: './chat-pannel.component.html',
  styleUrls: ['./chat-pannel.component.scss', './chat-pannel.component.css']
})
export class ChatPannelComponent implements OnInit, OnDestroy {
  chatBoxStatus;
  ChatItem: ChatListItem;
  messages: ChatMessage[] = [];
  participants: any;
  authUser: PublicUser;
  replyMsg = '';
  chatChangesSubscription;
  mainParticipantLastSeen = 0;
  mainParticipant;
  constructor(
    private _chat: ChatBoxService,
    private _fs: FireService,
    private _cus: CusService,
    private _ds: DataService
  ) { }

  ngOnInit() {
    this.authUser = this._cus.getAuthUser();
    this._cus.onAuthUserUpdate.subscribe(user => this.authUser = user);
    this.chatBoxStatus = this._chat._getChatBoxState();
    this._chat._onChatBoxStateUpdate.subscribe(cbs => this.chatBoxStatus = cbs);
    this.ChatItem = this._chat._getSelectedChat();
    this.assignChatData();
    this.adjustChatboxScroll(0);
    this._chat._onSelectedChatUpdate.subscribe((chat: any) => {
      this.ChatItem = chat;
      this.assignChatData();
      if (chat) {
        this._fs.updateChatLastSeen(this.chatBoxStatus.selChatList).then(() => null);
        this.adjustChatboxScroll(100);
      }
    });

    this.participants = this._chat._getSelChatParticipants();
    this.mainParticipant = this.getMainParticipant();
    this.setMainParticipantLastSeen();
    this._chat._onSelChatParticipantsUpdate.subscribe(res => {
      // console.log(res);
      if(res) {
        this.participants = res;
        this.mainParticipant = this.getMainParticipant();
        this.setMainParticipantLastSeen();
      }
    });

    setTimeout(() => {
      console.log('Final participants List', this.participants);
      console.log(this.chatBoxStatus.selChatList);
      if (this.chatBoxStatus.selChatList) return this._fs.updateChatLastSeen(this.chatBoxStatus.selChatList);
    }, 1000)
  }

  ngOnDestroy() {
    // this.chatChangesSubscription.unsubscribe();
  }

  assignChatData() {
    if (this.ChatItem && this.ChatItem.msgs) {
      const _tmpArr = Object.values(this.ChatItem.msgs);
      this.messages = _tmpArr.sort((a: ChatMessage, b: ChatMessage) => a.time - b.time);
    }
  }

  getValues(obj): any[] {
    if (obj !== null || obj !== undefined) return Object.values(obj);
    else return [];
  }

  sendMessage() {
    const msg = this._ds.trimData(this.replyMsg);
    console.log(msg);
    if (msg !== '' && msg !== ' ') {
      const chatMsg = new ChatMessage(this.authUser.uid, msg, new Date().getTime());
      this._fs.sendChatMessage(this.chatBoxStatus.selChatList, chatMsg).then(() => {
        this.replyMsg = '';
      });
    }
  }

  adjustChatboxScroll(timeMs: number) {
    setTimeout(() => {
      $('.messages-display-block').animate({ scrollTop: $('.messages-display-block')[0].scrollHeight}, timeMs);
    }, 100)
  }

  getMainParticipant() {
    const pt = Object.keys(this.participants);
    const pt2 = pt.filter(e => e !== this.authUser.uid);
    return pt2[0];
  }

  isThisMessageSeen(time: number) {
    if (this.mainParticipant) {
      return this.participants[this.mainParticipant].ls >= time;
    } else return false;
  }

  setMainParticipantLastSeen() {
    // console.log(this.participants[this.mainParticipant]);
    this.mainParticipantLastSeen = this.participants[this.mainParticipant].ls;
  }

  swipe(e) {
    this._chat._selectChatListItem(null);
    console.log(e);
  }
}
