export class TimeLoop {
  #interval;
  #oscillationMade = 0;
  #stops = 0;
  #stopThrough;

  constructor(tact, action=() => {}, stopThrough=-1, actionWhenStopping=() => {}) {
    this.tact = tact;
    this.action = action;
    this.actionWhenStopping = actionWhenStopping;

    this.#stopThrough = {
      real: stopThrough,
      max: stopThrough,
    }
  }

  start() {
    let that = this;
    this.#interval = setInterval(() => {that.oscillation()}, this.tact);
  }

  stop() {
    this.#stopThrough.real = this.#stopThrough.max;
    this.#stops++;

    this.actionWhenStopping();

    clearInterval(this.#interval);
    this.#interval = undefined;
  }

  oscillation() {
    this.#stopThrough.real--;
    this.#oscillationMade++;

    this.action();

    if (this.#stopThrough.real == 0)
      this.stop();
  }

  isActive() {
    return this.#interval != undefined;
  }

  get oscillationMade() {
    return this.#oscillationMade;
  }

  get timeStops() {
    return this.#stops;
  }

  set stopThrough(value) {
    this.#stopThrough.max = value;
    this.#stopThrough.real = value;
  }
}

export function getFrequencyByFps(fps) {
  return Math.floor(1000 / fps);
}
