/**
 * The skier is the entity controlled by the player in the game. The skier skis down the hill, can move at different
 * angles, and crashes into obstacles they run into. If caught by the rhino, the skier will get eaten and die.
 */

import {
    DIAGONAL_SPEED_REDUCER,
    DIRECTION_DOWN,
    DIRECTION_IMAGES,
    DIRECTION_JUMP,
    DIRECTION_LEFT,
    DIRECTION_LEFT_DOWN,
    DIRECTION_RIGHT,
    DIRECTION_RIGHT_DOWN,
    IMAGE_NAMES,
    KEYS,
    SKIER_STATES,
    STARTING_SPEED,
} from "../Constants";
import { Canvas } from "../Core/Canvas";
import { ImageManager } from "../Core/ImageManager";
import { intersectTwoRects, Rect } from "../Core/Utils";
import { Entity } from "./Entity";
import { Obstacle } from "./Obstacles/Obstacle";
import { ObstacleManager } from "./Obstacles/ObstacleManager";
import { SkierJump } from "./SkierJump";

export class Skier extends Entity {
    /**
     * The name of the current image being displayed for the skier.
     */
    imageName: IMAGE_NAMES = IMAGE_NAMES.SKIER_DOWN;

    /**
     * What state the skier is currently in.
     */
    state: SKIER_STATES = SKIER_STATES.STATE_SKIING;

    /**
     * What direction the skier is currently facing.
     */
    direction: number = DIRECTION_DOWN;

    /**
     * How fast the skier is currently moving in the game world.
     */
    speed: number = STARTING_SPEED;

    /**
     * Stored reference to the ObstacleManager
     */
    obstacleManager: ObstacleManager;

    /**
     * Determine if skier is jumping or not
     */
    jump: SkierJump;

    /**
     * Skier's game score
     */
    score: number = 0;

    /**
     * Skier's lives score
     */
    lives: number = 4;

    /**
     * Current obstacle the skier has collided with.
     */
    currentCollidedObstacleId: number | null = null;

    /**
     * Init the skier.
     */
    constructor(
        x: number,
        y: number,
        imageManager: ImageManager,
        obstacleManager: ObstacleManager,
        canvas: Canvas
    ) {
        super(x, y, imageManager, canvas);

        this.obstacleManager = obstacleManager;
        this.jump = new SkierJump(this);
    }

    /**
     * Is the skier currently in the crashed state
     */
    isCrashed(): boolean {
        return this.state === SKIER_STATES.STATE_CRASHED;
    }

    /**
     * Is the skier currently in the skiing state
     */
    isSkiing(): boolean {
        return this.state === SKIER_STATES.STATE_SKIING;
    }

    /**
     * Is the skier currently in the dead state
     */
    isDead(): boolean {
        return this.state === SKIER_STATES.STATE_DEAD;
    }

    /**
     * Set the current direction the skier is facing and update the image accordingly
     */
    setDirection(direction: number) {
        this.direction = direction;
        this.setDirectionalImage();
    }

    /**
     * Set the skier's image based upon the direction they're facing.
     */
    setDirectionalImage() {
        if (this.jump.isJumping) {
            this.imageName = this.jump.getJumpAsset();
            return;
        }
        this.imageName = DIRECTION_IMAGES[this.direction];
    }

    /**
     * Move the skier and check to see if they've hit an obstacle. The skier only moves in the skiing state.
     */
    update() {
        if (this.isSkiing()) {
            this.move();
            this.checkIfHitObstacle();
        }
    }

    /**
     * Draw the skier if they aren't dead
     */
    draw() {
        if (this.isDead()) {
            return;
        }

        super.draw();
    }

    /**
     * Move the skier based upon the direction they're currently facing. This handles frame update movement.
     */
    move() {
        switch (this.direction) {
            case DIRECTION_LEFT_DOWN:
                this.moveSkierLeftDown();
                break;
            case DIRECTION_DOWN:
                this.moveSkierDown();
                break;
            case DIRECTION_RIGHT_DOWN:
                this.moveSkierRightDown();
                break;
            case DIRECTION_JUMP:
                this.jump.jumpSkier();
            case DIRECTION_LEFT:
            case DIRECTION_RIGHT:
                // Specifically calling out that we don't move the skier each frame if they're facing completely horizontal.
                break;
        }

        this.setDirectionalImage();
    }

    /**
     * Move the skier left. Since completely horizontal movement isn't frame based, just move incrementally based upon
     * the starting speed.
     */
    moveSkierLeft() {
        this.position.x -= STARTING_SPEED;
    }

    /**
     * Move the skier diagonally left in equal amounts down and to the left. Use the current speed, reduced by the scale
     * of a right triangle hypotenuse to ensure consistent traveling speed at an angle.
     */
    moveSkierLeftDown() {
        this.position.x -= this.speed / DIAGONAL_SPEED_REDUCER;
        this.position.y += this.speed / DIAGONAL_SPEED_REDUCER;
    }

    /**
     * Move the skier down at the speed they're traveling.
     */
    moveSkierDown() {
        this.position.y += this.speed;
    }

    /**
     * Move the skier diagonally right in equal amounts down and to the right. Use the current speed, reduced by the scale
     * of a right triangle hypotenuse to ensure consistent traveling speed at an angle.
     */
    moveSkierRightDown() {
        this.position.x += this.speed / DIAGONAL_SPEED_REDUCER;
        this.position.y += this.speed / DIAGONAL_SPEED_REDUCER;
    }

