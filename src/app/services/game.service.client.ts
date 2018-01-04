import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {Player} from '../model/player';
import {Drawable} from '../model/drawable';
import {NPC} from '../model/npc';
import {Block} from '../model/block';

@Injectable()
export class GameService {

  private baseUrl = environment.serverBaseUrl;
  private drawList: Drawable[] = [];
  player: Player;

  constructor(private _http: Http) {
    this.player = new Player();
    this.drawList.push(this.player);
  }

  getDrawList() {
    return this.drawList;
  }

  update(delta: number) {
    for (const obj of this.drawList) {
      obj.update(delta);
    }
  }

  setupWorld() {
    {
      const npc1 = new NPC();
      npc1.pos.move(4, 4);
      this.drawList.push(npc1);
    }

    {
      const block1 = new Block();
      block1.pos.move(6, 2);
      this.drawList.push(block1);
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
