/*
  The player controlled by the user
 */

import {Being} from './being';
import {Rect} from './rect';

export class Player extends Being {

  // player constants
  static readonly PLAYER_SPEED = 0.3;
  static readonly PLAYER_WIDTH = 1;
  static readonly PLAYER_HEIGHT = 1;

  private movingUp = false;
  private movingDown = false;
  private movingLeft = false;
  private movingRight = false;

  constructor() {
    super(new Rect(0, 0, Player.PLAYER_WIDTH, Player.PLAYER_HEIGHT),
      Player.PLAYER_SPEED);
  }

  setMovingUp(val: boolean) {
    this.movingUp = val;
    this.updateDirection();
  }

  setMovingDown(val: boolean) {
    this.movingDown = val;
    this.updateDirection();
  }

  setMovingLeft(val: boolean) {
    this.movingLeft = val;
    this.updateDirection();
  }

  setMovingRight(val: boolean) {
    this.movingRight = val;
    this.updateDirection();
  }

  updateDirection() {
    if (this.movingUp && !this.movingDown) {
      this.yDir = -1;
    } else if (!this.movingUp && this.movingDown) {
      this.yDir = 1;
    } else {
      this.yDir = 0;
    }

    if (this.movingLeft && !this.movingRight) {
      this.xDir = -1;
    } else if (!this.movingLeft && this.movingRight) {
      this.xDir = 1;
    } else {
      this.xDir = 0;
    }
  }

  update(delta: number) {
    super.update(delta);
  }
}
