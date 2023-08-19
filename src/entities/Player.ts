import characterImg from '../assets/character.png';
import { GameConfig } from '../types';

export default class Player {
	scene: Phaser.Scene;
	sprite: Phaser.Physics.Arcade.Sprite;
	cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	hasDoubleJump: boolean;
	playerJumped: boolean;
	playerStartPosition: {
		x: number;
		y: number;
	};

	VELOCITY_X_MAX: number;
	VELOCITY_X_STEP: number;
	INITIAL_JUMP_VELOCITY = -290;
	MAX_JUMP_TIME = 300; // max duration in ms the jump button can affect the jump
	velocitySteps = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 200];
	currentVelocityIndex = 0;
	jumpVelocityX = 0;
	currentGravityY = 0;
	reducedGravityY = 0;
	normalGravityY: number;
	maxJumpTime: number;
	jumpButtonHoldTime = 0;

	constructor(scene: Phaser.Scene, config: GameConfig) {
		this.VELOCITY_X_MAX = 200;
		this.VELOCITY_X_STEP = 10;
		this.playerJumped = false;
		this.hasDoubleJump = true;
		this.normalGravityY = 600;
		this.maxJumpTime = 300;

		this.playerStartPosition = {
			x: config.width * 0.5,
			y: config.height,
		};
		this.scene = scene;

		this.sprite = this.scene.physics.add.sprite(this.playerStartPosition.x, this.playerStartPosition.y, 'testanims');

		this.sprite.setCollideWorldBounds(true);
		this.sprite.body.gravity.y = this.normalGravityY; // Set initial gravity.
		this.sprite.setOrigin(1, 1);
		this.cursors = this.scene.input.keyboard.createCursorKeys();
		// this.scene.anims.createFromAseprite('testanims');
		this.sprite.anims.create({
			key: 'flower_girl_idle',
			frames: [{ key: 'testanims', frame: '0' }],
			frameRate: 2,
			repeat: -1,
		});
		this.sprite.anims.create({
			key: 'flower_girl_run',
			frames: [
				{ key: 'testanims', frame: '0' },
				{ key: 'testanims', frame: '1' },
			],
			frameRate: 8,
			repeat: -1,
		});
		this.sprite.anims.create({
			key: 'flower_girl_jump',
			frames: [{ key: 'testanims', frame: '2' }],
			repeat: -1,
		});
		this.sprite.anims.create({
			key: 'flower_girl_fall',
			frames: [{ key: 'testanims', frame: '3' }],
			repeat: -1,
		});
	}

	animateVerticalMovement() {
		if (!this.sprite.body.onFloor()) {
			if (this.sprite.body.velocity.y < 0) {
				// Any negative value represents a jump
				this.sprite.anims.play('flower_girl_jump', true);
			} else if (this.sprite.body.velocity.y > 0) {
				// Positive value represents falling
				this.sprite.anims.play('flower_girl_fall', true);
			}
		}
	}

	handleControls() {
		this.animateHorizontalGroundMovement();
		this.resetDoubleJump();
		this.handleJump();

		this.handleHorizontalMovement();

		this.animateVerticalMovement();
	}

	animateHorizontalGroundMovement() {
		if (this.sprite.body.onFloor() && this.scene.controlManager.isRightPressed()) {
			this.sprite.anims.play('flower_girl_run', true);
			this.sprite.setFlipX(false);
		} else if (this.sprite.body.onFloor() && this.scene.controlManager.isLeftPressed()) {
			this.sprite.setFlipX(true);
			this.sprite.anims.play('flower_girl_run', true);
		}
		if (!this.sprite.body.onFloor() && this.scene.controlManager.isRightPressed()) {
			this.sprite.setFlipX(false);
		} else if (!this.sprite.body.onFloor() && this.scene.controlManager.isLeftPressed()) {
			this.sprite.setFlipX(true);
		} else if (this.sprite.body.onFloor() && this.scene.controlManager.nothingIsPressed()) {
			this.sprite.anims.play('flower_girl_idle', true);
		}
	}

	handleHorizontalMovement() {
		if (this.scene.controlManager.isLeftPressed()) {
			if (this.sprite.body.velocity.x > -this.VELOCITY_X_MAX) {
				this.sprite.body.velocity.x -= this.VELOCITY_X_STEP;
			}
		} else if (this.scene.controlManager.isRightPressed()) {
			if (this.sprite.body.velocity.x < this.VELOCITY_X_MAX) {
				this.sprite.body.velocity.x += this.VELOCITY_X_STEP;
			}
		} else if (
			!this.sprite.body.onFloor() &&
			!this.scene.controlManager.nothingIsPressed() &&
			this.sprite.body.velocity.x !== 0
		) {
			if (this.sprite.body.velocity.x < 0) {
				this.sprite.body.velocity.x += 1;
			} else if (this.sprite.body.velocity.x > 0) {
				this.sprite.body.velocity.x -= 1;
			}
		} else {
			this.sprite.setVelocityX(0);
		}
	}

	handleJump() {
		const { up } = this.cursors;
		this.setJumpPhysics();
		// Start the jump if on the floor
		if (this.sprite.body.onFloor() && this.scene.controlManager.jumpButtonJustPressed()) {
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
		if (
			this.scene.controlManager.jumpButtonJustReleased() ||
			(this.jumpButtonHoldTime > this.MAX_JUMP_TIME && this.playerJumped)
		) {
			this.playerJumped = false; // player's jump is no longer influenced by the jump button
			this.sprite.setGravityY(this.currentGravityY * 100);
		}
		// Implementing the double jump
		if (!this.sprite.body.onFloor() && this.scene.controlManager.jumpButtonJustPressed() && this.hasDoubleJump) {
			this.hasDoubleJump = false;
			this.sprite.setVelocityY(-300);
		}
	}

	setJumpPhysics() {
		const runSpeed = Math.abs(this.sprite.body.velocity.x);
		const basejumpVelocityX = 3;
		const basereducedGravityY = 2;
		const basecurrentGravityY = 7;
		if (runSpeed <= 50) {
			this.jumpVelocityX = basejumpVelocityX;
			this.reducedGravityY = basereducedGravityY;
			this.currentGravityY = basecurrentGravityY;
		} else {
			// Calculate increases based on the difference from the base runSpeed (100 in this case)
			const deltaSpeed = runSpeed - 100;

			this.jumpVelocityX = 3 + 0.01 * deltaSpeed;
			this.reducedGravityY = 2 + 0.005 * deltaSpeed;
			this.currentGravityY = 7 + 0.02 * deltaSpeed;
		}
	}

	resetDoubleJump() {
		if (this.sprite.body.onFloor()) {
			this.sprite.setGravityY(600);
			this.hasDoubleJump = true;
			this.playerJumped = false;
			// 	this.physics.world.gravity.y = this.defaultGravity; // make sure gravity is reset when on the floor
		}
	}
}
