/*
  An entity represents most things that can be interacted with
  Has collision and movement
  Has health(durability)
 */

import {Drawable} from './drawable';
import {Rect} from './rect';
import {Common} from '../common';

export class Entity extends Drawable {

  name: string; // used in inventory display

  // x and y direction, will be normalized before converting to velocity
  protected xDir = 0;
  protected yDir = 0;
  protected facing = 0;
  protected speed = 0;
  usageDistance = 1; // max distance that this item can be used from its holder

  protected interactive = true; // collision with this object might have an effect
  protected collidable = false; // collision with this object will impede movement
  protected hidden = false; // this object will not be drawn, but will still be updated

  holdable = false; // can be held by a being
  inventoryable = false; // can be stored in a being's inventory

  constructor(pos: Rect) {
    super(pos);
  }

  isInteractive() {
    return !this.hidden && this.interactive;
  }

  isCollidable() {
    return !this.hidden && this.interactive && this.collidable;
  }

  isHidden() {
    return this.hidden;
  }

  hide() {
    this.hidden = true;
  }

  show() {
    this.hidden = false;
  }

  doMove() {
    let [xOff, yOff] = Common.normalize(this.xDir, this.yDir);
    xOff *= this.speed;
    yOff *= this.speed;
    if (xOff || yOff) {
      if (this.interactive) {
        [xOff, yOff] = Entity.game.tryMove(this, xOff, yOff);
      }
      this.pos.moveOff(xOff, yOff);
    }
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
