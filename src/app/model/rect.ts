/*
  Represents the position of something in world coordinates
 */

export class Rect {

  private _xpos: number;
  private _ypos: number;
  private _width: number;
  private _height: number;

  // true if the rect has changed since its owner checked on it
  dirty = true;

  constructor(xpos: number, ypos: number, width: number, height: number) {
    this._xpos = xpos;
    this._ypos = ypos;
    this._width = width;
    this._height = height;
  }

  xpos() {
    return this._xpos;
  }

  ypos() {
    return this._ypos;
  }

  width() {
    return this._width;
  }

  height() {
    return this._height;
  }

  top() {
    return this._ypos - this._height / 2;
  }

  bot() {
    return this._ypos + this._height / 2;
  }

  left() {
    return this._xpos - this._width / 2;
  }

  right() {
    return this._xpos + this._width / 2;
  }

  // NOTE: this should probably only be called by the entity that own this rect
  // don't have a good way to make it only callable by that entity.
  setSize(width: number, height: number) {
    this._width = width;
    this._height = height;
    this.dirty = true;
  }

  moveAbs(xpos: number, ypos: number) {
    this._xpos = xpos;
    this._ypos = ypos;
    this.dirty = true;
  }

  moveOff(xpos: number, ypos: number) {
    this._xpos += xpos;
    this._ypos += ypos;
    this.dirty = true;
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

  // return the distance from the center of this rect to the center of other
  distanceToRect(other: Rect) {
    return this.distanceToPoint(other.xpos(), other.ypos());
  }

  distanceToPoint(otherX: number, otherY: number) {
    const diffX = this._xpos - otherX;
    const diffY = this._ypos - otherY;
    return Math.sqrt(diffX * diffX + diffY * diffY);
  }
}
