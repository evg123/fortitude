/*
  Something that can be drawn to the screen
 */

import {Rect} from './Rect';
import {Colors, Const, Shapes} from '../constants';

export abstract class Drawable {

  private shape: number[];
  private vertInfo: number[];
  pos: Rect;

  constructor(pos: Rect) {
    this.pos = pos;
    this.setShape(Shapes.SQUARE);
  }

  setShape(shape: number[]) {
    this.shape = shape;
    // keep vertInfo the same size as shape and up to date
    this.vertInfo = this.shape.slice();
    this.updateVertInfo();
  }

  getVertInfo() {
    return this.vertInfo;
  }

  update(delta: number) {
    this.updateVertInfo();
    return;
  }

  updateVertInfo() {
    // update vert info to match the position of the pos Rect
    for (let vi = 0; vi < this.vertInfo.length; vi += Const.VERT_ELEMENTS) {
      this.vertInfo[vi] = this.shape[vi] + this.pos.xpos;
      this.vertInfo[vi + 1] = this.shape[vi + 1] + this.pos.ypos;
      // leave the colors alone for now
    }
  }
}
