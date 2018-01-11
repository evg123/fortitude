/*
  This file contains constants which are grouped into classes
 */

// generic constants
export class Const {
  static readonly INITIAL_VERT_BUFFER_SIZE = 65536;
  static readonly VERT_ELEMENTS = 6;

  static readonly VERT_SIZE = 4; // TODO dont need to be floats
  static readonly VERT_COUNT = 2;
  static readonly VERT_OFFSET = 0;

  static readonly COLOR_SIZE = 4; // TODO dont need to be floats
  static readonly COLOR_COUNT = 4;
  static readonly COLOR_OFFSET = Const.VERT_COUNT * Const.VERT_SIZE;

  static readonly VERT_STRIDE = Const.VERT_COUNT * Const.VERT_SIZE + Const.COLOR_COUNT * Const.COLOR_SIZE;

  static readonly DEFAULT_ZOOM = 40.0;
}

// mapping from function to keyboard/mouse event
export class Keys {
  static readonly UP = 'w';
  static readonly DOWN = 's';
  static readonly LEFT = 'a';
  static readonly RIGHT = 'd';

  static readonly MENU = 'esc';
  static readonly TOGGLE_FPS = 'shift + f';
}

// shape vertex arrays
export class Shapes {
  static readonly SQUARE = [
    0.5,  0.5, 1.0, 1.0, 1.0, 1.0,
    -0.5,  0.5, 1.0, 0.0, 0.0, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0, 1.0, 1.0,
    -0.5,  0.5, 1.0, 0.0, 0.0, 1.0,
  ];
}

// color vertex arrays
export class Colors {
  static readonly RAINBOW = [
    1.0, 1.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];
}
