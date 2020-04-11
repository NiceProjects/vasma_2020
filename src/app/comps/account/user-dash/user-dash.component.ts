import { Component, OnInit } from '@angular/core';
import { CusService } from 'src/app/services/cus.service';
import { PublicUser, PrivateUserData } from 'src/app/models/user.model';
import { spinnerConfig } from 'src/app/c-comps/mat-spinner/spinner-model';
import { DocumentTitleService } from 'src/app/services/document-title.service';

@Component({
  selector: 'app-user-dash',
  templateUrl: './user-dash.component.html',
  styleUrls: ['./user-dash.component.scss', './db-card.scss', './db-card.css']
})
export class UserDashComponent implements OnInit {
  authUser: PublicUser;
  pud: PrivateUserData;
  isVenue = false;
  isartist = false;
  isStudio = false;
  profStrConfig: spinnerConfig = {
    mode: 'determinate',
    type: 'spinner',
    value: 60,
    showPerc: true,
    showVal: true,
    color: 'warn',
    dia: 60,
    sWidth: 4
  };
  constructor(
    private cus: CusService,
  ) { }

  ngOnInit() {
    this.authUser = this.cus.getAuthUser();
    // console.log(this.authUser);
    this.pud = this.cus.getAuthPdt();
    this.cus.onAuthUserUpdate.subscribe(data => {
      this.authUser = data;
      this.setUserType();
    });
    this.cus.onAuthpdtUpdate.subscribe(data => this.authUser = data);
    this.setUserType();
  }

  setUserType() {
    if (this.authUser) {
      this.isVenue = this.authUser.userType === 'venue';
      this.isartist = this.authUser.userType === 'artist';
      this.isStudio = this.authUser.userType === 'studio';
    }
  }

}
