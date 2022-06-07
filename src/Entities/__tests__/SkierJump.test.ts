import {
    GAME_CANVAS,
    GAME_WIDTH,
    GAME_HEIGHT,
    DIRECTION_JUMP,
    DIRECTION_DOWN,
    DIRECTION_LEFT,
    DIRECTION_LEFT_DOWN,
    IMAGE_NAMES,
} from "../../Constants";
import { Canvas } from "../../Core/Canvas";
import { ImageManager } from "../../Core/ImageManager";
import { Obstacle } from "../Obstacles/Obstacle";
import { ObstacleManager } from "../Obstacles/ObstacleManager";
import { Skier } from "../Skier";
import { SkierJump } from "../SkierJump";

jest.mock("../../Core/Canvas", () => ({ Canvas: jest.fn() }));

describe("SkierJump", () => {
    let skier: Skier;
    let imageManager: ImageManager;
    let canvas: Canvas;
    let obstacleManager: ObstacleManager;
    let skierJump: SkierJump;

    beforeEach(() => {
        canvas = new Canvas(GAME_CANVAS, GAME_WIDTH, GAME_HEIGHT);
        imageManager = new ImageManager();
        obstacleManager = new ObstacleManager(imageManager, canvas);
        skier = new Skier(0, 0, imageManager, obstacleManager, canvas);
        skierJump = new SkierJump(skier);
    });

    it("should start jump", () => {
        skier.turnDown();
        skierJump.jumpStart();
        expect(skierJump.isJumping).toBe(true);
        expect(skierJump.jumpImage).toBe(0);
        expect(skierJump.initialDirection).toBe(DIRECTION_DOWN);
        expect(skierJump.assetAnimationTimer).toBe(0);
        expect(skier.direction).toBe(DIRECTION_JUMP);
    });

    it("should end jump", () => {
        skier.turnLeft();
        skierJump.jumpStart();
        expect(skier.direction).toBe(DIRECTION_JUMP);
        skierJump.jumpEnd();
        expect(skierJump.isJumping).toBe(false);
        expect(skier.direction).toBe(DIRECTION_LEFT_DOWN);
        expect(skierJump.jumpImage).toBe(0);
        expect(skierJump.assetAnimationTimer).toBe(0);
    });

    it("can jump over rocks and jump ramp", () => {
        skierJump.jumpStart();
        const obstacle = new Obstacle(0, 0, imageManager, canvas);

        // can jump over rock 1
        obstacle.imageName = IMAGE_NAMES.ROCK1;
        expect(skierJump.canJump(obstacle)).toBeTruthy();

        // can jump over rock 2
        obstacle.imageName = IMAGE_NAMES.ROCK2;
        expect(skierJump.canJump(obstacle)).toBeTruthy();

        // can jump over jump ramp
        obstacle.imageName = IMAGE_NAMES.JUMP_RAMP;
        expect(skierJump.canJump(obstacle)).toBeTruthy();
    });

    it("is jump ramp", () => {
        skierJump.jumpStart();
        const obstacle = new Obstacle(0, 0, imageManager, canvas);
        obstacle.imageName = IMAGE_NAMES.JUMP_RAMP;
        expect(skierJump.isJumpRamp(obstacle)).toBeTruthy();
    });

    it("can not jump over trees", () => {
        skierJump.jumpStart();
        const obstacle = new Obstacle(0, 0, imageManager, canvas);

        obstacle.imageName = IMAGE_NAMES.TREE;
        expect(skierJump.canJump(obstacle)).toBeFalsy();

        obstacle.imageName = IMAGE_NAMES.TREE_CLUSTER;
        expect(skierJump.canJump(obstacle)).toBeFalsy();
    });

    it("should jump skier first frame", () => {
        skierJump.jumpStart();
        skierJump.jumpSkier();
        expect(skierJump.assetAnimationTimer).toBe(1);
        expect(skierJump.jumpImage).toBe(0);
    });

    it("should jump skier first jump animation", () => {
        skierJump.jumpStart();
        for (let index = 0; index < skier.speed + 1; index++) {
            skierJump.jumpSkier();
        }
        expect(skierJump.assetAnimationTimer).toBe(0);
        expect(skierJump.jumpImage).toBe(1);
    });

    it("should jump skier second jump animation", () => {
        skierJump.jumpStart();
        skierJump.jumpImage++;
        for (let index = 0; index < skier.speed + 1; index++) {
            skierJump.jumpSkier();
        }
        expect(skierJump.assetAnimationTimer).toBe(0);
        expect(skierJump.jumpImage).toBe(2);
    });

    it("should not change jump image when timer doesn't exceed speed", () => {
        skierJump.jumpStart();
        skierJump.jumpImage++;
        for (let index = 0; index < skier.speed; index++) {
            skierJump.jumpSkier();
        }
        expect(skierJump.assetAnimationTimer).toBe(skier.speed);
        expect(skierJump.jumpImage).toBe(1);
    });
});
