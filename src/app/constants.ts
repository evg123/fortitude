/*
  This file contains constants which are grouped into classes
 */

// generic constants
export class Const {
  static readonly INITIAL_VERT_BUFFER_SIZE = 1024;

  static readonly VERT_SIZE = 4; // TODO dont need to be floats
  static readonly VERT_COUNT = 2;
  static readonly VERT_OFFSET = 0;

  static readonly COLOR_SIZE = 4; // TODO dont need to be floats
  static readonly COLOR_COUNT = 4;
  static readonly COLOR_OFFSET = Const.VERT_COUNT * Const.VERT_SIZE;

  static readonly VERT_STRIDE = Const.VERT_COUNT * Const.VERT_SIZE + Const.COLOR_COUNT * Const.COLOR_SIZE;
}

// mapping from function to keyboard/mouse event
export class Keys {
  static readonly UP = 'w';
  static readonly DOWN = 's';
  static readonly LEFT = 'a';
  static readonly RIGHT = 'd';

  static readonly GRAB = 'click';
}

// shape vertex arrays
export class Shapes {
  static readonly SQUARE = [
    1.0,  1.0, 1.0, 1.0, 1.0, 1.0,
    -1.0,  1.0, 1.0, 0.0, 0.0, 1.0,
    1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    -1.0, -1.0, 0.0, 0.0, 1.0, 1.0,
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
