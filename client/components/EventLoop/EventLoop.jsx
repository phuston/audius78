const TICK_TIME = 50; // 50 ms / tick

class EventLoopManager {
  constructor(props) {
    this.intervalId = null;
    this.currentTick = 0;
    this.handlers = {};
    this.isPaused = false;
  }
  
  addHandler(handlerName, handler) {
    this.handlers[handlerName] = handler;
  }
  
  startLoop() {
    if (this.intervalId) {
      console.warn('Event loop is already running');
      return;
    }
    
    console.debug(`Event loop starting at tick ${this.currentTick}`);
    this.intervalId = setInterval(() => this.doTick(), TICK_TIME);  
  }
  
  doTick() {
    this.currentTick++;
    console.debug(`Event tick ${this.currentTick}:`);
    
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