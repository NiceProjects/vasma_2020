export class spinnerConfig {
  constructor(
    public color?: 'primary' | 'accent' | 'warn',
    public mode?: 'determinate' | 'indeterminate',
    public dia?: number,
    public sWidth?: number,
    public value?: number,
    public type?: 'bar' | 'spinner',
    public showPerc?: boolean,
    public showVal?: boolean
  ) {
    const config = {
      color: color || 'warn',
      mode: mode || 'determinate',
      dia: dia || 80,
      sWidth: sWidth || 6,
      value: value || 50,
      type: type || 'bar',
      showPerc: showPerc || true,
      showVal: showVal || true
    };
    return config;
  }
}
