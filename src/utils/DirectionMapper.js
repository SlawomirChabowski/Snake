import Direction from '../enums/Direction';

export default {
  /**
   * Maps event's keycodes to Direction
   * 
   * @param {string} keyCode
   * 
   * @returns {Direction}
   */
  key2dir(keyCode) {
    switch (keyCode) {
      case 'KeyW':
      case 'ArrowUp':
        return Direction.UP;
      case 'KeyD':
      case 'ArrowRight':
        return Direction.RIGHT;
      case 'KeyS':
      case 'ArrowDown':
        return Direction.DOWN;
      case 'KeyA':
      case 'ArrowLeft':
        return Direction.LEFT;
    }
  }
};
