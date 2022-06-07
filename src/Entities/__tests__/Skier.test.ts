import {
    GAME_CANVAS,
    GAME_WIDTH,
    GAME_HEIGHT,
    STARTING_SPEED,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DIRECTION_LEFT_DOWN,
    DIRECTION_RIGHT_DOWN,
    DIRECTION_DOWN,
    SKIER_STATES,
    DIRECTION_JUMP,
    IMAGE_NAMES,
    KEYS,
} from "../../Constants";
import { Canvas } from "../../Core/Canvas";
import { ImageManager } from "../../Core/ImageManager";
import { intersectTwoRects, Rect } from "../../Core/Utils";
import { Obstacle } from "../Obstacles/Obstacle";
import { ObstacleManager } from "../Obstacles/ObstacleManager";
import { Skier } from "../Skier";

jest.mock("../../Core/Canvas", () => ({ Canvas: jest.fn() }));
jest.mock("../../Core/Utils", () => ({
    ...jest.requireActual("../../Core/Utils"),
    intersectTwoRects: jest.fn(),
}));

describe("Skier", () => {
    let skier: Skier;
    let imageManager: ImageManager;
    let canvas: Canvas;
    let obstacleManager: ObstacleManager;

    beforeEach(() => {
        canvas = new Canvas(GAME_CANVAS, GAME_WIDTH, GAME_HEIGHT);
        imageManager = new ImageManager();
        obstacleManager = new ObstacleManager(imageManager, canvas);
        skier = new Skier(0, 0, imageManager, obstacleManager, canvas);

        jest.spyOn(imageManager, "getImage").mockImplementation(
            () => ({ width: 12, height: 12 } as any)
        );
    });

    it("should have a starting speed", () => {
        expect(skier.speed).toBe(STARTING_SPEED);
    });

    it("should move left diagonally", () => {
        skier.turnLeft();
        expect(skier.direction).toBe(DIRECTION_LEFT_DOWN);
    });

    it("should move right diagonally", () => {
        skier.turnRight();
        expect(skier.direction).toBe(DIRECTION_RIGHT_DOWN);
    });

    it("should move direct left", () => {
        skier.turnLeft();
        skier.turnLeft();

        expect(skier.direction).toBe(DIRECTION_LEFT);
    });

    it("should move direct right", () => {
        skier.turnRight();
        skier.turnRight();

        expect(skier.direction).toBe(DIRECTION_RIGHT);
    });

    it("should move down", () => {
        skier.turnDown();
        expect(skier.direction).toBe(DIRECTION_DOWN);
    });

    it("should crash", () => {
        skier.crash();
        expect(skier.state).toBe(SKIER_STATES.STATE_CRASHED);
        expect(skier.speed).toBe(0);
    });

    it("should die", () => {
        skier.die();
        expect(skier.state).toBe(SKIER_STATES.STATE_DEAD);
        expect(skier.speed).toBe(0);
    });

    it("should jump", () => {
        skier.jump.jumpStart();
        expect(skier.jump.isJumping).toBeTruthy();
        expect(skier.direction).toBe(DIRECTION_JUMP);
    });

    it("should not jump is skier has crashed", () => {
        skier.crash();
        skier.jump.jumpStart();
        expect(skier.direction).not.toBe(DIRECTION_JUMP);
    });

    it("can jump over rocks", () => {
        skier.jump.jumpStart();
        const obstacle = new Obstacle(0, 0, imageManager, canvas);

        // can jump over rock 1
        obstacle.imageName = IMAGE_NAMES.ROCK1;
        expect(skier.jump.canJump(obstacle)).toBeTruthy();

        // can jump over rock 2
        obstacle.imageName = IMAGE_NAMES.ROCK2;
        expect(skier.jump.canJump(obstacle)).toBeTruthy();

        // can jump over jump ramp
        obstacle.imageName = IMAGE_NAMES.JUMP_RAMP;
        expect(skier.jump.canJump(obstacle)).toBeTruthy();
    });

    it("can not jump over trees", () => {
        skier.jump.jumpStart();
        const obstacle = new Obstacle(0, 0, imageManager, canvas);

        obstacle.imageName = IMAGE_NAMES.TREE;
        expect(skier.jump.canJump(obstacle)).toBeFalsy();

        obstacle.imageName = IMAGE_NAMES.TREE_CLUSTER;
        expect(skier.jump.canJump(obstacle)).toBeFalsy();
    });

    it("should recover from crash", () => {
        skier.crash();
        skier.recoverFromCrash(DIRECTION_LEFT);
        expect(skier.state).toBe(SKIER_STATES.STATE_SKIING);
        expect(skier.direction).toBe(DIRECTION_LEFT);
    });

    it("should get skier bounds", () => {
        const bounds = skier.getBounds();
        expect(bounds?.top).toBe(-6);
        expect(bounds?.bottom).toBe(-3);
        expect(bounds?.left).toBe(-6);
        expect(bounds?.right).toBe(6);
        expect(bounds).toBeInstanceOf(Rect);
    });

    it("should handle left input", () => {
        skier.handleInput(KEYS.LEFT);
        expect(skier.direction).toBe(DIRECTION_LEFT_DOWN);
    });

    it("should handle right input", () => {
        skier.handleInput(KEYS.RIGHT);
        expect(skier.direction).toBe(DIRECTION_RIGHT_DOWN);
    });

    it("should handle down input", () => {
        skier.handleInput(KEYS.DOWN);
        expect(skier.direction).toBe(DIRECTION_DOWN);
    });

    it("should handle jump input", () => {
        skier.handleInput(KEYS.SPACE);
        expect(skier.direction).toBe(DIRECTION_JUMP);
    });

    it("should hit obstacle if collids", () => {
        obstacleManager.placeRandomObstacle(new Rect(0, 0, 0, 0));

        (intersectTwoRects as jest.Mock).mockReturnValueOnce(true);

        expect(skier.state).not.toBe(SKIER_STATES.STATE_CRASHED);

        skier.checkIfHitObstacle();

        expect(skier.state).toBe(SKIER_STATES.STATE_CRASHED);
        expect(skier.speed).toBe(0);
    });

    it("should not hit obstacle if allowed to jump and skier is jumping", () => {
        skier.jump.jumpStart()
        obstacleManager.placeRandomObstacle(new Rect(0, 0, 0, 0));
        obstacleManager.obstacles[0].imageName = IMAGE_NAMES.ROCK1;

        (intersectTwoRects as jest.Mock).mockReturnValueOnce(true);

        expect(skier.state).not.toBe(SKIER_STATES.STATE_CRASHED);

        skier.checkIfHitObstacle();

        expect(skier.state).not.toBe(SKIER_STATES.STATE_CRASHED);
        expect(skier.speed).not.toBe(0);
        expect(intersectTwoRects).not.toHaveBeenCalled();
    });

    it("should hit obstacle if allowed to jump but skier is not jumping", () => {
        skier.turnDown()
        obstacleManager.placeRandomObstacle(new Rect(0, 0, 0, 0));
        obstacleManager.obstacles[0].imageName = IMAGE_NAMES.ROCK1;

        (intersectTwoRects as jest.Mock).mockReturnValueOnce(true);

        expect(skier.state).not.toBe(SKIER_STATES.STATE_CRASHED);

        skier.checkIfHitObstacle();

        expect(skier.state).toBe(SKIER_STATES.STATE_CRASHED);
        expect(skier.speed).toBe(0);
    });
});
