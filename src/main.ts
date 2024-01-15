import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import { GameConfig, SceneCreator } from "./types";

const gameWidth = 800;
const gameHeight = 600;

const sharedConfig = {
	width: gameWidth,
	height: gameHeight,
	playerStartPosition: {
		x: gameWidth * 0.5,
		y: gameHeight / 2,
	},
};

const Scenes = [GameScene]; // order matters
const createScene: SceneCreator<Phaser.Scene> = (Scene, config) => {
	return new Scene(config);
};
const initScenes = (config: GameConfig) => Scenes.map(scene => createScene(scene, config)); // initializes all scenes

const config: GameConfig = {
	type: Phaser.AUTO,
	parent: "app",
	physics: {
		default: "arcade",
		arcade: {
			debug: true,
		},
	},
	input: { gamepad: true },
	...sharedConfig,
	scene: initScenes(sharedConfig),
};

new Phaser.Game(config);
