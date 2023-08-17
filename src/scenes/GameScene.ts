import backgroundImg from '../assets/background.png';
import characterImg from '../assets/Gunner_Green_Run.png';
import characterIdleImg from '../assets/Gunner_Green_Idle.png';
import characterJumpImg from '../assets/Gunner_Green_Jump.png';
import toggleButtonController from '../assets/game-controller.png';
import toggleButtonKeyboard from '../assets/keyboard.png';
import { GameConfig } from '../types';
import Player from '../entities/Player'; // your new Player class
import ControlManager from '../managers/ControlManager';

export default class GameScene extends Phaser.Scene {
	player: Player;
	config: GameConfig;
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	controlManager: ControlManager;

	constructor(config: GameConfig) {
		super('GameScene');
		this.config = config;
	}

	preload() {
		this.load.image('toggleButtonController', toggleButtonController);
		this.load.image('toggleButtonKeyboard', toggleButtonKeyboard);
		this.load.image('background', backgroundImg);
		this.load.spritesheet('character', characterImg, { frameWidth: 48, frameHeight: 48 });
		this.load.spritesheet('character_idle', characterIdleImg, { frameWidth: 48, frameHeight: 48 });
		this.load.spritesheet('jump', characterJumpImg, { frameWidth: 48, frameHeight: 48 });
	}

	create() {
		this.cursors = this.input.keyboard.createCursorKeys();
		this.createBg();
		const toggleBtn = this.add.sprite(8, 8, 'toggleButtonKeyboard').setInteractive().setOrigin(0, 0);
		toggleBtn.on('pointerdown', () => {
			toggleBtn.setTexture(
				`${toggleBtn.texture.key === 'toggleButtonController' ? 'toggleButtonKeyboard' : 'toggleButtonController'}`,
			);
			this.toggleControls();
		});
		console.log(toggleBtn.texture);
		this.player = new Player(this, this.config);
		this.controlManager = new ControlManager(this, 'keyboard');
		this.controlManager.setMyControls();
	}

	toggleControls() {
		if (this.controlManager.controls === 'keyboard') {
			if (this.input.gamepad.total > 0) {
				this.controlManager.controls = 'gamepad';
				this.controlManager.setMyControls();
				console.log('Switched to gamepad controls');
			} else {
				console.warn('No gamepad detected');
			}
		} else {
			this.controlManager.controls = 'keyboard';
			this.controlManager.setMyControls();
			console.log('Switched to keyboard controls');
		}
	}

	update() {
		this.player.handleControls();
		this.controlManager.setMyControls();
	}

	createBg() {
		this.add.image(0, 0, 'background').setOrigin(0, 0);
	}
}
