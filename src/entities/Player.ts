import characterImg from "../assets/character.png";
import { GameConfig } from "../types";

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
	GRAVITY_Y_NORMAL: number;
	jumpVelocityX = 0;
	currentGravityY = 0;
	reducedGravityY = 0;
	maxJumpTime: number;
	jumpButtonHoldTime = 0;

	constructor(scene: Phaser.Scene, config: GameConfig) {
		this.VELOCITY_X_MAX = 300;
		this.VELOCITY_X_STEP = 10;
		this.playerJumped = false;
		this.hasDoubleJump = true;
		this.GRAVITY_Y_NORMAL = 600;
		this.maxJumpTime = 300;

		this.playerStartPosition = { x: config.width * 0.5, y: config.height };
		this.scene = scene;

		this.sprite = this.scene.physics.add.sprite(this.playerStartPosition.x, this.playerStartPosition.y, "testanims");

		this.sprite.setCollideWorldBounds(true);
		this.sprite.body.gravity.y = this.GRAVITY_Y_NORMAL; // Set initial gravity.
		this.sprite.setOrigin(1, 1);
		this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.sprite.anims.create({
			key: "flower_girl_idle",
			frames: [{ key: "testanims", frame: "0" }],
			frameRate: 2,
			repeat: -1,
		});
		this.sprite.anims.create({
			key: "flower_girl_run",
			frames: [
				{ key: "testanims", frame: "0" },
				{ key: "testanims", frame: "1" },
			],
			frameRate: 8,
			repeat: -1,
		});
		this.sprite.anims.create({
			key: "flower_girl_jump",
			frames: [{ key: "testanims", frame: "2" }],
			repeat: -1,
		});
		this.sprite.anims.create({
			key: "flower_girl_fall",
			frames: [{ key: "testanims", frame: "3" }],
			repeat: -1,
		});
	}

	animateVerticalMovement() {
		if (!this.sprite.body.onFloor()) {
			if (this.sprite.body.velocity.y < 0) {
				// Any negative value represents a jump
				this.sprite.anims.play("flower_girl_jump", true);
			} else if (this.sprite.body.velocity.y > 0) {
				// Positive value represents falling
				this.sprite.anims.play("flower_girl_fall", true);
			}
		}
	}

	handleControls() {
		this.handleJump();
		this.animateHorizontalGroundMovement();
		this.resetDoubleJump();
		this.handleHorizontalMovement();
		this.animateVerticalMovement();
	}

	animateHorizontalGroundMovement() {
		if (this.sprite.body.onFloor() && this.scene.controlManager.isRightPressed()) {
			this.sprite.anims.play("flower_girl_run", true);
			this.sprite.setFlipX(false);
		} else if (this.sprite.body.onFloor() && this.scene.controlManager.isLeftPressed()) {
			this.sprite.setFlipX(true);
			this.sprite.anims.play("flower_girl_run", true);
		}
		if (!this.sprite.body.onFloor() && this.scene.controlManager.isRightPressed()) {
			this.sprite.setFlipX(false);
		} else if (!this.sprite.body.onFloor() && this.scene.controlManager.isLeftPressed()) {
			this.sprite.setFlipX(true);
		} else if (this.sprite.body.onFloor() && this.scene.controlManager.nothingIsPressed()) {
			this.sprite.anims.play("flower_girl_idle", true);
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
		} else if (!this.sprite.body.onFloor() && !this.scene.controlManager.nothingIsPressed() && this.sprite.body.velocity.x !== 0) {
			this.sprite.setVelocityX(0);
			if (this.sprite.body.velocity.x < 0) {
				this.sprite.body.velocity.x += 1;
			} else if (this.sprite.body.velocity.x > 0) {
				this.sprite.body.velocity.x -= 1;
			}
		} else {
			this.sprite.setVelocityX(0);
			//this.setIdleVelocityX();
		}
	}
	setIdleVelocityX() {
		if (this.sprite.body.velocity.x > 0) {
			if (this.sprite.body.velocity.x != 0) {
				this.sprite.body.velocity.x -= 20;
			}
		} else if (this.sprite.body.velocity.x < 0) {
			if (this.sprite.body.velocity.x != 0) {
				this.sprite.body.velocity.x += 20;
			}
		}
	}
	handleJump() {
		this.setJumpPhysics();
		if (this.sprite.body.onFloor() && this.scene.controlManager.jumpButtonJustPressed()) {
			this.jumpButtonHoldTime = 0; // reset jump button hold time
			// this.player.setVelocityY(-290);
			this.sprite.setVelocityY(-this.jumpVelocityX * 100);
			this.playerJumped = true;
		}
		// If the player continues to hold the jump button after starting a jump
		if (this.scene.controlManager.jumpButtonHeldDown() && this.playerJumped) {
			this.jumpButtonHoldTime += this.scene.game.loop.delta; // accumulate hold timeo
			// If still within the "extra jump" window, give the player some extra upward force
			if (this.jumpButtonHoldTime <= this.maxJumpTime && this.sprite.body.gravity.y >= -10) {
				this.sprite.body.gravity.y -= this.scene.game.loop.delta * this.reducedGravityY;
			}
		}
		// On releasing the jump button or after exceeding max jump time
		if (this.scene.controlManager.jumpButtonJustReleased() || this.jumpButtonHoldTime > this.maxJumpTime) {
			console.log("player.playerJumped:", this.playerJumped);
			// player's jump is no longer influenced by the jump button
			this.sprite.setGravityY(this.currentGravityY * 50);
		}
		// Implementing the double jump
		if (!this.sprite.body.onFloor() && this.scene.controlManager.jumpButtonJustPressed() && this.hasDoubleJump) {
			this.hasDoubleJump = false;
			this.sprite.setVelocityY(-800);
		}
	}

	setJumpPhysics() {
		const runSpeed = Math.abs(this.sprite.body.velocity.x);
		const baseJumpVelocityX = 4;
		const baseReducedGravityY = 2;
		const baseCurrentGravityY = 70;
		if (runSpeed <= 50) {
			this.jumpVelocityX = baseJumpVelocityX;
			this.reducedGravityY = baseReducedGravityY;
			this.currentGravityY = baseCurrentGravityY;
		} else {
			// Calculate increases based on the difference from the base runSpeed (100 in this case)
			const deltaSpeed = runSpeed - 100;
			this.jumpVelocityX = baseJumpVelocityX + 0.01 * deltaSpeed;
			this.reducedGravityY = baseReducedGravityY + 0.005 * deltaSpeed;
			this.currentGravityY = baseCurrentGravityY + 0.02 * deltaSpeed;
		}
	}

	resetDoubleJump() {
		if (this.sprite.body.onFloor()) {
			this.sprite.setGravityY(600);
			this.hasDoubleJump = true;
			// 	this.physics.world.gravity.y = this.defaultGravity; // make sure gravity is reset when on the floor
		}
	}
}
