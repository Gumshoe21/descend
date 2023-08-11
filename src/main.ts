import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import { GameConfig } from './types';

const WIDTH = 800;
const HEIGHT = 600;
const CHARACTER_POSITION = { x: WIDTH * 0.5, y: HEIGHT / 2 };

const SHARED_CONFIG = {
	width: WIDTH,
	height: HEIGHT,
	characterStartPosition: CHARACTER_POSITION,
};

const Scenes = [GameScene]; // order matters
const createScene = Scene => new Scene(SHARED_CONFIG); // helper function to instantiate scene
const initScenes = () => Scenes.map(createScene); // initializes all scenes

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
	scene: initScenes(),
};

new Phaser.Game(config);
