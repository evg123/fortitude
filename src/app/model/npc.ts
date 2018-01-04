/*
  NPC character class
 */

import {Being} from './being';
import {Rect} from './rect';

export class NPC extends Being {

  // player constants
  static readonly NPC_SPEED = 1;
  static readonly NPC_WIDTH = 1;
  static readonly NPC_HEIGHT = 1;

  private movingUp = false;
  private movingDown = false;
  private movingLeft = false;
  private movingRight = false;

  constructor() {
    super(new Rect(0, 0, NPC.NPC_WIDTH, NPC.NPC_HEIGHT),
      NPC.NPC_SPEED);
    this.setColor(0, 0.5, 0.4, 1);
  }

  update(delta: number) {
    super.update(delta);
  }
}
