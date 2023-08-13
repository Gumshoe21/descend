import backgroundImg from '../assets/background.png';
import characterImg from '../assets/character.png';

import { GameConfig } from '../types';
import Player from '../entities/Player'; // your new Player class

export default class GameScene extends Phaser.Scene {
	player!: Player;
	cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	config: GameConfig;

	constructor(config: GameConfig) {
		super('GameScene');
		this.config = config;
	}

	preload() {
		this.load.image('background', backgroundImg);
		this.load.image('character', characterImg);
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	create() {
		this.createBg();
		this.player = new Player(this, this.config);
		this.player.sprite.setCollideWorldBounds(true);
	}

	update() {
		this.player.handleControls();
	}

	createBg() {
		this.add.image(0, 0, 'background').setOrigin(0, 0);
	}
}
