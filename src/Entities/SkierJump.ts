import {
    DIRECTION_JUMP,
    DIRECTION_LEFT_DOWN,
    DIRECTION_RIGHT_DOWN,
    IMAGE_NAMES,
    JUMP_ASSETS,
} from "../Constants";
import { Obstacle } from "./Obstacles/Obstacle";
import { Skier } from "./Skier";

export class SkierJump {
    /**
     * Determines if the jump is in progress
     */
    isJumping: boolean = false;

    /**
     * Saves the initial direction before the jump
     */
    initialDirection?: number;

    /**
     * The asset animation frame for the jump animation.
     */
    assetAnimationFrame: number = 0;

    /**
     * The asset to be used for the jump
     */
    jumpImage: number = 0;

    /**
     * The skier to perform the jump on.
     */
    skier: Skier;

    constructor(skier: Skier) {
        this.skier = skier;
    }

    /**
     * Calculates the jump image to show and end jump animation for the last jump asset.
     */
    getJumpAsset() {
        if (this.jumpImage === JUMP_ASSETS.length - 1) this.jumpEnd();

        return JUMP_ASSETS[this.jumpImage];
    }

    /**
     * Start jumping sequence for the skier. If they're in the crashed state, don't do anything as you can't jump if you're crashed.
     * Requires them to move left or right to recover.
     */
    jumpStart() {
        if (this.skier.isCrashed()) {
            return;
        }

        this.isJumping = true;
        this.initialDirection = this.skier.direction; // save the direction we're jumping in so we continue after jumping
        this.assetAnimationFrame = 0;
        this.jumpImage = 0;
        this.skier.setDirection(DIRECTION_JUMP);
    }

    /**
     * end jumping sequence for the skier. If they're in the crashed state, don't do anything as you can't jump if you're crashed.
     */
    jumpEnd() {
        if (this.skier.isCrashed()) {
            return;
        }

        this.isJumping = false;
        this.assetAnimationFrame = 0;
        this.jumpImage = 0;
        this.skier.setDirection(this.initialDirection ?? this.skier.direction);
    }

    /**
     * Determines if the skier can jump over obstacle
     */
    canJump(obstacle: Obstacle) {
        return (
            (obstacle.imageName === IMAGE_NAMES.ROCK1 ||
                obstacle.imageName === IMAGE_NAMES.ROCK2 ||
                obstacle.imageName === IMAGE_NAMES.JUMP_RAMP) &&
            this.isJumping
        );
    }

    /**
     * Check's if obstacle is a jump ramp
     */
    isJumpRamp(obstacle: Obstacle) {
        return obstacle.imageName === IMAGE_NAMES.JUMP_RAMP;
    }

    /**
     * Let's the skier jump.
     */
    jumpSkier() {
        this.skier.position.y += this.skier.speed;
        this.skier.score += 2;

        // continue jumping left down, if we were moving left down before jumping
        if (this.initialDirection === DIRECTION_LEFT_DOWN)
            this.skier.position.x -= this.skier.speed;

        // continue jumping right down, if we were moving left down before jumping
        if (this.initialDirection === DIRECTION_RIGHT_DOWN)
            this.skier.position.x += this.skier.speed;

        // animation timer
        this.skier.jump.assetAnimationFrame++;

        // only reset asset and timer when we've reached the end of the jump animation
        if (this.skier.jump.assetAnimationFrame <= this.skier.speed) return;

        this.jumpImage++;
        this.assetAnimationFrame = 0;
    }
}
