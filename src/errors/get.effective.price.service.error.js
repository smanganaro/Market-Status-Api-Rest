export class getEffectivePriceServiceError extends Error {
  constructor(message = 'Get effective price service failed') {
    super(message);
  }
}