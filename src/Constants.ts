import { iImage } from "./Interfaces/iImage";

export const GAME_CANVAS = "skiCanvas";
export const GAME_WIDTH = window.innerWidth*0.8;
export const GAME_HEIGHT = window.innerHeight;

export enum KEYS {
    LEFT = "ArrowLeft",
    RIGHT = "ArrowRight",
    UP = "ArrowUp",
    DOWN = "ArrowDown",
    SPACE = " ",
    RESTART = 'r',
    PAUSE = 'p',
}

export enum IMAGE_NAMES {
    SKIER_CRASH = "skierCrash",
    SKIER_LEFT = "skierLeft",
    SKIER_LEFTDOWN = "skierLeftDown",
    SKIER_DOWN = "skierDown",
    SKIER_RIGHTDOWN = "skierRightDown",
    SKIER_RIGHT = "skierRight",
    TREE = "tree",
    TREE_CLUSTER = "treeCluster",
    ROCK1 = "rock1",
    ROCK2 = "rock2",
    RHINO = "rhino",
    RHINO_RUN1 = "rhinoRun1",
    RHINO_RUN2 = "rhinoRun2",
    RHINO_EAT1 = "rhinoEat1",
    RHINO_EAT2 = "rhinoEat2",
    RHINO_EAT3 = "rhinoEat3",
    RHINO_EAT4 = "rhinoEat4",
    RHINO_CELEBRATE1 = "rhinoCelebrate1",
    RHINO_CELEBRATE2 = "rhinoCelebrate2",
    SKIER_JUMP1 = "skierJump1",
    SKIER_JUMP2 = "skierJump2",
    SKIER_JUMP3 = "skierJump3",
    SKIER_JUMP4 = "skierJump4",
    SKIER_JUMP5 = "skierJump5",
    JUMP_RAMP = "jumpRamp",
}

export const IMAGES: iImage[] = [
    { name: IMAGE_NAMES.SKIER_CRASH, url: "img/skier_crash.png" },
    { name: IMAGE_NAMES.SKIER_LEFT, url: "img/skier_left.png" },
    { name: IMAGE_NAMES.SKIER_LEFTDOWN, url: "img/skier_left_down.png" },
    { name: IMAGE_NAMES.SKIER_DOWN, url: "img/skier_down.png" },
    { name: IMAGE_NAMES.SKIER_RIGHTDOWN, url: "img/skier_right_down.png" },
    { name: IMAGE_NAMES.SKIER_RIGHT, url: "img/skier_right.png" },
    { name: IMAGE_NAMES.TREE, url: "img/tree_1.png" },
    { name: IMAGE_NAMES.TREE_CLUSTER, url: "img/tree_cluster.png" },
    { name: IMAGE_NAMES.ROCK1, url: "img/rock_1.png" },
    { name: IMAGE_NAMES.ROCK2, url: "img/rock_2.png" },
    { name: IMAGE_NAMES.RHINO, url: "img/rhino_default.png" },
    { name: IMAGE_NAMES.RHINO_RUN1, url: "img/rhino_run_left.png" },
    { name: IMAGE_NAMES.RHINO_RUN2, url: "img/rhino_run_left_2.png" },
    { name: IMAGE_NAMES.RHINO_EAT1, url: "img/rhino_eat_1.png" },
    { name: IMAGE_NAMES.RHINO_EAT2, url: "img/rhino_eat_2.png" },
    { name: IMAGE_NAMES.RHINO_EAT3, url: "img/rhino_eat_3.png" },
    { name: IMAGE_NAMES.RHINO_EAT4, url: "img/rhino_eat_4.png" },
    { name: IMAGE_NAMES.RHINO_CELEBRATE1, url: "img/rhino_celebrate_1.png" },
    { name: IMAGE_NAMES.RHINO_CELEBRATE2, url: "img/rhino_celebrate_2.png" },
    { name: IMAGE_NAMES.SKIER_JUMP1, url: "img/skier_jump_1.png" },
    { name: IMAGE_NAMES.SKIER_JUMP2, url: "img/skier_jump_2.png" },
    { name: IMAGE_NAMES.SKIER_JUMP3, url: "img/skier_jump_3.png" },
    { name: IMAGE_NAMES.SKIER_JUMP4, url: "img/skier_jump_4.png" },
    { name: IMAGE_NAMES.SKIER_JUMP5, url: "img/skier_jump_5.png" },
    { name: IMAGE_NAMES.JUMP_RAMP, url: "img/jump_ramp.png" },
];

export const ANIMATION_FRAME_SPEED_MS: number = 250;
export const DIAGONAL_SPEED_REDUCER: number = 1.4142;

/**
 * The different states the skier can be in.
 */

export enum SKIER_STATES {
    STATE_SKIING = "skiing",
    STATE_CRASHED = "crashed",
    STATE_DEAD = "dead",
}

/**
 * The different directions the skier can be facing.
 */
export const DIRECTION_LEFT: number = 0;
export const DIRECTION_LEFT_DOWN: number = 1;
export const DIRECTION_DOWN: number = 2;
export const DIRECTION_RIGHT_DOWN: number = 3;
export const DIRECTION_RIGHT: number = 4;
export const DIRECTION_JUMP: number = 5;

/**
 * The skier starts running at this speed. Saved in case speed needs to be reset at any point.
 */
export const STARTING_SPEED: number = 10;

/**
 * Mapping of the image to display for the skier based upon which direction they're facing.
 */
export const DIRECTION_IMAGES: { [key: number]: IMAGE_NAMES } = {
    [DIRECTION_LEFT]: IMAGE_NAMES.SKIER_LEFT,
    [DIRECTION_LEFT_DOWN]: IMAGE_NAMES.SKIER_LEFTDOWN,
    [DIRECTION_DOWN]: IMAGE_NAMES.SKIER_DOWN,
    [DIRECTION_RIGHT_DOWN]: IMAGE_NAMES.SKIER_RIGHTDOWN,
    [DIRECTION_RIGHT]: IMAGE_NAMES.SKIER_RIGHT,
    [DIRECTION_JUMP]: IMAGE_NAMES.SKIER_JUMP1,
};

/**
 * The different types of jump states the skier can be in.
 */
export const JUMP_ASSETS = [
    IMAGE_NAMES.SKIER_JUMP1,
    IMAGE_NAMES.SKIER_JUMP2,
    IMAGE_NAMES.SKIER_JUMP3,
    IMAGE_NAMES.SKIER_JUMP4,
    IMAGE_NAMES.SKIER_JUMP5,
];


/**
 * Game states
 */
export enum GAME_STATES {
    PLAYING = "Playing",
    PAUSED  = "Paused",
    GAME_OVER = "Game Over",
}