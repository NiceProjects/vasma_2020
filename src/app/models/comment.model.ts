export class CommentModel {
  constructor(
    public cOn?: string,
    public cBy?: string,
    public cTime?: number,
    public cText?: string,
    public reply?: CommentReply[]
  ) {
    const Obj = {
      cOn: cOn || null,
      cBy: cBy || null,
      cTime: cTime || null,
      cText: cText || null,
      reply: reply || []
    };
    return Obj;
  }
}

export class CommentReply {
  constructor(
    public rBy?: string,
    public rText?: string,
    public rTime?: number
  ) {
    const Obj = {
      rBy: rBy || null,
      rText: rText || null,
      rTime: rTime || null
    };
    return Obj;
  }
}