    /**
     * Move the skier right. Since completely horizontal movement isn't frame based, just move incrementally based upon
     * the starting speed.
     */
    moveSkierRight() {
        this.position.x += STARTING_SPEED;
    }

    /**
     * Move the skier up. Since moving up isn't frame based, just move incrementally based upon
     * the starting speed.
     */
    moveSkierUp() {
        this.position.y -= STARTING_SPEED;
    }

    /**
     * Handle keyboard input. If the skier is dead, don't handle any input.
     */
    handleInput(inputKey: string) {
        if (this.isDead()) {
            return false;
        }

        let handled: boolean = true;

        switch (inputKey) {
            case KEYS.LEFT:
                this.turnLeft();
                break;
            case KEYS.RIGHT:
                this.turnRight();
                break;
            case KEYS.UP:
                this.turnUp();
                break;
            case KEYS.DOWN:
                this.turnDown();
                break;
            case KEYS.SPACE:
                this.jump.jumpStart();
            default:
                handled = false;
        }

        return handled;
    }

    /**
     * Turn the skier left. If they're already completely facing left, move them left. Otherwise, change their direction
     * one step left. If they're in the crashed state, then first recover them from the crash.
     */
    turnLeft() {
        if (this.isCrashed()) {
            this.recoverFromCrash(DIRECTION_LEFT);
        }

        // do nothing when skier is jumping
        if (this.jump.isJumping) return;

        if (this.direction === DIRECTION_LEFT) {
            this.moveSkierLeft();
        } else {
            this.setDirection(this.direction - 1);
        }
    }

    /**
     * Turn the skier right. If they're already completely facing right, move them right. Otherwise, change their direction
     * one step right. If they're in the crashed state, then first recover them from the crash.
     */
    turnRight() {
        if (this.isCrashed()) {
            this.recoverFromCrash(DIRECTION_RIGHT);
        }

        // do nothing when skier is jumping
        if (this.jump.isJumping) return;

        if (this.direction === DIRECTION_RIGHT) {
            this.moveSkierRight();
        } else {
            this.setDirection(this.direction + 1);
        }
    }

    /**
     * Turn the skier up which basically means if they're facing left or right, then move them up a bit in the game world.
     * If they're in the crashed state, do nothing as you can't move up if you're crashed.
     */
    turnUp() {
        if (this.isCrashed()) {
            return;
        }

        // do nothing when skier is jumping
        if (this.jump.isJumping) return;

        if (this.direction === DIRECTION_LEFT || this.direction === DIRECTION_RIGHT) {
            this.moveSkierUp();
        }
    }

    /**
     * Turn the skier to face straight down. If they're crashed don't do anything to require them to move left or right
     * to escape an obstacle before skiing down again.
     */
    turnDown() {
        if (this.isCrashed()) {
            return;
        }

        this.setDirection(DIRECTION_DOWN);
    }

    /**
     * The skier has a bit different bounds calculating than a normal entity to make the collision with obstacles more
     * natural. We want te skier to end up in the obstacle rather than right above it when crashed, so move the bottom
     * boundary up.
     */
    getBounds(): Rect | null {
        const image = this.imageManager.getImage(this.imageName);
        if (!image) {
            return null;
        }

        return new Rect(
            this.position.x - image.width / 2,
            this.position.y - image.height / 2,
            this.position.x + image.width / 2,
            this.position.y - image.height / 4
        );
    }

    /**
     * Go through all the obstacles in the game and see if the skier collides with any of them. If so, crash the skier.
     */
    checkIfHitObstacle() {
        const skierBounds = this.getBounds();
        if (!skierBounds) {
            return;
        }

        const collision = this.obstacleManager
            .getObstacles()
            .find((obstacle: Obstacle): boolean => {
                const obstacleBounds = obstacle.getBounds();
                if (!obstacleBounds) {
                    return false;
                }

                // if skier is jumping and can jump over rock1 and rock2, then don't check for collision
                if (this.jump.canJump(obstacle)) return false;

                return intersectTwoRects(skierBounds, obstacleBounds);
            });

        if (collision && this.currentCollidedObstacleId !== collision.id) {
            this.currentCollidedObstacleId = collision.id;
            this.crash();
        }
    }

    /**
     * Crash the skier. Set the state to crashed, set the speed to zero cause you can't move when crashed and update the
     * image.
     */
    crash() {
        // decrease life if not already dead
        if (this.state !== SKIER_STATES.STATE_CRASHED && this.lives > 0) {
            this.lives -= 1;
        }

        if (this.lives === 0) return this.die();

        this.state = SKIER_STATES.STATE_CRASHED;
        this.speed = 0;
        this.imageName = IMAGE_NAMES.SKIER_CRASH;
    }

    /**
     * Change the skier back to the skiing state, get them moving again at the starting speed and set them facing
     * whichever direction they're recovering to.
     */
    recoverFromCrash(newDirection: number) {
        this.state = SKIER_STATES.STATE_SKIING;
        this.speed = STARTING_SPEED;
        this.setDirection(newDirection);
        this.currentCollidedObstacleId = null;
    }

    /**
     * Kill the skier by putting them into the "dead" state and stopping their movement.
     */
    die() {
        this.state = SKIER_STATES.STATE_DEAD;
        this.speed = 0;
    }
}
