import {Injectable} from '@angular/core';
import {GameService} from './game.service.client';
import * as keyboardjs from 'keyboardjs';
import {Keys} from '../constants';
import {KeyEvent} from 'keyboardjs';

@Injectable()
export class InputService {

  constructor(private game: GameService) {
    // meta game keys
    keyboardjs.bind(Keys.MENU, this.menuPressed);
    keyboardjs.bind(Keys.TOGGLE_FPS, this.toggleFps);

    // movement
    keyboardjs.bind(Keys.UP, this.upPressed, this.upUnPressed);
    keyboardjs.bind(Keys.DOWN, this.downPressed, this.downUnPressed);
    keyboardjs.bind(Keys.LEFT, this.leftPressed, this.leftUnPressed);
    keyboardjs.bind(Keys.RIGHT, this.rightPressed, this.rightUnPressed);

    // inventory
    keyboardjs.bind(Keys.INVENTORY, this.inventoryPressed);
    keyboardjs.bind(Keys.PUT_AWAY, this.sheathPressed);
    keyboardjs.bind(Keys.SPAWN_BLOCK, this.spawnBlockPressed);
  }

  eventPosToWorldPos(evX: number, evY: number) {
    // TODO save some of these calculations to optimize
    // TODO this is pretty hacky currently
    // get canvas-relative position
    let newX = evX - this.game.canvasLeft - (this.game.canvasWidth / 2);
    let newY = evY - this.game.canvasTop - (this.game.canvasHeight / 2);

    // adjust for aspect ratio
    newX *= (this.game.canvasWidth / this.game.canvasHeight);

    // translate to world position
    newX = this.game.zoomScale * (newX / this.game.canvasWidth) + this.game.player.pos.xpos();
    newY = this.game.zoomScale * (newY / this.game.canvasHeight) + this.game.player.pos.ypos();
    return [newX, newY];
  }

  // mouse handling functions

  mouseUp(event: MouseEvent) {
    if (this.game.player.isHolding()) {
      this.game.player.useHeld();
    } else {
      const [mouseX, mouseY] = this.eventPosToWorldPos(event.clientX, event.clientY);
      const objsAtMouse = this.game.getObjsAtPos(mouseX, mouseY);
      console.log(objsAtMouse);
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
    const [mouseX, mouseY] = this.eventPosToWorldPos(event.clientX, event.clientY);
    console.log(mouseX, mouseY);
    this.game.player.setHandPos(mouseX, mouseY);
  }

  // keyboard handling functions
  // need to be lambdas for keyboardjs to retain this reference

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

  menuPressed = (event: KeyEvent) => {
    this.game.togglePause();
  }

  toggleFps = (event: KeyEvent) => {
    this.game.toggleFpsDisplay();
  }

  inventoryPressed = (event: KeyEvent) => {
    this.game.toggleInventoryDisplay();
  }

  sheathPressed = (event: KeyEvent) => {
    this.game.player.sheath();
  }

  spawnBlockPressed = (event: KeyEvent) => {
    this.game.spawnBlockForPlayer();
  }

}
