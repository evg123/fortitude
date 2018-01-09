/*
  An entity represents most things that can be interacted with
  Has collision and movement
  Has health(durability)
 */

import {Drawable} from './drawable';
import {Rect} from './rect';
import {Common} from '../common';
import {GameService} from '../services/game.service.client';

export class Entity extends Drawable {

  // x and y direction, will be normalized before converting to velocity
  xDir = 0;
  yDir = 0;
  facing = 0;
  speed: number;
  holdable = false;
  interactive = true; // collision with this object might have an effect
  collidable = false; // collision with this object will impede movement

  constructor(pos: Rect, speed: number) {
    super(pos);
    this.speed = speed;
  }



  doMove() {
    let [xOff, yOff] = Common.normalize(this.xDir, this.yDir);
    xOff *= this.speed;
    yOff *= this.speed;
    if (this.interactive) {
      [xOff, yOff] = Entity.game.tryMove(this, xOff, yOff);
    }
    this.pos.moveOff(xOff, yOff);
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

  // return true if object should be deleted
  collide(other: Entity) {
    return false;
  }
}
