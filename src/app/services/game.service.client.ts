import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {Player} from '../model/player';
import {Drawable} from '../model/drawable';
import {NPC} from '../model/npc';
import {Block} from '../model/block';
import {Const} from '../constants';
import {Rect} from '../model/rect';
import {Entity} from '../model/entity';

@Injectable()
export class GameService {

  private baseUrl = environment.serverBaseUrl;

  canvasLeft = 0;
  canvasTop = 0;
  canvasWidth = 0;
  canvasHeight = 0;
  zoomScale = Const.DEFAULT_ZOOM;

  paused = false;
  displayInventory = false;
  displayFps = true;

  // things that do not move
  private staticDrawList: Drawable[] = [];

  // things that move
  private entList: Entity[] = [];
  player: Player;

  // collisions that have occurred since the last time time they were handled
  private pendingCollisions = {};

  // ids of entities that need to be removed from the draw list
  private toRemove: number[] = [];

  constructor(private _http: Http) { }

  getDrawList() {
    return this.entList;
  }

  addToEntList(item: Entity) {
    this.entList.push(item);
  }

  update(delta: number) {
    for (const obj of this.entList) {
      obj.update(delta);
    }
    this.handleCollisions();
    this.handleRemove();
  }

  setupWorld() {
    this.player = new Player();
    this.entList.push(this.player);
    this.player.pos.moveAbs(1000, 1000);

    {
      const npc = new NPC();
      npc.pos.moveAbs(994, 990);
      this.entList.push(npc);
    }

    {
      const block = this.spawnBlock();
      block.pos.moveAbs(995.5, 1002);
    }
    {
      const block = this.spawnBlock();
      block.pos.moveAbs(996.5, 1002.5);
    }
    {
      const block = this.spawnBlock();
      block.pos.moveAbs(999.5, 1002);
    }
    {
      const block = this.spawnBlock();
      block.pos.moveAbs(1001.5, 1002);
    }
    {
      const block = this.spawnBlock();
      block.pos.moveAbs(1003.5, 1002);
    }
    {
      const block = this.spawnBlock();
      block.pos.moveAbs(1005.5, 1002);
    }
    {
      const block = this.spawnBlock();
      block.pos.moveAbs(1020, 1025);
    }
  }

  togglePause() {
    this.paused = !this.paused;
    console.error('Paused: ' + this.paused);
  }

  getObjsAtPos(xp: number, yp: number) {
    const objList = [];
    for (const obj of this.entList) {
      if (obj.pos.contains(xp, yp)) {
        objList.push(obj);
      }
    }
    return objList;
  }

  // see if ent can move by offsets without hitting something
  // return the distance it can actually move
  tryMove(ent: Entity, xOff: number, yOff: number) {
    let newXOff = xOff;
    let newYOff = yOff;
    for (const other of this.entList) {
      if (ent !== other && other.isInteractive && ent.pos.collidesWith(other.pos, newXOff, newYOff)) {
        // a collision occurred
        if (other.isCollidable && ent.isCollidable) {
          // x axis
          if (xOff > 0) {
            // find the distance to the other object on this axis
            const xDiff = other.pos.left() - ent.pos.right();
            if (xDiff >= 0) {
              // limit xOff to that distance
              newXOff = Math.min(newXOff, xDiff);
            } // else: a negative value means we aren't going to intersect in this axis
          } else if (xOff < 0) {
            const xDiff = other.pos.right() - ent.pos.left();
            if (xDiff <= 0) {
              newXOff = Math.max(newXOff, xDiff);
            }
          }

          // y axis
          if (yOff > 0) {
            const yDiff = other.pos.top() - ent.pos.bot();
            if (yDiff >= 0) {
              newYOff = Math.min(newYOff, yDiff);
            }
          } else if (yOff < 0) {
            const yDiff = other.pos.bot() - ent.pos.top();
            if (yDiff <= 0) {
              newYOff = Math.max(newYOff, yDiff);
            }
          }
        }

        // record the collision to be handled later
        // TODO its possible that a closer collision prevents this one from happening
        this.recordCollision(ent, other);
      }
    }
    return [newXOff, newYOff];
  }

  // keep track of collisions that have occurred
  // constructs a dict of ent.objId -> array of object that have collided with ent
  // the first element of each array is ent for convenience
  recordCollision(ent1: Entity, ent2: Entity) {
    if (!this.pendingCollisions.hasOwnProperty(ent1.objId)) {
      this.pendingCollisions[ent1.objId] = [ent1];
    }
    this.pendingCollisions[ent1.objId].push(ent2);
  }

  handleCollisions() {
    for (const key in this.pendingCollisions) {
      if (this.pendingCollisions.hasOwnProperty(key)) {
        const entArr = this.pendingCollisions[key];
        const ent1 = entArr[0];
        for (const ent2 of entArr) {
          if (ent1.collide(ent2)) {
            this.toRemove.push(ent1.objId);
          }
        }
      }
    }
    this.pendingCollisions = {};
  }

  handleRemove() {
    for (let idx = this.entList.length - 1; idx >= 0; idx--) {
      const ent = this.entList[idx];
      if (ent.objId in this.toRemove) {
        this.entList.splice(idx, 1);
      }
    }
  }

  toggleFpsDisplay() {
    this.displayFps = !this.displayFps;
  }

  toggleInventoryDisplay() {
    this.displayInventory = !this.displayInventory;
  }

  spawnBlockForPlayer() {
    const block = this.spawnBlock();
    block.pos.moveAbs(this.player.pos.xpos(), this.player.pos.ypos());
    this.player.grab(block);
  }

  spawnBlock() {
    const block = new Block();
    this.addToEntList(block);
    return block;
  }
}
