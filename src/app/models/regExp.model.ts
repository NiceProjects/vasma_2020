export class RegExps {
  constructor(
    public email?: any,
    public usZipCode?: any,
    public mobileNum?: any,
    public name?: any,
    public userName?: any,
    public albumName?: any,
    public uniqProfId?: any,
    public businessName?: any,
    public plainText?: any,
    public shortServCode?: any,
    public pricingUnit?: any,
    public price?: any
  ) {
    const regExp = {
      email: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,}$/,
      usZipCode: `[0-9]{5}`,
      mobileNum: `[0-9]{10}`,
      businessName: /^[a-zA-Z0-9][a-zA-Z0-9\.\s\&\#]{0,}$/,
      name: /^[A-Za-z0-9]{1,24}$/,
      userName: /^[a-zA-Z][a-zA-Z0-9\s]{1,24}$/,
      albumName: /^[a-zA-Z][a-zA-Z0-9\s]{5,24}$/,
      uniqProfId: /^[a-zA-Z][a-zA-Z0-9_]{4,19}$/,
      plainText: /[A-Za-z0-9]/,
      shortServCode: /^[a-zA-Z][a-zA-Z0-9_]{2,9}$/,
      pricingUnit:  /^[a-zA-Z][a-zA-Z]{2,9}$/,
      price: /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/
    };
    return regExp;
  }
}
