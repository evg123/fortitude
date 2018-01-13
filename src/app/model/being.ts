/*
  A being represents a player or enemy
  Has an inventory
 */

import {Entity} from './entity';
import {Rect} from './rect';
import {Const} from '../constants';
import {Common} from '../common';

export abstract class Being extends Entity {

  private inventory: Entity[];
  private held: Entity;
  protected grabDistance = 1;

  constructor(pos: Rect) {
    super(pos);
    this.inventory = [];
    this.collidable = true;
  }

  getInventory() {
    return this.inventory;
  }

  update(delta: number) {
    super.update(delta);
  }

  isHolding() {
    return !!this.held;
  }

  canGrab(item: Entity) {
    return (item.holdable && this.pos.distanceToRect(item.pos) <= this.grabDistance);
  }

  // return true if item was successfully grabbed
  grab(item: Entity) {
    if (this.canGrab(item)) {
      this.hold(item);
      return true;
    }
    return false;
  }

  hold(item: Entity) {
    this.held = item;
  }

  setHandPos(px: number, py: number) {
    if (this.isHolding()) {
      if (this.pos.distanceToPoint(px, py) > this.held.usageDistance) {
        // held item distance depends on max usage distance of the item
        const [xOff, yOff] = Common.normalize(px - this.pos.xpos(), py - this.pos.ypos());
        px = this.pos.xpos() + xOff * this.held.usageDistance;
        py = this.pos.ypos() + yOff * this.held.usageDistance;
      }
      this.held.pos.moveAbs(px, py);
    }
  }

  useHeld() {
    const drop = this.held.use();
    if (drop) {
      delete this.held;
    }
  }

  doMove() {
    const [xOff, yOff] = super.doMove();
    if (this.isHolding()) {
      this.held.pos.moveOff(xOff, yOff);
    }
    return [xOff, yOff];
  }
}
