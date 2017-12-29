/*
  An entity represents most things that can be interacted with
  Has collision and movement
  Has health(durability)
 */

import {Drawable} from './drawable';
import {Rect} from './Rect';

export class Entity extends Drawable {

  // x and y direction, will be normalized before converting to velocity
  xDir = 0;
  yDir = 0;
  speed: number;

  constructor(pos: Rect, speed: number) {
    super(pos);
    this.speed = speed;
  }

  update(delta: number) {
    super.update(delta);
    this.pos.xpos += this.xDir;
    this.pos.ypos += this.yDir;
  }
}
