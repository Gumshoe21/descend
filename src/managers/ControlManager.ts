export default class ControlManager {
	scene: Phaser.Scene;
	controls: 'keyboard' | 'gamepad';
	cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	gamepad!: Phaser.Input.Gamepad.Gamepad;
	prevButtonJumpState: boolean;
	constructor(scene: Phaser.Scene, controls: 'keyboard' | 'gamepad') {
		this.scene = scene;
		this.controls = controls;
		this.prevButtonJumpState = false;
	}

	setMyControls() {
		if (this.controls === 'keyboard') {
			this.cursors = this.scene.input.keyboard.createCursorKeys();
		} else if (this.controls === 'gamepad') {
			if (this.scene.input.gamepad && this.scene.input.gamepad.pad1) {
				this.gamepad = this.scene.input.gamepad.pad1;
			} else {
				this.cursors = this.scene.input.keyboard.createCursorKeys();
				this.controls = 'keyboard';
				console.warn('Gamepad selected but not detected. Default to keyboard controls.');
			}
		}
	}
	gamepadJumpButtonJustPressed(): boolean {
		const currentJumpButtonState = this.gamepad.buttons[0].pressed;
		const justPressed = !this.prevButtonJumpState && currentJumpButtonState;
		this.prevButtonJumpState = currentJumpButtonState;
		return justPressed;
	}
	gamepadJumpButtonJustReleased(): boolean {
		const currentJumpButtonState = this.gamepad.buttons[0].pressed;
		const justReleased = this.prevButtonJumpState && !currentJumpButtonState;
		this.prevButtonJumpState = currentJumpButtonState;
		return justReleased;
	}

	isLeftPressed(): boolean {
		if (this.controls === 'keyboard') {
			return this.cursors.left.isDown && !this.cursors.right.isDown;
		} else if (this.controls === 'gamepad' && this.gamepad && this.gamepad.leftStick) {
			return this.gamepad.leftStick.x < 0;
		}
		return false;
	}

	isRightPressed(): boolean {
		if (this.controls === 'keyboard') {
			return this.cursors.right.isDown && !this.cursors.left.isDown;
		} else if (this.controls === 'gamepad' && this.gamepad && this.gamepad.leftStick) {
			return this.gamepad.leftStick.x === 2;
		}
		return false;
	}

	nothingIsPressed(): boolean {
		if (this.controls === 'keyboard') {
			return !this.cursors.left.isDown && !this.cursors.right.isDown;
		} else if (this.controls === 'gamepad' && this.gamepad && this.gamepad.leftStick) {
			return this.gamepad.leftStick.x === 0;
		}
		return false;
	}

	jumpButtonJustPressed(): boolean {
		if (this.controls === 'keyboard') {
			return Phaser.Input.Keyboard.JustDown(this.cursors.up);
		} else if (this.controls === 'gamepad') {
			return this.gamepadJumpButtonJustPressed();
		}
		return false;
	}
	jumpButtonJustReleased(): boolean {
		if (this.controls === 'keyboard') {
			return Phaser.Input.Keyboard.JustUp(this.cursors.up);
		} else if (this.controls === 'gamepad') {
			return this.gamepadJumpButtonJustReleased();
		}
		return false;
	}

	jumpButtonHeldDown(): boolean {
		if (this.controls === 'keyboard') {
			return this.cursors.up.isDown;
		}
		return false;
	}

	// Similar methods for other controls (right, up, down, action buttons, etc.)
}
