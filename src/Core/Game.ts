/**
 * The main game class. This initializes the game as well as runs the game/render loop and initial handling of input.
 */

import {
  GAME_CANVAS,
  GAME_HEIGHT,
  GAME_STATES,
  GAME_WIDTH,
  IMAGES,
  KEYS,
  LEVEL_INCREASE_STEP,
  SKIER_STATES,
  STARTING_SPEED,
} from "../Constants";
import { ObstacleManager } from "../Entities/Obstacles/ObstacleManager";
import { Rhino } from "../Entities/Rhino";
import { Skier } from "../Entities/Skier";
import { Canvas } from "./Canvas";
import { ImageManager } from "./ImageManager";
import { Position, Rect } from "./Utils";

export class Game {
  /**
   * The canvas the game will be displayed on
   */
  private canvas!: Canvas;

  /**
   * Coordinates denoting the active rectangular space in the game world
   * */
  private gameWindow!: Rect;

  /**
   * Current game time
   */
  private gameTime: number = Date.now();

  private imageManager!: ImageManager;

  private obstacleManager!: ObstacleManager;

  /**
   * The skier player
   */
  private skier!: Skier;

  /**
   * The enemy that chases the skier
   */
  private rhino!: Rhino;

  /**
   * animation frame
   */
  private animationFrame!: number;

  /**
   * The current game state.
   */
  private gameState: GAME_STATES = GAME_STATES.PLAYING;

  /**
   * The current game's difficulty level
   */
  private level = 1;

  /**
   * Initialize the game and setup any input handling needed.
   */
  constructor() {
    this.init();
    this.setupInputHandling();
  }

  /**
   * Create all necessary game objects and initialize them as needed.
   */
  init() {
    this.canvas = new Canvas(GAME_CANVAS, GAME_WIDTH, GAME_HEIGHT);
    this.imageManager = new ImageManager();
    this.obstacleManager = new ObstacleManager(this.imageManager, this.canvas);

    this.skier = new Skier(
      0,
      0,
      this.imageManager,
      this.obstacleManager,
      this.canvas
    );
    this.rhino = new Rhino(-500, -2000, this.imageManager, this.canvas);

    this.calculateGameWindow();
    this.obstacleManager.placeInitialObstacles();
  }

  /**
   * Setup listeners for any input events we might need.
   */
  setupInputHandling() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  /**
   * Load any assets we need for the game to run. Return a promise so that we can wait on something until all assets
   * are loaded before running the game.
   */
  async load(): Promise<void> {
    await this.imageManager.loadImages(IMAGES);
  }

  /**
   * The main game loop. Clear the screen, update the game objects and then draw them.
   */
  run() {
    if (this.gameState !== GAME_STATES.PAUSED) {
      this.canvas.clearCanvas();

      this.updateGameWindow();
      this.drawGameWindow();
    }
    this.updateGameBoard();

    this.animationFrame = requestAnimationFrame(this.run.bind(this));
  }

  restart() {
    if (this.gameState !== GAME_STATES.GAME_OVER) return;
    cancelAnimationFrame(this.animationFrame);

    this.gameState = GAME_STATES.PLAYING;
    this.obstacleManager = new ObstacleManager(this.imageManager, this.canvas);

    this.skier = new Skier(
      0,
      0,
      this.imageManager,
      this.obstacleManager,
      this.canvas
    );
    this.rhino = new Rhino(-500, -2000, this.imageManager, this.canvas);

    this.calculateGameWindow();
    this.run();
  }

  pauseResume() {
    if (this.gameState === GAME_STATES.GAME_OVER) return;
    if (this.gameState === GAME_STATES.PLAYING)
      this.gameState = GAME_STATES.PAUSED;
    else if (this.gameState === GAME_STATES.PAUSED)
      this.gameState = GAME_STATES.PLAYING;
  }

  updateGameBoard() {
    const gameState = document.getElementById("game_state")!;
    const gameScore = document.getElementById("game_score")!;
    const gameLevel = document.getElementById("game_level")!;

    gameState.innerText = this.gameState.toString();
    gameScore.innerText = this.skier.score.toLocaleString();
    gameLevel.innerText = this.level.toString();
  }

  /**
   * Do any updates needed to the game objects
   */
  updateGameWindow() {
    this.gameTime = Date.now();

    const previousGameWindow: Rect = this.gameWindow;
    this.calculateGameWindow();

    this.obstacleManager.placeNewObstacle(
      this.gameWindow,
      previousGameWindow,
      this.level
    );

    this.skier.update();
    this.rhino.update(this.gameTime, this.skier);

    this.level =
      this.skier.score % LEVEL_INCREASE_STEP === 0
        ? this.level + 1
        : this.level;
    this.skier.speed = STARTING_SPEED + (this.level - 1) * 5;
    this.rhino.speed = STARTING_SPEED + (this.level - 1) * 5;

    if (this.skier.state === SKIER_STATES.STATE_DEAD)
      this.gameState = GAME_STATES.GAME_OVER;
  }

  /**
   * Draw all entities to the screen, in the correct order. Also setup the canvas draw offset so that we see the
   * rectangular space denoted by the game window.
   */
  drawGameWindow() {
    this.canvas.setDrawOffset(this.gameWindow.left, this.gameWindow.top);

    this.skier.draw();
    this.rhino.draw();
    this.obstacleManager.drawObstacles();
  }

  /**
   * Calculate the game window (the rectangular space drawn to the screen). It's centered around the player and must
   * be updated since the player moves position.
   */
  calculateGameWindow() {
    const skierPosition: Position = this.skier.getPosition();
    const left: number = skierPosition.x - GAME_WIDTH / 2;
    const top: number = skierPosition.y - GAME_HEIGHT / 2;

    this.gameWindow = new Rect(left, top, left + GAME_WIDTH, top + GAME_HEIGHT);
  }

  /**
   * Handle keypresses and delegate to any game objects that might have key handling of their own.
   */
  handleKeyDown(event: KeyboardEvent) {
    let handled: boolean = true;
    switch (event.key) {
      case KEYS.RESTART:
        this.restart();
        break;
      case KEYS.PAUSE:
        this.pauseResume();
        break;

      default: // skier's controls
        handled = this.skier.handleInput(event.key);
    }

    if (handled) {
      event.preventDefault();
    }
  }
}
