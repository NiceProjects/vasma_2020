export class NotificationModel {
  constructor(
    public type?: 'comment' | 'prospect' | 'creply' | 'transaction' | 'others',
    public nTime?: number,
    public linkTo?: string,
    public message?: string,
    public actionBy?: string,
    public refObjId?: string,         // Comment push Id
    public refUserId?: string         // Commentor uid
  ) {}
}
