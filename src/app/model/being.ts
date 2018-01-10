/*
  A being represents a player or enemy
  Has an inventory
 */

import {Entity} from './entity';
import {Rect} from './rect';

export abstract class Being extends Entity {

  private inventory: Entity[];
  private held: Entity;

  constructor(pos: Rect, speed: number) {
    super(pos, speed);
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

  // return true if item was successfully grabbed
  grab(item: Entity) {
    if (item.holdable) {
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
      this.held.pos.moveAbs(px, py);
    }
  }

  updateHeldDir(dx: number, dy: number) {
    if (this.isHolding()) {
      this.held.xDir = dx;
      this.held.yDir = dy;
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
