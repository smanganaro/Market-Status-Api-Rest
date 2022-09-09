export class getOrderbookTipServiceError extends Error {
  constructor(message = 'Get orderbook tip service failed') {
    super(message);
  }
}