import { Component, OnInit } from '@angular/core';
import { ChatBoxService } from 'src/app/services/chat-box.service';
import { ChatListItem } from 'src/app/models/chat-box.model';

@Component({
  selector: 'app-chat-box-header',
  templateUrl: './chat-box-header.component.html',
  styleUrls: ['./chat-box-header.component.scss']
})
export class ChatBoxHeaderComponent implements OnInit {
  selectedChat: ChatListItem = null;
  chatWindowHeader = 'Conversations';
  chatBoxState;
  constructor(
    private _chat: ChatBoxService
  ) { }

  ngOnInit() {
    this.chatBoxState = this._chat._getChatBoxState();
    this._chat._onChatBoxStateUpdate.subscribe(state => this.chatBoxState = state);
    this.selectedChat = this._chat._getSelectedChat();
    this._chat._onSelectedChatUpdate.subscribe((chatData: any) => this.selectedChat = chatData);
  }

  toggleMinimize() {
    this._chat._toggleChatMinimize();
  }

  toggleChatWindow() {
    this._chat._toggleChatWindow();
  }

  goToChatList() {
    this._chat._selectChatListItem(null);
  }
}
