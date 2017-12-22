import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {Player} from '../model/player';

@Injectable()
export class GameService {

  private baseUrl = environment.serverBaseUrl;
  player: Player;

  constructor(private _http: Http) {
    this.player = new Player();
  }

  update(delta: number) {
    this.player.update(delta);
  }
}
