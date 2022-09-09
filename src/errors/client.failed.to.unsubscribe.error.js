export class clientFailedToUnsubscribeError extends Error {
  constructor(message = 'Client failed to unsubscribe to channel') {
    super(message);
  }
}