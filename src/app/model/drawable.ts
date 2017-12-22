/*
  Something that can be drawn to the screen
 */

import {Rect} from './Rect';
import {Shapes} from '../constants';

export abstract class Drawable {

  private shape: number[];
  pos: Rect;

  constructor(pos: Rect) {
    this.shape = Shapes.SQUARE;
    this.pos = pos;
  }

  getShape() {
    return this.shape;
  }
}
