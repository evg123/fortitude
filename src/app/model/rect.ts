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
    return !(xp < this.left() || xp > this.right()
      || yp > this.bot() || yp < this.top());
  }

  // check for collision with other
  // optionally pass in an x and y offset and check if the offset would cause collision
  collidesWith(other: Rect, xOff: number = 0, yOff: number = 0) {
    // TODO assumes axis aligned rects
    // TODO do first pass distance filter then SAT collision
    return this.left() + xOff < other.right() && this.right() + xOff > other.left()
      && this.top() + yOff < other.bot() && this.bot() + yOff > other.top();
  }
}
