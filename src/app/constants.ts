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

  static readonly FPS_UPDATE_INTERVAL = 1000; // milliseconds

  static readonly GRAB_DISTANCE = 5;
}

// mapping from function to keyboard/mouse event
export class Keys {
  // meta game keys
  static readonly MENU = 'esc';
  static readonly TOGGLE_FPS = 'shift + f';

  // movement
  static readonly UP = 'w';
  static readonly DOWN = 's';
  static readonly LEFT = 'a';
  static readonly RIGHT = 'd';

  // inventory
  static readonly INVENTORY = 'i';
  static readonly PUT_AWAY = 'e';
  static readonly SPAWN_BLOCK = 'f';
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
