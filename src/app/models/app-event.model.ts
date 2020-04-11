export class scrollObject {
  constructor(
    public scrollOffset?: number,
    public scrollDirection?: 'up' | 'down',
    public scrollDistance?: number

  ) {
    const Obj = {
      scrollOffset: scrollOffset || 0,
      scrollDirection: scrollDirection || null,
      scrollDistance: scrollDistance || null
    };
    return Obj;
  }
}