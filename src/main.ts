import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import { GameConfig, SceneCreator } from './types';

const WIDTH = 800;
const HEIGHT = 600;
const CHARACTER_POSITION = { x: WIDTH * 0.5, y: HEIGHT / 2 };

const SHARED_CONFIG = {
	width: WIDTH,
	height: HEIGHT,
	characterStartPosition: CHARACTER_POSITION,
};

const Scenes = [GameScene]; // order matters

const createScene: SceneCreator<Phaser.Scene> = (Scene, config) => {
	return new Scene(config);
};

const initScenes = (config: GameConfig) => Scenes.map(scene => createScene(scene, config)); // initializes all scenes

const config: GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	...SHARED_CONFIG,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
		},
	},
	scene: initScenes(SHARED_CONFIG),
	input: { gamepad: true },
};

new Phaser.Game(config);
