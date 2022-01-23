import {Space} from "./modules/multidimensional-pseudo-arrays.js";
import {HtmlSurface} from "./modules/html-managers.js";
import {TimeLoop} from "./modules/time-managers.js";


class HtmlWindow extends HtmlSurface {
  constructor(className, dom, blockSurfaceClass, blockClassName) {
    super(className, dom);
    this.allocateBlocks(blockSurfaceClass, blockClassName);
  }

  renderPoint(point, color) {
    this.blocks.getFrom(point).color = color;
  }

  paintOver(color) {
    this.blocks.map(item => {item.color = color; return item});
  }

  allocateBlocks(blockSurfaceClass, blockClassName) {
    let testBlocks = new blockSurfaceClass(blockClassName, this.htmlObject);
    let blockSize = testBlocks.size;
    this.clearHtmlChildren();

    this.blocks = new Space([this.size[0]/blockSize[0], this.size[1]/blockSize[1]]);

    this.blocks.map(_ => new blockSurfaceClass(blockClassName, this.htmlObject));
  }
}


class Game {
  #time;

  constructor(surface, timeLoop, objects) {
    this.surface = surface;
    this.time = timeLoop;
    this.objects = objects;
  }

  set time(timeLoop) {
    this.#time = timeLoop;
    this.time.stop();
    let that = this;
    this.time.action = () => {that.process()};
  }

  get time() {
    return this.#time;
  }

  process() {
    this.reactionTo(this.processingObjects());
    this.render();
  }

  reactionTo(processes) {
    for (let i = 0; i < processes.length; i++) {
      if (processes[i] === undefined) {}

      else if ("break" === processes[i]) {
        this.time.stop();
      }
    }
  }

  processingObjects() {
    let resultsOfProcesses = [];
    let result;

    for (let i = 0; i < this.objects.length; i++) {
      result = this.objects[i].process();
      resultsOfProcesses.push(result);
    }

    return resultsOfProcesses;
  }

  render() {
    this.surface.paintOver([255, 255, 255]); // test
    for (let i = 0; i < this.objects.length; i++) {
      this.surface.renderPoint(this.objects[i].point, this.objects[i].color);
    }
  }
}


class GameObject {
  static everything = [];

  constructor(point, color) {
    GameObject.everything.push(this);

    this.point = point;
    this.color = color;

    this.isAlive = true;
  }

  process() {
    this.reactionToWorld(GameObject.everything);
    this.internalProcesses();
  }

  internalProcesses() {}

  die() {
    this.isAlive = false;
    GameObject.everything.splice(GameObject.everything.findIndex(this), 1);
  }

  reactionToWorld(world) {
    for (let i = 0; i < world.length; i++) {
      if (this != world[i])
        this.reactionToObject(world[i]);
    }
  }

  reactionToObject(object) {}
}


class SnakeHead extends GameObject {
  reactionToObject(object) {
    if (object.point == this.point) {
      this.die(); // test
    }
  }
}


class SnakeTail extends GameObject {}


new SnakeHead([12, 12], [30, 255, 30]);

new Game (
  new HtmlWindow("game-window", document.getElementsByTagName("main")[0], HtmlSurface, "game-cell"),
  new TimeLoop(1000),
  GameObject.everything
).time.start();
