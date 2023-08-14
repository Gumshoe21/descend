import backgroundImg from '../assets/background.png';
import characterImg from '../assets/Gunner_Green_Run.png';
import characterIdleImg from '../assets/Gunner_Green_Idle.png';
import characterJumpImg from '../assets/Gunner_Green_Jump.png';
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
		this.load.spritesheet('character', characterImg, { frameWidth: 48, frameHeight: 48 });
		this.load.spritesheet('character_idle', characterIdleImg, { frameWidth: 48, frameHeight: 48 });
		this.load.spritesheet('jump', characterJumpImg, { frameWidth: 48, frameHeight: 48 });
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
