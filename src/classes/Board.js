import config from '../AppConfig';
import Player from './Player';

export default class Board {
  constructor() {
    /**
     * @var {Element}
     * Canvas on which whole board will be drawn
     */
    this.canvas;

    /**
     * The size of canvas width/height (in pixels)
     */
    this.canvasSize;

    /**
     * @var {number}
     * The size of a single chunk on the board (in pixels)
     */
    this.chunkSize;

    /**
     * @var {number}
     * Time to wait to update snake's body
     */
    this.interval;

    /**
     * @var {Player}
     */
    this.player;

    /**
     * @var {number}
     */
    this.playerMoveIntervalId;

    this.interval = config.tickLength;
    this.chunkSize = this.calculateChunkSize();
    this.canvasSize = this.calculateCanvasSize();
    this.canvas = this.initCanvas();
    this.player = this.initPlayer();
    this.playerMoveIntervalId = this.startGame();
  }

  /**
   * Handles board initialization
   */
  init() {
    const app = document.querySelector('#app');
    const root = app.parentElement;

    root.appendChild(this.canvas);
    root.removeChild(app);
  }

  /**
   * Creates `canvas` element with required styles
   * 
   * @returns {Element}
   */
  initCanvas() {
    const canvas = document.createElement('canvas');

    canvas.width = this.canvasSize;
    canvas.height = this.canvasSize;

    canvas.style.display = 'block';
    canvas.style.width = '100vmin';
    canvas.style.height = '100vmin';
    canvas.style.margin = '0 auto';
    canvas.style.backgroundColor = config.colors.board;

    return canvas;
  }

  /**
   * Handles player creation, draws it on the board and and binds eventListeners to it
   * 
   * @returns {Player}
   */
  initPlayer() {
    const player = new Player(this);
    this.draw(player.body[0], config.colors.snake);
    player.on('move', this.movePlayer.bind(this));

    return player;
  }

  /**
   * Calculates the chunk size on the board
   * 
   * @returns {number} chunk size (in pixels)
   */
  calculateChunkSize() {
    const { clientHeight: height, clientWidth: width } = document.body;
    const tempMinDim = height < width ? height : width;
    // 400x400 stands for minimum resolution for a board
    const minDim = 400 > tempMinDim ? 400 : tempMinDim;

    return Math.floor(minDim / config.chunksAmount);
  }

  /**
   * Calculates a single dimension of the board
   * 
   * @returns {number} board dimension (in pixels)
   */
  calculateCanvasSize() {
    return this.chunkSize * config.chunksAmount;
  }

  /**
   * Sets interval of player movements
   * 
   * @returns {number} Interval's ID
   */
  startGame() {
    return setInterval(this.player.move.bind(this.player), this.interval);
  }

  /**
   * Handles drawing elemental elements
   * 
   * @param {number[]} coords 
   * @param {string} color 
   */
  draw(coords, color) {
    const ctx = this.canvas.getContext('2d');

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(
      ...coords.map(c => c * this.chunkSize),
      this.chunkSize,
      this.chunkSize
    );
  }

  /**
   * Handles drawing and erasing player from the board
   * 
   * @param {object} param0 An object that contains informations about
   *                        the previous and next location
   */
  drawPlayerOnMove({ movedFrom, newStep }) {
    this.draw(movedFrom, config.colors.board);
    this.draw(newStep, config.colors.snake);
  }

  /**
   * Handles player move event
   * 
   * @param {object} eventObject
   */
  movePlayer(eventObject) {
    const { newStep } = eventObject;

    if (
      newStep[0] < 0
      || newStep[1] < 0
      || newStep[0] >= config.chunksAmount
      || newStep[1] >= config.chunksAmount
    ) {
      clearInterval(this.playerMoveIntervalId);
      this.player.revokeControls();

      return alert(`You have lost with ${this.player.score} points`);
    }

    this.drawPlayerOnMove(eventObject);
  }
};
