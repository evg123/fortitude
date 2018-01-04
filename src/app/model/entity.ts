/*
  An entity represents most things that can be interacted with
  Has collision and movement
  Has health(durability)
 */

import {Drawable} from './drawable';
import {Rect} from './rect';

export class Entity extends Drawable {

  // x and y direction, will be normalized before converting to velocity
  xDir = 0;
  yDir = 0;
  facing = 0;
  speed: number;
  holdable = false;

  constructor(pos: Rect, speed: number) {
    super(pos);
    this.speed = speed;
  }

  static normalize(xd: number, yd: number) {
    if (xd === 0 && yd === 0) {
      return [0, 0];
    }
    const base = Math.sqrt(xd * xd + yd * yd);
    return [xd / base, yd / base];
  }

  doMove() {
    let [xOff, yOff] = Entity.normalize(this.xDir, this.yDir);
    xOff *= this.speed;
    yOff *= this.speed;
    this.pos.xpos += xOff;
    this.pos.ypos += yOff;
    return [xOff, yOff];
  }

  update(delta: number) {
    super.update(delta);
  }

  // a being has used this entity
  // return true if object should be removed from inventory after use
  use() {
    // do nothing by default
    return false;
  }
}
