/*
  NPC character class
 */

import {Being} from './being';
import {Rect} from './rect';
import {Entity} from './entity';

export class Block extends Entity {

  // player constants
  static readonly BLOCK_WIDTH = 1;
  static readonly BLOCK_HEIGHT = 1;
  static readonly BLOCK_SPEED = 0;

  private movingUp = false;
  private movingDown = false;
  private movingLeft = false;
  private movingRight = false;

  constructor() {
    super(new Rect(0, 0, Block.BLOCK_WIDTH, Block.BLOCK_HEIGHT), Block.BLOCK_SPEED);
    this.setColor(0, 0, 0, 1);
    this.holdable = true;
  }

  update(delta: number) {
    super.update(delta);
  }

  use() {
    // just drop where this block is currently placed
    return true;
  }
}
