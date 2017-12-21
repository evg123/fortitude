/* tslint:disable:no-bitwise */

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {mat4} from 'gl-matrix';

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

  constructor() { }

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
    const programInfo = {
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

    const buffers = this.initBuffers();
    this.draw(programInfo, buffers);
  }

  draw(programInfo: any, buffers: any) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    const fov = 45 * Math.PI / 180; // 45 degree fov
    const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

    {
      const numComponents = 2;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
      this.gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    {
      const numComponents = 4;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
      this.gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      this.gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
    }

    this.gl.useProgram(programInfo.program);
    this.gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    this.gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

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
