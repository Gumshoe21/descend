import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import backgroundImg from './assets/background.png';
import characterImg from './assets/character.png';

class MyGame extends Phaser.Scene {
	constructor() {
		super();
	}

	preload() {
		this.load.image('background', backgroundImg);
		this.load.image('character', characterImg);
	}

	create() {
		this.createBg();
		this.createCharacter();
	}
	createBg() {
		this.add.image(0, 0, 'background').setOrigin(0, 0);
	}

	createCharacter() {
		this.physics.add
			.sprite(config.characterStartPosition.x, config.characterStartPosition.y, 'character')
			.setOrigin(0.5, 0.5);
	}
}

const WIDTH = 800;
const HEIGHT = 600;
const CHARACTER_POSITION = { x: WIDTH * 0.5, y: HEIGHT / 2 };

const sharedConfig = {
	width: WIDTH,
	height: HEIGHT,
	characterStartPosition: CHARACTER_POSITION,
};
const config = {
	/*
	scale: {
		mode: Phaser.Scale.FIT,
	},
	*/
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
