export class TimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message);
  }
}