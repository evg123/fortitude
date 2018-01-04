import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {Player} from '../model/player';
import {Drawable} from '../model/drawable';
import {NPC} from '../model/npc';
import {Block} from '../model/block';
import {Const} from '../constants';

@Injectable()
export class GameService {

  private baseUrl = environment.serverBaseUrl;

  canvasLeft = 0;
  canvasTop = 0;
  canvasWidth = 0;
  canvasHeight = 0;
  zoomScale = Const.DEFAULT_ZOOM;

  private drawList: Drawable[] = [];
  player: Player;

  constructor(private _http: Http) { }

  getDrawList() {
    return this.drawList;
  }

  update(delta: number) {
    for (const obj of this.drawList) {
      obj.update(delta);
    }
  }

  setupWorld() {
    this.player = new Player();
    this.drawList.push(this.player);
    this.player.pos.moveAbs(1000, 1000);

    {
      const npc = new NPC();
      npc.pos.moveAbs(4, 4);
      this.drawList.push(npc);
    }

    {
      const block = new Block();
      block.pos.moveAbs(995.5, 1002);
      this.drawList.push(block);
    }
    {
      const block = new Block();
      block.pos.moveAbs(997.5, 1002);
      this.drawList.push(block);
    }
    {
      const block = new Block();
      block.pos.moveAbs(999.5, 1002);
      this.drawList.push(block);
    }
    {
      const block = new Block();
      block.pos.moveAbs(1001.5, 1002);
      this.drawList.push(block);
    }
    {
      const block = new Block();
      block.pos.moveAbs(1003.5, 1002);
      this.drawList.push(block);
    }
    {
      const block = new Block();
      block.pos.moveAbs(1005.5, 1002);
      this.drawList.push(block);
    }
    {
      const block = new Block();
      block.pos.moveAbs(1020, 1025);
      this.drawList.push(block);
    }
  }

  getObjsAtPos(xp: number, yp: number) {
    const objList = [];
    for (const obj of this.drawList) {
      if (obj.pos.contains(xp, yp)) {
        objList.push(obj);
      }
    }
    return objList;
  }
}
