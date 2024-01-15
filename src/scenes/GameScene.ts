// Background
import backgroundImg from "../assets/background.png";
// Toggle
import toggleButtonController from "../assets/game-controller.png";
import toggleButtonKeyboard from "../assets/keyboard.png";
// Player
import playerJson from "../assets/player.json";
import playerPng from "../assets/player.png";
// Platforming map
import pmJson from "../assets/platforming-map.json";
import pmPng from "../assets/platforming-map.png";

import { GameConfig } from "../types";
import Player from "../entities/Player";
import ControlManager from "../managers/ControlManager";

export default class GameScene extends Phaser.Scene {
	player!: Player;
	config: GameConfig;
	controlManager!: ControlManager;
	allObjectsGroup!: Phaser.GameObjects.Group;
	atlas: JSON;

	constructor(config: GameConfig) {
		super("GameScene");
		this.config = config;
	}

	preload() {
		this.load.image("platforming-map", pmPng);
		this.load.tilemapTiledJSON("tilemap", pmJson);
		this.load.image("toggleButtonController", toggleButtonController);
		this.load.image("toggleButtonKeyboard", toggleButtonKeyboard);
		this.load.image("background", backgroundImg);
		this.load.aseprite("testanims", playerPng, playerJson);
	}

	create() {
		const [toggleButton, backgroundImage] = [this.configToggleButton(), this.configBackgroundImage()];
		this.configControls();
		this.configPlayer();
		this.configObjectsGroup(backgroundImage, toggleButton);
		this.configMap();
		this.configCamera(backgroundImage);
	}

	update() {
		this.player.handleControls();
		this.handleUpdatePlayerSprite();
	}

	configObjectsGroup(bgImg: Phaser.GameObjects.Image, toggleBtn: Phaser.GameObjects.Sprite) {
		this.allObjectsGroup = this.add.group();
		this.allObjectsGroup.add(bgImg);
		this.allObjectsGroup.add(toggleBtn);
		this.allObjectsGroup.add(this.player.sprite);
	}

	configMap() {
		const myMap = this.add.image(800, 600, "platforming-map").setScale(2);
		const map = this.make.tilemap({ key: "tilemap", tileWidth: 8, tileHeight: 8 });
		const tileset = map.addTilesetImage("s4m_ur4i_huge-assetpack-tilemap", "platforming-map");
		const groundLayer = map.createLayer(0, tileset);
		groundLayer.setCollisionBetween(412, 495, true);
		this.physics.add.collider(this.player.sprite, groundLayer);
	}
	configControls() {
		this.controlManager = new ControlManager(this, "keyboard");
		this.controlManager.setMyControls();
	}

	configToggleButton() {
		const toggleBtn = this.add.sprite(8, 8, "toggleButtonKeyboard").setInteractive().setOrigin(0, 0);
		toggleBtn.on("pointerdown", () => {
			toggleBtn.setTexture(`${toggleBtn.texture.key === "toggleButtonController" ? "toggleButtonKeyboard" : "toggleButtonController"}`);
			this.toggleControls();
		});
		return toggleBtn;
	}
	configBackgroundImage() {
		const backgroundImage = this.add.image(800, 600, "background");
		return backgroundImage;
	}
	configPlayer() {
		this.player = new Player(this, this.config);
		this.player.sprite.setOrigin(0, 0);
	}
	configCamera(backgroundImage: Phaser.GameObjects.Image) {
		this.cameras.main.setSize(backgroundImage.displayWidth, backgroundImage.displayHeight);
		this.cameras.main.startFollow(this.player.sprite);

		this.physics.world.bounds.width = 1600;
		this.physics.world.bounds.height = 1200;

		this.cameras.main.setBounds(0, 0, 1600, 1200);
	}

	handleUpdatePlayerSprite() {
		const flipOffsets = {
			"0": { x: 15, y: 43 },
			"1": { x: 12, y: 40 },
			"2": { x: 15, y: 43 },
			"3": { x: 12, y: 40 },
		};
		const offsets = {
			"0": { x: 0, y: 43 },
			"1": { x: 0, y: 40 },
			"2": { x: 0, y: 43 },
			"3": { x: 0, y: 40 },
		};
		const sizes = {
			"0": { x: 70, y: 70 },
			"1": { x: 73, y: 73 },
			"2": { x: 70, y: 70 },
			"3": { x: 73, y: 73 },
		};
		for (let i = 0; i < playerJson.frames.length; i++) {
			if (this.player.sprite.frame.name === playerJson.frames[i].filename) {
				this.player.sprite.setSize(sizes[i].x, sizes[i].y);
				if (this.player.sprite.flipX) {
					this.player.sprite.setOffset(flipOffsets[i].x, flipOffsets[i].y);
				} else {
					this.player.sprite.setOffset(offsets[i].x, offsets[i].y);
				}
			}
		}
	}
	toggleControls() {
		if (this.controlManager.controls === "keyboard") {
			if (this.input.gamepad.total > 0) {
				this.controlManager.controls = "gamepad";
				this.controlManager.setMyControls();
				console.log("Switched to gamepad controls");
			} else {
				console.warn("No gamepad detected");
			}
		} else {
			this.controlManager.controls = "keyboard";
			this.controlManager.setMyControls();
			console.log("Switched to keyboard controls");
		}
	}
}
