import { Component, OnInit, HostListener } from '@angular/core';
import { CusService } from './services/cus.service';
import { PublicUser } from './models/user.model';
import { ChatBoxService } from './services/chat-box.service';
import { MessagingService } from './services/messaging.service';
import { AppEventsService } from './services/app-events.service';
import { DocumentTitleService } from './services/document-title.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  authUser: PublicUser;
  message;
  constructor(
    private _cus: CusService,
    private _chat: ChatBoxService,
    private _msgService: MessagingService,
    private _appEvents: AppEventsService,
    private _docTitle: DocumentTitleService,
    private _Router: Router
  ) {}

  ngOnInit() {
    this._docTitle.init();
    this.authUser = this._cus.getAuthUser();
    this._cus.onAuthUserUpdate.subscribe(authUser => this.authUser = authUser);
    this._chat.init();
    this._msgService.getPermission();
    this._msgService.receiveMessage();
    this.message = this._msgService.currentMessage;
    // window.addEventListener('scroll', this.scrollEvent, true);
  }

  swipe(e) {
    console.log(e);
    const swipeStart = e.srcEvent.pageX - e.deltaX;
    const x = window.innerWidth;
    const y = window.innerHeight;
    alert(`${swipeStart} from left. Your view port dimensions are width: ${x}px, Height: ${y}px`);
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    // console.log(offset);
    this._appEvents.updateScroll(offset);
  }
}
