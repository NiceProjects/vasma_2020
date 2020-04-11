export class PaymentResponse {
  constructor(
    public state?: 'completed' | 'closed' | 'failed',
    public res?: any
  ) {
    const Obj = {
      state: state || 'failed',
      res: res || null
    };
    return Obj;
  }
}