import backgroundImg from '../assets/background.png';
import characterImg from '../assets/Gunner_Green_Run.png';
import characterIdleImg from '../assets/Gunner_Green_Idle.png';
import characterJumpImg from '../assets/Gunner_Green_Jump.png';
import flowerGirlSheet from '../assets/uwu.png';
import toggleButtonController from '../assets/game-controller.png';
import toggleButtonKeyboard from '../assets/keyboard.png';
import flowerJson from '../assets/uwu.json';
import { GameConfig } from '../types';
import Player from '../entities/Player'; // your new Player class
import ControlManager from '../managers/ControlManager';

export default class GameScene extends Phaser.Scene {
	player!: Player;
	config: GameConfig;
	controlManager!: ControlManager;
	allObjectsGroup!: Phaser.GameObjects.Group;

	constructor(config: GameConfig) {
		super('GameScene');
		this.config = config;
	}

	preload() {
		//	this.load.path = 'assets';
		this.load.image('toggleButtonController', toggleButtonController);
		this.load.image('toggleButtonKeyboard', toggleButtonKeyboard);
		this.load.image('background', backgroundImg);
		//this.load.spritesheet('character', characterImg, { frameWidth: 48, frameHeight: 48 });
		//this.load.spritesheet('character_idle', characterIdleImg, { frameWidth: 48, frameHeight: 48 });
		this.load.spritesheet('jump', characterJumpImg, { frameWidth: 48, frameHeight: 48 });
		this.load.atlas('testanims', flowerGirlSheet, flowerJson);
	}
	/*
	rotateAllObjects() {
		this.allObjectsGroup.getChildren().forEach(gameObject => {
			this.tweens.add({
				targets: gameObject,
				angle: 90, // Rotate by 90 degrees
				duration: 1500, // 1 second, adjust as needed
				ease: 'Power4',
			});
		});
	}
*/
	create() {
		const bgImg = this.add.image(400, 300, 'background').setOrigin(0.5, 0.5);
		const toggleBtn = this.add.sprite(8, 8, 'toggleButtonKeyboard').setInteractive().setOrigin(0, 0);

		toggleBtn.on('pointerdown', () => {
			toggleBtn.setTexture(
				`${toggleBtn.texture.key === 'toggleButtonController' ? 'toggleButtonKeyboard' : 'toggleButtonController'}`,
			);
			this.toggleControls();
		});

		this.player = new Player(this, this.config);
		this.player.sprite.setOrigin(0.5, 1);
		this.allObjectsGroup = this.add.group();
		this.allObjectsGroup.add(bgImg);
		this.allObjectsGroup.add(toggleBtn);
		this.allObjectsGroup.add(this.player.sprite);

		this.controlManager = new ControlManager(this, 'keyboard');
		this.controlManager.setMyControls();
		// this.rotateAllObjects();
	}

	update() {
		this.player.handleControls();
		if (this.player.sprite.frame.name === 'sidescrollflowergirlthing0.aseprite') {
			this.player.sprite.body.setSize(68, 68);
		} else if (this.player.sprite.frame.name === 'sidescrollflowergirlthing1.aseprite') {
			this.player.sprite.body.setSize(73, 73);
		}
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
}
