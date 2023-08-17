export interface GameConfig extends Phaser.Types.Core.GameConfig {
	width: number;
	height: number;
	playerStartPosition: { x: number; y: number };
}

export type SceneCreator<T extends Phaser.Scene> = (Scene: new (...args: any[]) => T, config: any) => T;
