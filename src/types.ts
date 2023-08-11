export interface GameConfig extends Phaser.Types.Core.GameConfig {
	width: number;
	height: number;
	characterStartPosition: { x: number; y: number };
}
