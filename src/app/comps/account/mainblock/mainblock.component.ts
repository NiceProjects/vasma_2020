import { Component, OnInit, HostListener } from '@angular/core';
import { PublicUser, PrivateUserData } from 'src/app/models/user.model';
import { CusService } from 'src/app/services/cus.service';

@Component({
  selector: 'app-mainblock',
  templateUrl: './mainblock.component.html',
  styleUrls: ['./mainblock.component.scss']
})
export class MainblockComponent implements OnInit {
  authUser: PublicUser;
  pdt: PrivateUserData;
  constructor(
    private cus: CusService,

  ) { }

  ngOnInit() {
    this.authUser = this.cus.getAuthUser();
    this.cus.onAuthUserUpdate.subscribe(user => this.authUser = user);
    this.pdt = this.cus.getAuthPdt();
    this.cus.onAuthpdtUpdate.subscribe(dt => this.pdt = dt);
  }

  swipe(e) {
    console.log(e);
  }


}
