export class BillAmount {
  constructor(
    public bp?: number,
    public bQty?: number,
    public billAmtValue?: number,
    public charges?: ChargeDtl[],
    public commTaxPerc?: number,
    public commTaxAmt?: number,
    public taxableAmt?: number,
    public paymentGtwCharges?: number,
    public finalBillAmt?: number,
    public vc?: number
    // public
  ) {
    const Obj = {
      bp: bp || null,
      bQty: bQty || null,
      billAmtValue: billAmtValue || null,
      charges: charges || [],
      commTaxPerc: commTaxPerc || null,
      commTaxAmt: commTaxAmt || null,
      taxableAmt: taxableAmt || null,
      paymentGtwCharges: paymentGtwCharges || null,
      finalBillAmt: finalBillAmt || null,
      vc: vc || null
    };
    return Obj;
  }
}

export class ChargeDtl {
  constructor(
    public sDesc?: string,      // Short description or Name
    public lDesc?: string,       // Long description
    public amount?: number       // Amount chared
  ) {
    const Obj = {
      sDesc: sDesc || null,
      lDesc: lDesc || null,
      amount: amount || null
    };
    return Obj;
  }
}
