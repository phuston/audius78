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
  
  subscribe(ev, callback) {
  	if (this.handlers[ev]) {
  		this.handlers[ev].push(callback);
	} else {
		this.handlers[ev] = [callback];
	}
  }
  
  clearSubscribers(ev) {
    delete this.handlers[ev];
  }

  setPixelsPerSec(pps) {
    this.pps = pps;
  }

  setStartTime(time) {
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
    // console.debug(`Event tick ${this.currentTick}:`);
    
    for (let ev in this.handlers) {
      if (this.handlers.hasOwnProperty(ev)) {
        console.debug(`    ${ev}()`);
        for (let i in this.handlers[ev]) {
        	this.handlers[ev][i](); 
        }
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
