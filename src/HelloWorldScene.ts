import Phaser from 'phaser';
import backgroundImg from './assets/background.png';
import characterImg from './assets/character.png';

export default class HelloWorldScene extends Phaser.Scene {
	isJumping = null;
	player: any;
	cursors: any;
	constructor() {
		super('hello-world');

		this.player = null;
	}

	preload() {
		this.load.image('background', backgroundImg);
		this.load.image('character', characterImg);
	}

	create() {
		this.createBg();
		this.createCharacter();

		this.player = this.physics.add.sprite(
			config.characterStartPosition.x,
			config.characterStartPosition.y,
			'character',
		);
		this.player.setCollideWorldBounds(true);
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update() {
		const { up, down, left, right } = this.cursors;

		// moving left and right
		if (left.isDown) {
			this.player.setVelocityX(-50);
		} else if (right.isDown) {
			this.player.setVelocityX(50);
		} else {
			this.player.setVelocityX(0);
		}
		// moving up and down
		if (up.isDown && this.player.body.onFloor()) {
			this.player.setVelocityY(-200);
		}
		console.log(this.player.body.touching.down);
	}

	createBg() {
		this.add.image(0, 0, 'background').setOrigin(0, 0);
	}

	createCharacter() {}
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
};
