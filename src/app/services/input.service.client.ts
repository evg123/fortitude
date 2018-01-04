import {Injectable} from '@angular/core';
import {GameService} from './game.service.client';
import * as keyboardjs from 'keyboardjs';
import {Keys} from '../constants';
import {KeyEvent} from 'keyboardjs';

@Injectable()
export class InputService {

  constructor(private game: GameService) {
    keyboardjs.bind(Keys.UP, this.upPressed, this.upUnPressed);
    keyboardjs.bind(Keys.DOWN, this.downPressed, this.downUnPressed);
    keyboardjs.bind(Keys.LEFT, this.leftPressed, this.leftUnPressed);
    keyboardjs.bind(Keys.RIGHT, this.rightPressed, this.rightUnPressed);
  }

  upPressed = (event: KeyEvent) => {
    // event.preventRepeat();
    this.game.player.setMovingUp(true);
  }

  upUnPressed = (event: KeyEvent) => {
    // event.preventRepeat();
    this.game.player.setMovingUp(false);
  }

  downPressed = (event: KeyEvent) => {
    // event.preventRepeat();
    this.game.player.setMovingDown(true);
  }

  downUnPressed = (event: KeyEvent) => {
    // event.preventRepeat();
    this.game.player.setMovingDown(false);
  }

  leftPressed = (event: KeyEvent) => {
    // event.preventRepeat();
    this.game.player.setMovingLeft(true);
  }

  leftUnPressed = (event: KeyEvent) => {
    // event.preventRepeat();
    this.game.player.setMovingLeft(false);
  }

  rightPressed = (event: KeyEvent) => {
    // event.preventRepeat();
    this.game.player.setMovingRight(true);
  }

  rightUnPressed = (event: KeyEvent) => {
    // event.preventRepeat();
    this.game.player.setMovingRight(false);
  }

  mouseUp(event: MouseEvent) {
    if (this.game.player.isHolding()) {
      this.game.player.useHeld();
    } else {
      const objsAtMouse = this.game.getObjsAtPos(event.clientX, event.clientY);
      for (const obj of objsAtMouse) {
        const grabbed = this.game.player.grab(obj);
        if (grabbed) {
          // grab succeeded, we're done
          // TODO make this deterministic, rather than dependant on order of list
          return;
        }
      }
    }
  }

  mouseMove(event: MouseEvent) {
    this.game.player.setHandPos(event.clientX, event.clientY);
  }
}
