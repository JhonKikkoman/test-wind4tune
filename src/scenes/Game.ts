/** @format */

import { Scene } from 'phaser';

export class Game extends Scene {
  activePlayer: any;
  keys: any;
  sing: any;
  message: Phaser.GameObjects.Text;
  isNextStage: boolean;
  constructor() {
    super('Game');
  }

  preload() {
    this.load.image('second-scene', '../src/assets/images/scene-2.jpg');
    this.load.image('stone-sign', '../src/assets/images/danger-stone.png');
    this.load.spritesheet(
      'active-player-1',
      '../src/assets/images/player1.png',
      {
        frameWidth: 300,
        frameHeight: 310,
        margin: 1,
        spacing: 20,
      }
    );
    this.load.spritesheet(
      'active-player-2',
      '../src/assets/images/player2.png',
      { frameWidth: 60, frameHeight: 60, margin: 1, spacing: 4 }
    );
  }

  create() {
    const selectedCharacter = this.registry.get('selectedCharacter');

    this.add.image(0, 0, 'second-scene').setOrigin(0).setScale(2.6, 2);

    this.matter.world.setBounds(0, 0, 2000, 2000);
    this.matter.world.disableGravity();

    this.sing = this.matter.add.sprite(250, 120, 'stone-sign', undefined, {
      isStatic: true,
    });

    this.message = this.add
      .text(180, 100, '', {
        font: '16px Arial',
      })
      .setOrigin(0.5)
      .setVisible(false);

    if (selectedCharacter === 1) {
      this.activePlayer = this.matter.add.sprite(1500, 480, 'active-player-1');
      this.activePlayer.setScale(0.3);
      this.activePlayer.setFrame(12);
    } else if (selectedCharacter === 2) {
      this.activePlayer = this.matter.add.sprite(1500, 480, 'active-player-2');
      this.activePlayer.setScale(1.6);
      this.activePlayer.setFrame(12);
    }

    this.matter.world.on('collisionstart', (event: any) => {
      event.pairs.forEach((pair: any) => {
        const { bodyA, bodyB } = pair;
        const { gameObject: activePlayer } = bodyA;
        const { gameObject: sing } = bodyB;
        if (
          (activePlayer === this.activePlayer && sing === this.sing) ||
          (activePlayer === this.sing && sing === this.activePlayer)
        ) {
          this.isNextStage = true;
          this.showMessage();
        }
      });
    });

    this.matter.world.on('collisionend', (event: any) => {
      event.pairs.forEach((pair: any) => {
        const { bodyA, bodyB } = pair;
        const { gameObject: activePlayer } = bodyA;
        const { gameObject: sing } = bodyB;
        if (
          (activePlayer === this.activePlayer && sing === this.sing) ||
          (activePlayer === this.sing && sing === this.activePlayer)
        ) {
          this.isNextStage = false;
          this.hideMessage();
        }
      });
    });

    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers(
        selectedCharacter === 1 ? 'active-player-1' : 'active-player-2',
        {
          frames: [0, 1, 2, 3],
        }
      ),
      frameRate: 12,
    });

    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers(
        selectedCharacter === 1 ? 'active-player-1' : 'active-player-2',
        {
          frames: [4, 5, 6, 7],
        }
      ),
      frameRate: 12,
    });

    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers(
        selectedCharacter === 1 ? 'active-player-1' : 'active-player-2',
        {
          frames: [12, 13, 14, 15],
        }
      ),
      frameRate: 12,
    });

    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers(
        selectedCharacter === 1 ? 'active-player-1' : 'active-player-2',
        {
          frames: [8, 9, 10, 11],
        }
      ),
      frameRate: 12,
    });

    this.cameras.main.startFollow(this.activePlayer);

    this.cameras.main.followOffset = new Phaser.Math.Vector2(0, 0);
    this.cameras.main.setBounds(0, 0, 2000, 2000);
    this.cameras.main.setLerp(0.1, 0.1);
    this.keys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      next: Phaser.Input.Keyboard.KeyCodes.X,
    });
  }

  update() {
    const speed = 5;

    if (this.keys?.down.isDown) {
      this.activePlayer.y += speed;
      this.activePlayer.play('walk-down', true);
    }
    if (this.keys?.up.isDown) {
      this.activePlayer.y -= speed;
      this.activePlayer.play('walk-up', true);
    }

    if (this.keys?.left.isDown) {
      this.activePlayer.x -= speed;
      this.activePlayer.play('walk-left', true);
    }
    if (this.keys?.right.isDown) {
      this.activePlayer.x += speed;
      this.activePlayer.play('walk-right', true);
    }

    if (this.isNextStage && this.keys?.next.isDown) {
      this.onNextStage();
    }

    this.message.setPosition(this.activePlayer.x, this.activePlayer.y - 70);
  }

  showMessage() {
    this.message.setText('Press X to next stage');
    this.message.setVisible(true);
  }

  hideMessage() {
    this.message.setText('');
    this.message.setVisible(false);
  }

  onNextStage() {
    this.scene.start('EndGame');
  }
}
