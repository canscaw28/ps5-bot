import { v4 as uuidv4 } from 'uuid';

class Logger {
  id: string;

  constructor() {
    this.id = uuidv4();
  }

  log(message: string): void {
    console.log(new Date(Date.now()), this.id, message);
  }
}

export default Logger;
