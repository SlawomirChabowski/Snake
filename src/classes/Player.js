import Direction from '../enums/Direction';
import DirectionMapper from '../utils/DirectionMapper';
import EventEmitter from 'events';

export default class Player extends EventEmitter {
  /**
   * @param {Board} board 
   */
  constructor(board) {
    super();

    /**
     * @var {Board}
     */
    this.board;

    /**
     * @var {number[][]}
     * 
     * Coordinates of each snake's body fragment
     */
    this.body;

    /**
     * @var {function}
     */
    this.boundKeydownMethod;

    /**
     * @var {Direction}
     */
    this.direction;

    /**
     * @var {boolean}
     * Whether to keep or not last snake's chunk (growing)
     */
    this.keepLastChunk;

    /**
     * @var {number}
     */
    this.score;

    this.board = board;
    this.body = this.initBodyCoords();
    this.boundKeydownMethod = this.move.bind(this);
    this.direction = Direction.RIGHT;
    this.keepLastChunk = false;
    this.score = 0;

    this.initControls();
  }

  /**
   * Calculates body coordinates based on the board dimensions
   * 
   * @returns {number[][]}
   */
  initBodyCoords() {
    return [Array(2).fill(Math.floor(this.board.canvasSize / this.board.chunkSize / 2))];
  }

  /**
   * Adds event listener on window keydown and binds `move` method to it
   */
  initControls() {
    window.addEventListener('keydown', this.boundKeydownMethod);
  }

  /**
   * Removes event listener from window keydown
   */
  revokeControls() {
    window.removeEventListener('keydown', this.boundKeydownMethod);
  }

  /**
   * Handles player movement on keyboard click
   * 
   * @param {Event|undefined} e
   */
  move(e) {
    if (e && e.code) {
      const newDirection = DirectionMapper.key2dir(e.code)

      if (typeof newDirection !== 'undefined') {
        this.direction = newDirection;
      }
    }

    const newStep = JSON.parse(JSON.stringify(this.body[0]));
    let movedFrom = this.body.pop();

    switch (this.direction) {
      case Direction.UP:
        newStep[1]--;
        break;
      case Direction.RIGHT:
        newStep[0]++;
        break;
      case Direction.DOWN:
        newStep[1]++;
        break;
      case Direction.LEFT:
        newStep[0]--;
        break;
    }

    if (this.keepLastChunk) {
      this.keepLastChunk = false;
      this.body.unshift(movedFrom);
      movedFrom = [-1, -1];
    }

    this.body.unshift(newStep);
    this.emit('move', { newStep, movedFrom });
  }

  /**
   * Checks whether player covers given coordinates
   * 
   * @param {number[]} param0
   * 
   * @returns {boolean}
   */
  isOnCoordinates([x, y]) {
    this.body.some(([playerX, playerY]) => playerX === x && playerY === y);
  }

  grow() {
    this.score++;
    this.keepLastChunk = true;
  }
};
