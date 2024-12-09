/** @format */

import { Scene, GameObjects } from 'phaser';

export class EndGame extends Scene {
  lastScene: GameObjects.Image;
  healthGap: GameObjects.Image[];
  btnNewGame: GameObjects.Image;
  btnRestart: GameObjects.Image;
  rock: GameObjects.Image;
  tipsText: GameObjects.Text;
  countDownSurvival: GameObjects.Text;
  activePlayer: any;
  keys: any;
  spawnTimer: Phaser.Time.TimerEvent;
  constructor() {
    super('EndGame');
  }

  preload() {
    this.load.image('last-scene', '../src/assets/images/cave.png');
    this.load.image('health', '../src/assets/images/health.png');

    this.load.image('rock', '../src/assets/images/rock.png');
    this.load.image('new-game', '../src/assets/images/btn-new-game.jpg');
    this.load.image('restart', '../src/assets/images/btn-restart.jpg');
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
    const { width, height } = this.scale;
    const selectedCharacter = this.registry.get('selectedCharacter');
    this.healthGap = [];

    this.lastScene = this.add.image(0, 0, 'last-scene').setOrigin(0);
    this.lastScene.setY(this.lastScene.y - 150);

    this.matter.add.rectangle(width / 2, height - 5, width, 5, {
      isStatic: true,
      label: 'ground',
    });

    this.matter.world.on('collisionstart', (event: any) => {
      event.pairs.forEach((pair: any) => {
        const { bodyA, bodyB } = pair;
        const labels = [bodyA.label, bodyB.label];

        if (labels.includes('player') && labels.includes('fallingRock')) {
          const otherBody = bodyA.label === 'player' ? bodyB : bodyA;

          this.checkHealth();
          this.matter.world.remove(otherBody);
          otherBody.gameObject?.destroy();
        }

        if (bodyA.label === 'fallingRock' && bodyB.label === 'fallingRock') {
          const otherBody = bodyB || bodyA;
          this.matter.world.remove(bodyA);
          this.matter.world.remove(bodyB);
          otherBody.gameObject?.destroy();
        }

        if (labels.includes('ground') && labels.includes('fallingRock')) {
          const otherBody = bodyA.label === 'ground' ? bodyB : bodyA;

          this.matter.world.remove(otherBody);
          otherBody.gameObject?.destroy();
        }
      });
    });

    this.btnNewGame = this.add
      .image(width - width / 2, height - 70 - height / 2, 'new-game')
      .setInteractive()
      .setVisible(false);

    // this.btnNewGame.once('pointerdown', () => {
    //   this.newGame();
    // });

    this.btnRestart = this.add
      .image(65, 25, 'restart')
      .setInteractive()
      .setScale(0.5);

    this.btnRestart.once('pointerdown', () => {
      this.restart();
    });

    this.healthGap.push(
      this.add.image(10, 10, 'health').setOrigin(0).setScale(0.4)
    );
    this.healthGap.push(
      this.add.image(10, 50, 'health').setOrigin(0).setScale(0.3)
    );
    this.healthGap.push(
      this.add.image(10, 90, 'health').setOrigin(0).setScale(0.2)
    );

    this.matter.world.setBounds(0, 0, width, height - 5);

    if (selectedCharacter === 1) {
      this.activePlayer = this.matter.add.sprite(
        width - width / 2,
        height - 10,
        'active-player-1',
        12,
        { shape: { height: 300, width: 200 }, label: 'player' }
      );
      this.activePlayer.setScale(0.3);
    }

    if (selectedCharacter === 2) {
      this.activePlayer = this.matter.add.sprite(
        width - width / 2,
        height - 10,
        'active-player-2',
        12,
        { shape: { height: 55, width: 45 }, label: 'player' }
      );
      this.activePlayer.setScale(1.6);
    }

    if (!this.anims.exists('walk-left')) {
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
    }

    if (!this.anims.exists('walk-right')) {
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
    }

    this.keys = this.input.keyboard?.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    let counter = 5;

    this.tipsText = this.add
      .text(width - width / 2, height - height / 2, `Start : ${counter}`, {
        fontFamily: 'Arial Black',
        fontSize: 45,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        counter -= 1;
        this.tipsText.setText(`Start : ${counter}`);
        if (counter === 0) {
          this.tipsText.setVisible(false);
          this.start();
        }
      },
      repeat: 4,
    });
  }

  update() {
    const speed = 4;

    if (this.keys?.left.isDown) {
      this.activePlayer.x -= speed;
      this.activePlayer.play('walk-left', true);
    }
    if (this.keys?.right.isDown) {
      this.activePlayer.x += speed;
      this.activePlayer.play('walk-right', true);
    }

    if (!this.healthGap.length) {
      this.tipsText.setText('You lose!');
      this.tipsText.setVisible(true);
      this.tweens.pauseAll();
      this.time.paused = true;
      this.input.enabled = true;
    }
  }

  start() {
    let counter = 60;

    this.countDownSurvival = this.add
      .text(945, 13, `Survive : ${counter}`, {
        fontFamily: 'Arial Black',
        fontSize: 18,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        counter -= 1;
        this.countDownSurvival.setText(`Survive : ${counter}`);
        if (counter === 0) {
          this.countDownSurvival.setVisible(false);
          if (counter === 0 && this.healthGap.length !== 0) {
            this.tipsText.setText(`You win! Congrats`);
            this.tipsText.setVisible(true);
            this.btnNewGame.setVisible(true);
            this.spawnTimer.remove();
          }
        }
      },
      repeat: 59,
    });

    this.spawnTimer = this.time.addEvent({
      delay: 500,
      callback: this.spawnRocks,
      callbackScope: this,
      loop: true,
    });

    this.time.delayedCall(counter * 1000, () => {
      this.spawnTimer.remove();
    });
  }

  newGame() {
    this.activePlayer = undefined;
    this.registry.destroy();

    this.scene.stop('EndGame');
    this.scene.restart();
    this.scene.start('MainMenu');
  }

  restart() {
    this.scene.restart();
    this.tweens.resumeAll();
    this.time.paused = false;
  }

  spawnRocks() {
    const x = Phaser.Math.Between(100, this.scale.width - 100);
    const randomSpeed = Phaser.Math.FloatBetween(1, 9);

    this.matter.add
      .image(x, 40, 'rock', undefined, {
        restitution: 0,
        friction: 0,
        frictionAir: 0,

        label: 'fallingRock',
        circleRadius: 47,
      })
      .setScale(0.7)
      .setVelocityY(randomSpeed);
  }

  checkHealth() {
    if (this.healthGap.length > 0) {
      const health = this.healthGap.pop();
      health?.destroy();
    }
  }
}
