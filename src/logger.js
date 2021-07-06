import { v4 as uuidv4 } from 'uuid';

class Logger {
  constructor() {
    this.id = uuidv4();
  }

  log(message) {
    console.log(new Date(Date.now()), this.id, message);
  }
}

export default Logger;
