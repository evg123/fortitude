/* tslint:disable:no-bitwise */

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {mat4} from 'gl-matrix';
import {GameService} from '../../../services/game.service.client';
import {InputService} from '../../../services/input.service.client';

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

  sqr_pos_array = [
    1.0,  1.0,
    -1.0,  1.0,
    1.0, -1.0,
    -1.0, -1.0,
  ];

  sqr_col_array = [
    1.0,  1.0,  1.0,  1.0,
    1.0,  0.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
    0.0,  0.0,  1.0,  1.0,
  ];

  private projectionMatrix: mat4;
  private modelViewMatrix: mat4;

  private programInfo: any;
  private lastTick: number;

  private vertBuffer: number[];

  constructor(private game: GameService,
              private inputSvc: InputService) {
    this.lastTick = 0;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.gl = this.canvas.nativeElement.getContext('webgl');

    if (!this.gl) {
      console.error('WebGL failed to initialize!');
      return;
    }

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

    this.setupView();

    requestAnimationFrame(this.renderCallback);
  }

  // need a lambda in order to retain reference to this object
  renderCallback = (now: number) => {
    this.tick(now);
    requestAnimationFrame(this.renderCallback);
  }

  tick(now: number) {
    const deltaMs = now - this.lastTick;

    this.game.update(deltaMs);
    this.drawScene();
  }

  drawScene() {
    this.updateVertices();
    this.doDraw();
  }

  setupView() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    const fov = 45 * Math.PI / 180; // 45 degree fov
    const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;

    this.projectionMatrix = mat4.create();
    mat4.perspective(this.projectionMatrix, fov, aspect, zNear, zFar);
  }

  updateVertices() {
    // TODO should be udating instead of recreating
    this.modelViewMatrix = mat4.create();
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix,
      [-this.game.player.pos.xpos,
        this.game.player.pos.ypos,
        -100.0]);

    {
      const numComponents = 2;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferInfo.position);
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
      const numComponents = 4;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferInfo.color);
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
  }

  doDraw() {
    this.gl.useProgram(this.programInfo.program);
    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, this.projectionMatrix);
    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);

    {
      const offset = 0;
      const vertexCount = 4;
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
    }
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
    const posBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sqr_pos_array), this.gl.STATIC_DRAW);

    const colBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sqr_col_array), this.gl.STATIC_DRAW);

    const bufferObj = {
      position: posBuffer,
      color: colBuffer,
    };
    return bufferObj;
  }

}
