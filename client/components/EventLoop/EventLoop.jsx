const TICK_TIME = 20; // ms / tick

class EventLoopManager {
  constructor(ee) {
    this.intervalId = null;
    this.currentTick = 0;
    this.handlers = {};
    this.isPaused = false;
    this.elapsedTime = 0;
    this.ee = ee;
  }
  
  addHandler(handlerName, handler) {
    this.handlers[handlerName] = handler;
  }
  
  clearHandler(handlerName) {
    delete this.handlers[handlerName];
  }

  setPixelsPerSec(pps) {
    this.pps = pps;
  }

  setStartTime(time) {
    console.log('set start time', time);
    this.startTime = time;
  }
  
  startLoop(audioCtx) {
    if (audioCtx) {
      this.audioCtx = audioCtx;
    }

    if (this.intervalId) {
      console.warn('Event loop is already running');
      return;
    }
    
    // console.debug(`Event loop starting at tick ${this.currentTick}`);
    this.intervalId = setInterval(() => this.doTick(), TICK_TIME);  
  }
  
  doTick() {
    this.currentTick++;
    this.ee.emit('setSeeker', (this.startTime + this.audioCtx.currentTime) * this.pps);
    // console.log(this.audioCtx.currentTime + this.startTime);
    // console.debug(`Event tick ${this.currentTick}:`);
    
    for (let handler in this.handlers) {
      if (this.handlers.hasOwnProperty(handler)) {
        console.debug(`    ${handler}()`);
        this.handlers[handler]();   
      }
    }
  }
  
  pauseLoop() {
    console.debug(`Event loop paused at tick ${this.currentTick}`);
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isPaused = true; 
  }
 
  stopLoop() {
    console.debug(`Event loop stopped after ${this.currentTick} ticks`);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }  
    this.currentTick = 0;
  }
}


export default EventLoopManager;