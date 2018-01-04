/*
  Represents the position of something in world coordinates
 */

export class Rect {

  xpos: number;
  ypos: number;
  width: number;
  height: number;

  constructor(xpos: number, ypos: number, width: number, height: number) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
  }

  top() {
    return this.ypos - this.height / 2;
  }

  bot() {
    return this.ypos + this.height / 2;
  }

  left() {
    return this.xpos - this.width / 2;
  }

  right() {
    return this.xpos + this.width / 2;
  }

  moveAbs(xpos: number, ypos: number) {
    this.xpos = xpos;
    this.ypos = ypos;
  }

  moveOff(xpos: number, ypos: number) {
    this.xpos += xpos;
    this.ypos += ypos;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  contains(xp: number, yp: number) {
    console.log([xp, yp, this.left(), this.right(), this.bot(), this.top()]);
    return !(xp < this.left() || xp > this.right()
      || yp > this.bot() || yp < this.top());
  }
}