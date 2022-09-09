export class clientFailedToConnectError extends Error {
  constructor(message = 'Client was not able to connect') {
    super(message);
  }
}