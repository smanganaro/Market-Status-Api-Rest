export class clientFailedToSubscribeError extends Error {
  constructor(message = 'Client failed to subscribe to channel') {
    super(message);
  }
}