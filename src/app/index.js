import Phaser from 'phaser'
import createDOMWrapper from './helpers/createDOMWrapper'
import createStyleWrapper from './helpers/createStyleWrapper'

export default {
  state: {
    platforms: null,
    player: null,
    stars: null,
    cursors: null,
    score: 0,
    scoreText: null
  },
  init (className) {
    const $state = this.state

    const parent = createDOMWrapper(className)
    const styles = createStyleWrapper(`
      .${className} {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 100vh;
        background: #000000;
      }
    `)
    parent.prepend(styles)

    $state.config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: '#2d2d2d',
      parent,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: {
        preload () {
          this.load.image('sky', 'assets/sky.png')
          this.load.image('ground', 'assets/platform.png')
          this.load.image('star', 'assets/star.png')
          this.load.image('bomb', 'assets/bomb.png')
          this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
          )
        },
        create () {
          this.add.image(400, 300, 'sky')

          $state.platforms = this.physics.add.staticGroup()

          $state.platforms.create(400, 568, 'ground').setScale(2).refreshBody()

          $state.platforms.create(600, 400, 'ground')
          $state.platforms.create(50, 250, 'ground')
          $state.platforms.create(750, 220, 'ground')

          $state.player = this.physics.add.sprite(100, 450, 'dude')

          $state.player.setBounce(0.2)
          $state.player.setCollideWorldBounds(true)
          $state.player.body.setGravityY(50)

          this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
          })

          this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
          })

          this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
          })

          $state.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
          })

          $state.stars.children.iterate(child => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
          })

          $state.scoreText = this.add.text(16, 16, `Score: ${$state.score}`, { fontSize: '32px', fill: '#000' })

          function collectStar (player, star) {
            star.disableBody(true, true)

            $state.score += 10
            $state.scoreText.setText('Score: ' + $state.score)

            if ($state.stars.countActive(true) === 0) {
              $state.stars.children.iterate((child) => {
                child.enableBody(true, child.x, 0, true, true)
              })

              const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

              const bomb = $state.bombs.create(x, 16, 'bomb')

              bomb.setBounce(1)
              bomb.setCollideWorldBounds(true)
              bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
            }
          }
          function hitBomb (player, bomb) {
            this.physics.pause()

            player.setTint(0xff0000)
            player.anims.play('turn')
          }

          $state.bombs = this.physics.add.group()

          this.physics.add.collider($state.stars, $state.platforms)
          this.physics.add.collider($state.player, $state.platforms)
          this.physics.add.collider($state.bombs, $state.platforms)
          this.physics.add.collider($state.player, $state.bombs, hitBomb, null, this)
          this.physics.add.overlap($state.player, $state.stars, collectStar, null, this)
        },
        update () {
          $state.cursors = this.input.keyboard.createCursorKeys()

          if ($state.cursors.left.isDown) {
            $state.player.setVelocityX(-160)

            $state.player.anims.play('left', true)
          } else if ($state.cursors.right.isDown) {
            $state.player.setVelocityX(160)

            $state.player.anims.play('right', true)
          } else {
            $state.player.setVelocityX(0)

            $state.player.anims.play('turn')
          }

          if ($state.cursors.space.isDown && $state.player.body.touching.down) {
            $state.player.setVelocityY(-330)
          }
        }
      }
    }

    return new Phaser.Game($state.config)
  }
}
