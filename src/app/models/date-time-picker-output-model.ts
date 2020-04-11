export class TpOutput {
  constructor(
    public timeInput: string,
    public hours?: any,
    public minutes?: any,
    public z?: any,
    public raw?: any
  ) {
    let toObj = {
      hours: hours || null,
      minutes: minutes || null,
      z: z || null,
      raw: raw || null,
      timeInput: timeInput || null
    };
    if (timeInput.toLowerCase().match(/^(1[0-2]|0?[1-9]):[0-5][0-9] (am|pm)$/)) {
      const hours = Number(timeInput.slice(0,2));
      const minutes = Number(timeInput.slice(3,5));
      const z = timeInput.slice(6,8);
      if (z == 'am') toObj.hours = hours;
      else toObj.hours = 12 + hours;
      toObj.minutes = minutes;
      toObj.z = z;
      toObj.raw = timeInput;
    }
    return toObj;
  }
}

export interface TO_OBJ {
  hours: number;
  minutes: number;
  z: string;
  raw: string;
}