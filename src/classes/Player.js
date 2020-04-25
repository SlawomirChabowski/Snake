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
     * @var {Direction}
     */
    this.direction;

    /**
     * @var {number}
     */
    this.score;

    this.board = board;
    this.body = this.initBodyCoords();
    this.direction = Direction.RIGHT;
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
    window.addEventListener('keydown', this.move.bind(this));
  }

  /**
   * Handles player movement on keyboard click
   * 
   * @param {Event|undefined} e
   */
  move(e) {
    if (e && e.code) {
      this.direction = DirectionMapper.key2dir(e.code);
    }

    const newStep = this.body[0];
    const movedFrom = JSON.parse(JSON.stringify(this.body.pop()));

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

    this.body.unshift(newStep);
    this.emit('move', { newStep, movedFrom });
  }
};
