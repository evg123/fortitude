/*
  This file contains constants which are grouped into classes
 */

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
    1.0,  1.0,
    -1.0,  1.0,
    1.0, -1.0,
    -1.0, -1.0,
  ];
}
