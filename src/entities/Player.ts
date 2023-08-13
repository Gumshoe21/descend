import characterImg from '../assets/character.png';
import { GameConfig } from '../types';

export default class Player {
	scene: Phaser.Scene;
	sprite: Phaser.Physics.Arcade.Sprite;
	cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

	hasDoubleJump: boolean;
	playerJumped: boolean;

	VELOCITY_X_MAX: number;
	VELOCITY_X_STEP: number;
	INITIAL_JUMP_VELOCITY = -290;
	MAX_JUMP_TIME = 300; // max duration in ms the jump button can affect the jump

	jumpVelocityX = 0;
	currentGravityY = 0;
	reducedGravityY = 0;
	normalGravityY: number;
	maxJumpTime: number;
	jumpButtonHoldTime = 0;

	constructor(scene: Phaser.Scene, config: GameConfig) {
		this.VELOCITY_X_MAX = 200;
		this.VELOCITY_X_STEP = 2;
		this.playerJumped = false;
		this.hasDoubleJump = true;
		this.normalGravityY = 600;
		this.maxJumpTime = 300;

		this.scene = scene;

		this.sprite = this.scene.physics.add.sprite(
			config.characterStartPosition.x,
			config.characterStartPosition.y,
			'character',
		);
		this.sprite.setCollideWorldBounds(true);
		this.sprite.body.gravity.y = this.normalGravityY; // Set initial gravity.

		this.cursors = this.scene.input.keyboard.createCursorKeys();
	}

	handleControls() {
		this.resetDoubleJump();
		this.handleJump();
		this.handleHorizontalMovement();
	}

	handleHorizontalMovement() {
		const { left, right } = this.cursors;
		if (left.isDown && !right.isDown) {
			if (this.sprite.body.velocity.x > -this.VELOCITY_X_MAX) {
				this.sprite.body.velocity.x -= this.VELOCITY_X_STEP;
			}
		} else if (right.isDown && !left.isDown) {
			if (this.sprite.body.velocity.x < this.VELOCITY_X_MAX) {
				this.sprite.body.velocity.x += this.VELOCITY_X_STEP;
			}
		} else {
			this.sprite.setVelocityX(0);
		}
	}

	handleJump() {
		const { up } = this.cursors;
		this.setJumpPhysics();
		// Start the jump if on the floor
		if (this.sprite.body.onFloor() && Phaser.Input.Keyboard.JustDown(up)) {
			this.jumpButtonHoldTime = 0; // reset jump button hold time
			this.playerJumped = true;
			// this.player.setVelocityY(-290);
			this.sprite.setVelocityY(-this.jumpVelocityX * 100);
		}
		// If the player continues to hold the jump button after starting a jump
		if (up.isDown && this.playerJumped) {
			this.jumpButtonHoldTime += this.scene.game.loop.delta; // accumulate hold time

			// If still within the "extra jump" window, give the player some extra upward force
			if (this.jumpButtonHoldTime <= this.MAX_JUMP_TIME && this.sprite.body.gravity.y >= -20) {
				//		this.player.body.gravity.y -= this.game.loop.delta * 10;
				this.sprite.body.gravity.y -= this.scene.game.loop.delta * this.reducedGravityY;
			}
		}
		// On releasing the jump button or after exceeding max jump time
		if (Phaser.Input.Keyboard.JustUp(up) || (this.jumpButtonHoldTime > this.MAX_JUMP_TIME && this.playerJumped)) {
			this.playerJumped = false; // player's jump is no longer influenced by the jump button
			this.sprite.setGravityY(this.currentGravityY * 100);
		}
		// Implementing the double jump
		if (!this.sprite.body.onFloor() && Phaser.Input.Keyboard.JustDown(up) && this.hasDoubleJump) {
			this.hasDoubleJump = false;
			this.sprite.setVelocityY(-300);
		}
	}

	setJumpPhysics() {
		const runSpeed = Math.abs(this.sprite.body.velocity.x);
		const basejumpVelocityX = 3;
		const basereducedGravityY = 2;
		const basecurrentGravityY = 7;
		if (runSpeed <= 100) {
			this.jumpVelocityX = basejumpVelocityX;
			this.reducedGravityY = basereducedGravityY;
			this.currentGravityY = basecurrentGravityY;
		} else {
			// Calculate increases based on the difference from the base runSpeed (100 in this case)
			const deltaSpeed = runSpeed - 100;

			this.jumpVelocityX = 3 + 0.005 * deltaSpeed;
			this.reducedGravityY = 2 + 0.005 * deltaSpeed;
			this.currentGravityY = 7 + 0.02 * deltaSpeed;
		}
	}

	resetDoubleJump() {
		console.log(this.sprite.body.velocity.x);
		if (this.sprite.body.onFloor()) {
			this.sprite.setGravityY(600);
			this.hasDoubleJump = true;
			this.playerJumped = false;
			// 	this.physics.world.gravity.y = this.defaultGravity; // make sure gravity is reset when on the floor
		}
	}
}
