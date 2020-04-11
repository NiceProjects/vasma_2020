import { Component, OnInit } from '@angular/core';
import { CusService } from 'src/app/services/cus.service';
import { ChatListItem, ChatList } from 'src/app/models/chat-box.model';
import { ChatBoxService } from 'src/app/services/chat-box.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  userChatList: ChatList[] = [
    // new ChatList(jhjdshdsbvhdsb, 0),
    // new ChatList(kfsjdnjhdjhdbvjhdb, 100000000)
  ];
  constructor(
    private _cus: CusService,
    private _chat: ChatBoxService
  ) { }

  ngOnInit() {
    this.userChatList = this._cus._getChatList();
    this._cus.onAuthpdtUpdate.subscribe(() => {
      this.userChatList = this._cus._getChatList();
    });
  }

  selectThisChat(clUid: string) {
    this._chat._selectChatListItem(clUid);
  }

}
