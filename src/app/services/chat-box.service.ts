import { Injectable } from '@angular/core';
import { ChatListItem, ChatList } from '../models/chat-box.model';
import { CusService } from './cus.service';
import { FireService } from './fire.service';
import { Subject } from 'rxjs';
import { TransactionObject } from '../models/transaction-object.model';

@Injectable({
  providedIn: 'root'
})
export class ChatBoxService {
  selectedChat: ChatListItem | 'err' | 'noChat' | any = null;
  selChatListner: any;
  selChatParticipants;
  authUser;
  chatBoxState = {
    showChatBox: false,
    selChatList: null,
    chatMinimize: false
  };
  _onChatBoxStateUpdate = new Subject<any>();
  _onSelectedChatUpdate = new Subject<ChatListItem | string>();
  _onSelChatParticipantsUpdate = new Subject<any>();
  constructor(
    private _cus: CusService,
    private _fs: FireService
  ) { }

  _getChatBoxState() {
    return this.chatBoxState;
  }

  init() {
    this.authUser = this._cus.getAuthUser();
    this._cus.onAuthUserUpdate.subscribe(user => this.authUser = user);
  }

  _selectChatListItem(clUid: string) {
    this.selectedChat = null;
    this._onSelectedChatUpdate.next(this.selectedChat);
    this.chatBoxState.selChatList = clUid;
    if (this.chatBoxState.selChatList) {
      this.chatBoxState.chatMinimize = false;
      this.chatBoxState.showChatBox = true;
      this.fetchChatItem(this.chatBoxState.selChatList);
    }
    this._onChatBoxStateUpdate.next(this.chatBoxState);
  }

  _toggleChatWindow() {
    this.chatBoxState.showChatBox = !this.chatBoxState.showChatBox;
    if (!this.chatBoxState.showChatBox) {
      this.chatBoxState.chatMinimize = false;
    }
    this.chatBoxState.selChatList = null;
    this.selectedChat = null;
    this.selChatParticipants = null;
    this._onSelChatParticipantsUpdate.next(this.selChatParticipants);
    this._onSelectedChatUpdate.next(this.selectedChat);
    this._onChatBoxStateUpdate.next(this.chatBoxState);
  }

  fetchChatItem(clUid: string) {
    this._fs.getChatListItem(clUid).once('value').then(snap => {
      const resp = snap.val();
      if (resp) {
        this.selectedChat = snap.val();
        this.setChatParticipants(this.selectedChat.pt);
        this.watchSelectedChatMessages(clUid);
        this.fetchParticipantsLastSeen(this.selectedChat.pt, clUid);
      }
      else {
        this.selectedChat = 'noChat';
        this.setChatParticipants(null);
        this._onSelectedChatUpdate.next(this.selectedChat);
      }
      this._onSelectedChatUpdate.next(this.selectedChat);
      console.log('Chat loaded', this.selectedChat);
    }, err => {
      this.selectedChat = 'err';
      console.log(err);
      this._onSelectedChatUpdate.next(this.selectedChat);
    });
  }

  watchSelectedChatMessages(clUid: string) {
    this._fs.chatListMessages(clUid).on('value', snap => {
      this.selectedChat.msgs = snap.val();
      this._onSelectedChatUpdate.next(this.selectedChat);
    })
  }

  fetchParticipantsLastSeen(pt, clUid) {
    const participants = Object.keys(pt);
    participants.forEach(e => {
      this._fs.chatParticipantLastSeen(clUid, e).on('value', snap => {
        // console.log('last seen updated', snap.val());
        const val = snap.val();
        if (val) {
          this.selChatParticipants[e].ls = val.ls;
          this._onSelChatParticipantsUpdate.next(this.selChatParticipants);
        }
      })
    });
  }

  watchChatParticipantsUpdate(clUid) {
    this._fs.chatParticipants(clUid).on('child_added', snap => {
      console.log(snap.val());
    })
  }

  _getSelectedChat(): any {
    return this.selectedChat;
  }

  _toggleChatMinimize() {
    this.chatBoxState.chatMinimize = !this.chatBoxState.chatMinimize;
    this._onChatBoxStateUpdate.next(this.chatBoxState);
  }

  closeSelChatListner() {
    if (this.selChatListner) {
      // this.selChatListner.off();
    }
  }

  _getSelChatParticipants() {
    return this.selChatParticipants;
  }

  setChatParticipants(pt: any) {
    if (pt) {
      const ptArr = Object.keys(pt);
      this.selChatParticipants = pt;
      if (this.authUser.uid && this.selChatParticipants[this.authUser.uid]) {
        this.selChatParticipants[this.authUser.uid].self = true;
      }
      for (let uid of ptArr) {
        this._fs.getUserDp(uid).once('value').then(snap => {
          this.selChatParticipants[uid].dp = snap.val();
          this._onSelChatParticipantsUpdate.next(this.selChatParticipants);
          console.log(this.selChatParticipants);
        });
        this._fs.getUserName(uid).once('value').then(snap => {
          this.selChatParticipants[uid].userName = snap.val();
          this._onSelChatParticipantsUpdate.next(this.selChatParticipants);
        });
        this._fs.getBusinessName(uid).once('value').then(snap => {
          this.selChatParticipants[uid].businessname = snap.val();
          this._onSelChatParticipantsUpdate.next(this.selChatParticipants);
        });
      }
    } else {
      this.selChatParticipants = null;
      this._onSelChatParticipantsUpdate.next(this.selChatParticipants);
    }
  }

  _OpenBookingConversation(booking: TransactionObject) {
    const clUid = 'bid-' +booking.trId;
    this._fs.getChatListExistance(clUid).once('value').then(snap => {
      if (snap.val()) {
        console.log('Chat is exist');
        this._selectChatListItem(clUid);
      } else {
        console.log(`Chat object not exist for booking id ${clUid}. Creating new chat object`);
        // console.log(this.createChatObject('booking', booking));
        this._fs.createChatObject(this.createChatObject('booking', booking), clUid).then(snap => {
          this._selectChatListItem(clUid);
        }).catch(err => {
          console.log(err);
        });
      }
    })
  }

  createChatObject(type: string, dataObj?: any) {
    let chatObj = null;
    if (type == 'booking') {
      let booking: TransactionObject = dataObj;
      let pt: any = {};
      pt[booking.trBy] = {ls: new Date().getTime()};
      pt[booking.trTo] = {ls: new Date().getTime()};
      chatObj = new ChatListItem(
                        booking.trInitAt, {
                          0: { msg: `Booking order placed with booking referrence id: ${booking.bId}.`, time: new Date().getTime()},
                          1: { msg: `You can communicate here for any help required.`, time: new Date().getTime() }
                        }, booking.bId, null, pt, 'booking'
                      );
    }
    return chatObj;
  }
}
