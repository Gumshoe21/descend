import Phaser from 'phaser';
import backgroundImg from './assets/background.png';
import characterImg from './assets/character.png';

export default class HelloWorldScene extends Phaser.Scene {
	hasDoubleJump: boolean;
	playerJumped: boolean;
	player!: Phaser.Physics.Arcade.Sprite;
	PLAYER_VELOCITY_MAX: number;
	PLAYER_VELOCITY_STEP: number;
	cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

	constructor() {
		super('hello-world');
		this.playerJumped = false;
		this.hasDoubleJump = true;
		this.PLAYER_VELOCITY_MAX = 200;
		this.PLAYER_VELOCITY_STEP = 20;
	}

	preload() {
		this.load.image('background', backgroundImg);
		this.load.image('character', characterImg);
	}

	create() {
		this.createBg();
		this.player = this.physics.add.sprite(
			config.characterStartPosition.x,
			config.characterStartPosition.y,
			'character',
		);
		this.player.setCollideWorldBounds(true);
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update() {
		this.handleControls();
	}

	handleControls() {
		this.resetDoubleJump();
		this.handleJump();
		this.handleHorizontalMovement();
	}

	handleHorizontalMovement() {
		const { left, right } = this.cursors;
		if (left.isDown && !right.isDown) {
			if (this.player.body.velocity.x > -this.PLAYER_VELOCITY_MAX) {
				this.player.body.velocity.x -= this.PLAYER_VELOCITY_STEP;
			}
		} else if (right.isDown && !left.isDown) {
			if (this.player.body.velocity.x < this.PLAYER_VELOCITY_MAX) {
				this.player.body.velocity.x += this.PLAYER_VELOCITY_STEP;
			}
		} else {
			this.player.setVelocityX(0);
		}
	}
	handleJump() {
		const { up } = this.cursors;

		// grounded jump
		if (this.player.body.onFloor() && Phaser.Input.Keyboard.JustDown(up)) {
			this.player.setVelocityY(-200); // Start the jump with an initial force
			this.playerJumped = true;
		}

		// If the jump key is released early and the player is still moving upwards, reduce the upward force
		if (this.playerJumped && Phaser.Input.Keyboard.JustUp(up) && this.player.body.velocity.y < 0) {
			this.player.setVelocityY(-100); // You can adjust this value to control the early release jump height
		}

		// double jump
		if (!this.player.body.onFloor() && Phaser.Input.Keyboard.JustDown(up) && this.hasDoubleJump) {
			this.hasDoubleJump = false;
			this.player.setVelocityY(-200); // Jump force for double jump
		}
	}

	resetDoubleJump() {
		if (this.player.body.onFloor()) {
			this.hasDoubleJump = true; // Make double jump available whenever player is on the floor.
			this.playerJumped = false;
		}
	}

	createBg() {
		this.add.image(0, 0, 'background').setOrigin(0, 0);
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
};
