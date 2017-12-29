/*
  Something that can be drawn to the screen
 */

import {Rect} from './Rect';
import {Colors, Shapes} from '../constants';

export abstract class Drawable {

  private shape: number[];
  private colors: number[];
  pos: Rect;

  constructor(pos: Rect) {
    this.shape = Shapes.SQUARE;
    this.colors = Colors.RAINBOW;
    this.pos = pos;
  }

  getVertInfo() {
    return this.shape;
  }

  update(delta: number) {
    return;
  }
}
