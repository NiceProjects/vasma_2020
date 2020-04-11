export class Testimonial {
  constructor(
    public compliment?: string,
    public cFname?: string,
    public cLanme?: string,
    public cDesign?: string,
    public cDp?: string,
    public uid?: string
  ) {
    const Obj = {
      compliment: compliment || null,
      cFname: cFname || null,
      cLanme: cLanme || null,
      cDesign: cDesign || null,
      cDp: cDp || null,
      uid: uid || null
    };
    return Obj;
  }
}