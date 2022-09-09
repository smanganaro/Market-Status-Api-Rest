export class Queue {

  constructor() {
    this.list = [];
  }

  isEmpty = () => this.list.length !== 0;

  enqueue = (el) => {
    this.list.push(el);
  }
  
  dequeue = () => this.isEmpty() ? this.list.shift() : undefined;
}