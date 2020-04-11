import { Component, OnInit, HostListener } from '@angular/core';
import { ChatBoxService } from 'src/app/services/chat-box.service';
import { DevService } from 'src/app/services/dev.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss', 'chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {
  chatBoxState;
  viewPort = {height: null, width: null};
  constructor(
    private _chat: ChatBoxService,
    private _dev: DevService
  ) { }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setViewPort();
  }
  ngOnInit() {
    this.chatBoxState = this._chat._getChatBoxState();
    this._chat._onChatBoxStateUpdate.subscribe(e => this.chatBoxState = e);
    console.log(this.chatBoxState);
    this.setViewPort();
  }

  setViewPort() {
    this.viewPort.height = window.innerHeight;
    this.viewPort.width = window.innerWidth;
  }

  toggleConversations() {
    this._chat._toggleChatWindow();
  }

  openChatBox() {
    if (this.chatBoxState.chatMinimize && this.chatBoxState.showChatBox) {
      this._chat._toggleChatMinimize();
    }

    if (!this.chatBoxState.showChatBox) {
      this.toggleConversations();
    }
  }

  swipe(e, from) {
    console.log('Chat box swipe event', e, from);
    const distanceX = Math.abs(e.deltaX);
    const xStart = e.srcEvent.pageX - distanceX;
    console.log(this.viewPort.width <= 575.98 , xStart < 150 , distanceX >= 60)
    if (this.viewPort.width <= 575.98 && xStart < 200 && distanceX >= 60) {
      if (from == 'chatPannel') return this._chat._selectChatListItem(null);
      if (from == 'chatList') return this._chat._toggleChatWindow();
    }
  }

}
