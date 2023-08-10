import Phaser from 'phaser';
import backgroundImg from './assets/background.png';
import characterImg from './assets/character.png';

export default class HelloWorldScene extends Phaser.Scene {
	isJumping = null;
	hasDoubleJump = true;
	player: any;
	PLAYER_VELOCITY_MAX = 200;
	PLAYER_VELOCITY_STEP = 20;
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

	handleControls() {
		const { up, down, left, right } = this.cursors;
		// moving left and right
		if (left.isDown && !right.isDown) {
			if (this.player.body.velocity.x > -this.PLAYER_VELOCITY_MAX) {
				this.player.body.velocity.x -= this.PLAYER_VELOCITY_STEP;
			}
		} else if (right.isDown && !left.isDown) {
			if (this.player.body.velocity.x < this.PLAYER_VELOCITY_MAX) {
				this.player.body.velocity.x += this.PLAYER_VELOCITY_STEP;
			}
			console.log(this.player.body.velocity.x);
		} else {
			this.player.setVelocityX(0);
		}
		// moving up and down
		if (this.player.body.onFloor() && Phaser.Input.Keyboard.JustDown(up)) {
			this.player.setVelocityY(-200);
		} else if (!this.player.body.onFloor() && Phaser.Input.Keyboard.JustDown(up) && this.hasDoubleJump) {
			this.hasDoubleJump = false; // consume double jump when used in the air
			this.player.setVelocityY(-200);
		}
		console.log(this.player.body.onFloor());
		if (this.player.body.onFloor()) {
			this.hasDoubleJump = true; // Make double jump available whenever player is on the floor.
		}
	}

	update() {
		this.handleControls();
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
