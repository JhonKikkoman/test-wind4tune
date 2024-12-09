/** @format */

import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
  background: GameObjects.Image;
  startScene: GameObjects.Image;
  playerOne: GameObjects.Image;
  playerTwo: GameObjects.Image;
  title: GameObjects.Text;
  countDownText: GameObjects.Text;
  btnStart: GameObjects.Image;
  isFirst: boolean;
  isSecond: boolean;
  counter: number;

  constructor() {
    super('MainMenu');
  }

  create() {
    this.background = this.add.image(512, 384, 'background');
    this.startScene = this.add.image(512, 300, 'start-scene');

    this.btnStart = this.add.image(510, 300, 'btn-start').setInteractive();
    this.btnStart.setDisplaySize(150, 50);

    this.playerOne = this.add.image(412, 550, 'player-1').setInteractive();
    this.playerOne.setDisplaySize(100, 100);

    this.playerTwo = this.add.image(612, 550, 'player-2').setInteractive();
    this.playerTwo.setDisplaySize(80, 80);

    const borderPlayerOne = this.add.graphics();
    const borderPlayerTwo = this.add.graphics();
    borderPlayerOne.lineStyle(3, 0xff0000, 1);
    borderPlayerOne.strokeRect(
      this.playerOne.x - this.playerOne.width / 4.5,
      this.playerOne.y - this.playerOne.height / 5,
      85,
      110
    );
    borderPlayerTwo.lineStyle(3, 0xff0000, 1);
    borderPlayerTwo.strokeRect(
      this.playerTwo.x - this.playerTwo.width * 1.2,
      this.playerTwo.y - this.playerTwo.height / 1.1,
      this.playerTwo.width + 50,
      this.playerTwo.height + 40
    );
    borderPlayerTwo.visible = false;
    borderPlayerOne.visible = false;

    this.title = this.add
      .text(512, 460, 'Choose your character...', {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5);

    this.counter = 3;
    this.countDownText = this.add
      .text(512, 360, `Start game...`, {
        fontFamily: 'Arial Black',
        fontSize: 45,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5);

    this.playerOne.on('pointerdown', () => {
      this.isFirst = true;
      borderPlayerOne.visible = true;
      this.registry.set('selectedCharacter', 1);

      if (borderPlayerTwo.visible) {
        this.isSecond = false;
        borderPlayerTwo.visible = !borderPlayerTwo.visible;
      }
    });

    this.playerTwo.on('pointerdown', () => {
      this.isSecond = true;
      borderPlayerTwo.visible = true;
      this.registry.set('selectedCharacter', 2);
      if (borderPlayerOne.visible) {
        this.isFirst = false;
        borderPlayerOne.visible = !borderPlayerOne.visible;
      }
    });

    this.btnStart.once('pointerdown', () => {
      if (this.isFirst || this.isSecond) {
        this.time.delayedCall(this.counter * 1000, () => {
          this.isFirst = false;
          this.isSecond = false;
          this.scene.restart();
          this.scene.start('Game');
        });
        this.countDownToStart();
      }
    });
  }

  countDownToStart() {
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.counter -= 1;
        this.countDownText.setText(`Переход через: ${this.counter}`);
      },
      repeat: 2,
    });
  }

  update() {}
}
