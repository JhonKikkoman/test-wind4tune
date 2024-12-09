/** @format */

import { Game as MainGame } from './scenes/Game';
import { EndGame } from './scenes/EndGame';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from 'phaser';

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#028af8',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: { debug: true },
  },
  scene: [Preloader, MainMenu, MainGame, EndGame],
};

export default new Game(config);
