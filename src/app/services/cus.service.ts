import { Injectable } from '@angular/core';
import { PublicUser, PrivateUserData, AuthUserType } from '../models/user.model';
import { Subject } from 'rxjs';
import { NotificationModel } from '../models/notification.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CusService {
  authUser: PublicUser = null;
  authUserPdt: PrivateUserData = null;
  notifications: NotificationModel[];
  onAuthUserUpdate = new Subject<PublicUser>();
  onAuthpdtUpdate = new Subject<PrivateUserData>();
  onNotificationsUpdated = new Subject<NotificationModel[]>();
  authUserType: AuthUserType = new AuthUserType();
  constructor(
    private ds: DataService
  ) { }

  getAuthUser() {
    return this.authUser;
  }

  getAuthPdt() {
    return this.authUserPdt;
  }

  getNotifications() {
    return this.notifications;
  }

  setAuthPdt(data) {
    this.authUserPdt = data;
    this.onAuthpdtUpdate.next(this.authUserPdt);
  }

  setAuthUser(user: PublicUser) {
    this.authUser = user;
    // console.log(this.authUser);
    if (user) {
      const ut = user.userType;
      this.authUserType = new AuthUserType(ut === 'artist', ut === 'venue', ut === 'studio', ut === 'unset');
    } else this.authUserType = new AuthUserType();
    this.onAuthUserUpdate.next(this.authUser);
  }

  setNotifications(nData) {
    if (nData) {
      const _dt = this.ds.getDataWithObjWithKeys(nData);
      this.notifications = _dt.sort((a: NotificationModel, b: NotificationModel) => b.nTime - a.nTime);
      this.onNotificationsUpdated.next(this.notifications);
    } else {
      this.notifications = null;
      this.onNotificationsUpdated.next(this.notifications);
    }
  }

  getAuthUserTypeObject():AuthUserType {
    return this.authUserType;
  }

  _getChatList() {
    let chatList: any = null;
    if (this.authUserPdt && this.authUserPdt.chatList) {
      const arr = Object.values(this.authUserPdt.chatList);
      console.log(arr);
      chatList = arr.sort((a, b) => b.lu - a.lu);
    }
    return chatList;
  }

}
