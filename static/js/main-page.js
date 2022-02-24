import * as game from "./modules/game.js";
import {TimeLoop, getFrequencyByFps} from "./modules/time-managers.js";
import {getSquareForm} from "./modules/functions.js";

const fps = 20;
const theWorld = new game.World(new TimeLoop(getFrequencyByFps(fps)));

game.GameObject.createWrapperFor(new game.Eggplant([7, 12], getSquareForm(20)), theWorld);

const snakeHead = new game.SnakeHead([12, 12]);
new game.Snake(theWorld).initializeParts(snakeHead, game.SnakeTail, 2);

document.addEventListener('keydown', (event) => {
  if (event.code == 'KeyD' && snakeHead.direction.join() != [-1, 0].join())
    snakeHead.direction = [1, 0];
  else if (event.code == 'KeyA' && snakeHead.direction.join() != [1, 0].join())
    snakeHead.direction = [-1, 0];
  else if (event.code == 'KeyW' && snakeHead.direction.join() != [0, 1].join())
    snakeHead.direction = [0, -1];
  else if (event.code == 'KeyS' && snakeHead.direction.join() != [0, -1].join())
    snakeHead.direction = [0, 1];
});

new game.GameZone(theWorld).initializeParts(getSquareForm(20));

new game.Renderer(
  theWorld,
  [new game.CanvasManager(document.getElementById("main-surface"), [25, 25])],
  new TimeLoop(getFrequencyByFps(fps))
).time.start();

theWorld.time.start();
