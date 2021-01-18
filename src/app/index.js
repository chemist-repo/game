import Phaser from 'phaser'

export function start () {
  function preload () {}
  function create () {}
  function update () {}
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
      preload,
      create,
      update
    }
  }
  const game = new Phaser.Game(config)
  console.log({ game })
}
