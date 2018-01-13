/* tslint:disable:no-bitwise */

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {mat4} from 'gl-matrix';
import {GameService} from '../../../services/game.service.client';
import {InputService} from '../../../services/input.service.client';
import {Const} from '../../../constants';
import {Drawable} from '../../../model/drawable';
import {Router} from '@angular/router';
import {del} from 'selenium-webdriver/http';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.css']
})
export class GameScreenComponent implements OnInit, AfterViewInit {

  @ViewChild('glCanvas') canvas: ElementRef;
  gl: WebGLRenderingContext;

  vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  renderWidth = 100;
  renderHeight = 100;

  private projectionMatrix: mat4;
  private modelViewMatrix: mat4;
  private buffer: WebGLBuffer;

  private programInfo: any;
  private lastTick = 0;
  private rafPaused = false;

  // fps tracking
  private frameCount = 0;
  private lastFpsUpdate = 0;
  fpsDisplay = 0;

  constructor(private router: Router,
              private game: GameService,
              private inputSvc: InputService) {
  }

  ngOnInit() {
    Drawable.setGameService(this.game);
  }

  ngAfterViewInit() {
    this.gl = this.canvas.nativeElement.getContext('webgl');

    if (!this.gl) {
      console.error('WebGL failed to initialize!');
      return;
    }

    this.updateCanvasSize();

    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    const shaderProg = this.initShaderProgram();
    this.programInfo = {
      program: shaderProg,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(shaderProg, 'aVertexPosition'),
        vertexColor: this.gl.getAttribLocation(shaderProg, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(shaderProg, 'uProjectionMatrix'),
        modelViewMatrix: this.gl.getUniformLocation(shaderProg, 'uModelViewMatrix'),
      },
    };

    this.game.setupWorld();
    this.setupView();
    this.setupVertices();

    this.lastTick = window.performance.now();
    this.lastFpsUpdate = 0;
    requestAnimationFrame(this.renderCallback);
  }
  // need a lambda in order to retain reference to this object
  renderCallback = (now: number) => {
    if (!this.game.paused) {
      this.tick(now);
    } else {
      this.lastTick = 0;
    }

    // TODO stop rendering on pause, need a way to restart the callback
    requestAnimationFrame(this.renderCallback);
  }

  tick(now: number) {
    this.frameCount++;
    const sinceUpdate = now - this.lastFpsUpdate;
    if (sinceUpdate > Const.FPS_UPDATE_INTERVAL) {
      this.fpsDisplay = this.frameCount;
      this.lastFpsUpdate = now;
      this.frameCount = 0;
    }

    // only update if we have a last tick to get a delta from
    // otherwise this is the first tick or we just came back from a pause
    if (this.lastTick !== 0) {
      const deltaMs = now - this.lastTick;
      this.game.update(deltaMs);
    }
    this.lastTick = now;

    this.drawScene();
  }

  drawScene() {
    this.doDraw();
  }

  // update canvas size
  updateCanvasSize() {
    const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
    this.game.canvasLeft = canvasRect.left;
    this.game.canvasTop = canvasRect.top;
    this.game.canvasWidth = this.gl.canvas.clientWidth;
    this.game.canvasHeight = this.gl.canvas.clientHeight;
  }

  setupView() {
    const fov = 53 * Math.PI / 180; // not sure why 53 works here...
    const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 1000.0;

    // create a projection matrix
    this.projectionMatrix = mat4.create();
    mat4.perspective(this.projectionMatrix, fov, aspect, zNear, zFar);

    // flip the y axis so it matches drawing conventions
    mat4.scale(this.projectionMatrix, this.projectionMatrix, [1.0, -1.0, 1.0]);

    this.buffer = this.initBuffers();
  }

  setupVertices() {
    {
      const numComponents = Const.VERT_COUNT;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = Const.VERT_STRIDE;
      const offset = Const.VERT_OFFSET;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
      this.gl.vertexAttribPointer(
        this.programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
    }

    {
      const numComponents = Const.COLOR_COUNT;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = Const.VERT_STRIDE;
      const offset = Const.COLOR_OFFSET;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
      this.gl.vertexAttribPointer(
        this.programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      this.gl.enableVertexAttribArray(
        this.programInfo.attribLocations.vertexColor);
    }

    this.gl.useProgram(this.programInfo.program);
  }

  updateView() {
    // TODO should be updating instead of recreating
    this.modelViewMatrix = mat4.create();
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix,
      [-this.game.player.pos.xpos(),
        -this.game.player.pos.ypos(),
        -this.game.zoomScale]);
    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, this.projectionMatrix);
    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);
  }

  doDraw() {
    const vertCount = this.updateBuffers();
    this.updateView();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, vertCount);
  }

  initShaderProgram() {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, this.vsSource);
    const fragShader = this.loadShader(this.gl.FRAGMENT_SHADER, this.fsSource);

    const shaderProg = this.gl.createProgram();
    this.gl.attachShader(shaderProg, vertexShader);
    this.gl.attachShader(shaderProg, fragShader);
    this.gl.linkProgram(shaderProg);

    if (!this.gl.getProgramParameter(shaderProg, this.gl.LINK_STATUS)) {
      console.error('Failed to link shader program: ' + this.gl.getProgramInfoLog(shaderProg));
      return null;
    }

    return shaderProg;
  }

  loadShader(type: number, source: string) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Failed to compile shader program: ' + this.gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  initBuffers() {
    // TODO this buffer should be sized dynamically
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, Const.INITIAL_VERT_BUFFER_SIZE, this.gl.DYNAMIC_DRAW);
    return buffer;
  }

  updateBuffers() {
    // build an array of positions/colors
    const vertInfo: number[] = [];
    for (const obj of this.game.getDrawList()) {
      for (const item of obj.getVertInfo()) {
        vertInfo.push(item);
      }
    }

    // upload array to gpu buffer
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(vertInfo));
    return vertInfo.length / Const.VERT_ELEMENTS;
  }

  mouseUp(event: MouseEvent) {
    this.inputSvc.mouseUp(event);
  }

  mouseMove(event: MouseEvent) {
    this.inputSvc.mouseMove(event);
  }

  shouldDisplayMenu() {
    return this.game.paused;
  }

  shouldDisplayFps() {
    return this.game.displayFps;
  }

  save() {
    // nothing yet
  }

  displaySettings() {
    // noting yet
  }

  quit() {
    this.router.navigate(['/']);
  }
}
