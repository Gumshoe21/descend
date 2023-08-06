import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import backgroundImg from './assets/background.png';
import squareImg from './assets/square.png';

class MyGame extends Phaser.Scene {
	constructor() {
		super();
	}

	preload() {
		this.load.image('background', backgroundImg);
		this.load.image('square', squareImg);
	}

	create() {
		this.createBg();
		this.createSquare();
	}
	createBg() {
		this.add.image(0, 0, 'background').setOrigin(0, 0);
	}

	createSquare() {
		this.physics.add.sprite(config.squareStartPosition.x, config.squareStartPosition.y, 'square').setOrigin(0.5, 0.5);
	}
}

const WIDTH = 320;
const HEIGHT = 240;
const SQUARE_POSITION = { x: WIDTH * 0.5, y: HEIGHT / 2 };

const sharedConfig = {
	width: WIDTH,
	height: HEIGHT,
	squareStartPosition: SQUARE_POSITION,
};
const config = {
	scale: {
		mode: Phaser.Scale.FIT,
	},
	type: Phaser.AUTO,
	...sharedConfig,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
		},
	},
	scene: MyGame,
};

new Phaser.Game(config);
