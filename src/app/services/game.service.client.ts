import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {Player} from '../model/player';
import {Drawable} from '../model/drawable';

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
}
