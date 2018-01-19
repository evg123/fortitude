/*
  Something that can be drawn to the screen
 */

import {Rect} from './rect';
import {Colors, Const, Shapes} from '../constants';
import {GameService} from '../services/game.service.client';

export abstract class Drawable {

  protected static game: GameService = null;

  // unique id for this object
  protected static nextObjId = 0;
  objId;

  private baseVertInfo: number[];
  private vertInfo: number[];
  pos: Rect;

  // whenever one of these changes, setupVaseVertInfo must be called
  private shape: number[];
  scale = [1.0, 1.0]; // TODO this is redundant with pos.width/height
  color = [0.0, 0.0, 0.0, 1.0];

  constructor(pos: Rect) {
    this.objId = Drawable.nextObjId++;
    this.pos = pos;
    this.scale = [pos.width(), pos.height()];
    this.shape = Shapes.SQUARE;
    this.setupBaseVertInfo();
  }

  static setGameService(game: GameService) {
    this.game = game;
  }

  getVertInfo() {
    return this.vertInfo;
  }

  update(delta: number) {
    const [xOff, yOff] = this.doMove();
    if (this.pos.dirty) {
      this.updateVertInfo();
    }
    return;
  }

  doMove() {
    return [0, 0];
  }

  setShape(shape: number[]) {
    this.shape = shape;
    this.setupBaseVertInfo();
  }

  setScale(scaleX: number, scaleY: number) {
    this.scale = [scaleX, scaleY];
    this.pos.setSize(scaleX, scaleY);
    this.setupBaseVertInfo();
  }

  setColor(red: number, green: number, blue: number, alpha: number) {
    this.color = [red, green, blue, alpha];
    this.setupBaseVertInfo();
  }

  // keep vertInfo the same size as shape and up to date
  // must be called whenever something that effects the base vertInfo changes
  setupBaseVertInfo() {
    // start with the shape
    this.baseVertInfo = this.shape.slice();

    // apply scale and fill in colors
    for (let vi = 0; vi < this.baseVertInfo.length; vi += Const.VERT_ELEMENTS) {
      this.baseVertInfo[vi] *= this.scale[0];
      this.baseVertInfo[vi + 1] *= this.scale[1];
      this.baseVertInfo[vi + 2] = this.color[0];
      this.baseVertInfo[vi + 3] = this.color[1];
      this.baseVertInfo[vi + 4] = this.color[2];
      this.baseVertInfo[vi + 5] = this.color[3];
    }

    // update vertInfno
    this.vertInfo = this.baseVertInfo.slice();
    this.updateVertInfo();
  }

  // update vertInfo based on position of the drawable
  updateVertInfo() {
    // update vert info to match the position of the pos Rect
    for (let vi = 0; vi < this.vertInfo.length; vi += Const.VERT_ELEMENTS) {
      this.vertInfo[vi] = this.baseVertInfo[vi] + this.pos.xpos();
      this.vertInfo[vi + 1] = this.baseVertInfo[vi + 1] + this.pos.ypos();
      // leave the colors alone for now
    }
    // we don't need to update vertInfo until something changes
    this.pos.dirty = false;
  }
}
