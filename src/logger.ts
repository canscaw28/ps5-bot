import { v4 as uuidv4 } from 'uuid';
import { Retailers } from './defaults';

class Logger {
  id: string;

  retailer?: Retailers;

  constructor(retailer?: Retailers) {
    this.id = uuidv4();
    this.retailer = retailer;
  }

  log(message: string): void {
    console.log(new Date(Date.now()), this.id, this.retailer, message);
  }
}

export default Logger;
