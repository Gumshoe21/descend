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
	normalGravity: number;
	reducedGravity: number;
	jumpTimer: number;
	maxJumpTime: number;
	jumpStart: number; // to hold the timestamp of when the jump started
	reducedGravityDuration = 300; // duration (in ms) for which gravity is reduced when jump button is held
	defaultGravity = 500; // default gravity value
	reducedGravity = 200; // reduced gravity value during jump
	jumpButtonHoldTime; // to track how long the jump button is held
	MAX_JUMP_TIME = 300; // max duration in ms the jump button can affect the jump
	INITIAL_JUMP_VELOCITY = -290;

	constructor() {
		super('hello-world');
		this.playerJumped = false;
		this.hasDoubleJump = true;
		this.PLAYER_VELOCITY_MAX = 200;
		this.PLAYER_VELOCITY_STEP = 20;
		this.normalGravity = 600; // Adjust as needed.
		this.reducedGravity = 1; // Adjust to be lower than normalGravity.
		this.jumpTimer = 0;
		this.maxJumpTime = 300; // Adjust as needed.
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
		this.player.body.gravity.y = this.normalGravity; // Set initial gravity.
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

		// Start the jump if on the floor
		if (this.player.body.onFloor() && Phaser.Input.Keyboard.JustDown(up)) {
			this.jumpButtonHoldTime = 0; // reset jump button hold time
			this.playerJumped = true;
			this.player.setVelocityY(this.INITIAL_JUMP_VELOCITY);
		}

		// If the player continues to hold the jump button after starting a jump
		if (up.isDown && this.playerJumped) {
			this.jumpButtonHoldTime += this.game.loop.delta; // accumulate hold time

			// If still within the "extra jump" window, give the player some extra upward force
			if (this.jumpButtonHoldTime <= this.MAX_JUMP_TIME && this.player.body.gravity.y >= -20) {
				this.player.body.gravity.y -= this.game.loop.delta * 10;
			}
		}

		// On releasing the jump button or after exceeding max jump time
		if (Phaser.Input.Keyboard.JustUp(up) || (this.jumpButtonHoldTime > this.MAX_JUMP_TIME && this.playerJumped)) {
			this.playerJumped = false; // player's jump is no longer influenced by the jump button
			this.player.setGravityY(1000);
		}

		// Implementing the double jump
		if (!this.player.body.onFloor() && Phaser.Input.Keyboard.JustDown(up) && this.hasDoubleJump) {
			this.hasDoubleJump = false;
			this.player.setVelocityY(-300);
		}
	}

	resetDoubleJump() {
		console.log(this.player.body.gravity.y);
		if (this.player.body.onFloor()) {
			this.player.setGravityY(600);
			// 	this.hasDoubleJump = true;
			// 	this.playerJumped = false;
			// 	this.physics.world.gravity.y = this.defaultGravity; // make sure gravity is reset when on the floor
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
