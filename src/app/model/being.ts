/*
  A being represents a player or enemy
  Has an inventory
 */

import {Entity} from './entity';
import {Rect} from './Rect';

export abstract class Being extends Entity {

  private inventory: Entity[];

  constructor(pos: Rect, speed: number) {
    super(pos, speed);
    this.inventory = [];
  }

  getInventory() {
    return this.inventory;
  }

  update(delta: number) {
    super.update(delta);
  }
}
