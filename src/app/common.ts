/*
  This file contains generic code used by several components
 */

export class Common {
  static normalize(xd: number, yd: number) {
    if (xd === 0 && yd === 0) {
      return [0, 0];
    }
    const base = Math.sqrt(xd * xd + yd * yd);
    return [xd / base, yd / base];
  }
}
