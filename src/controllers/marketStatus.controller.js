import { calculateEffectivePrice as _calculateEffectivePrice, getOrderbookTip as _getOrderbookTip } from '../services/marketStatus.service.js';

export async function getOrderbookTip(req, res, next) {
  try {
    res.json(await _getOrderbookTip(req.params.pair));
  } catch (err) {
    next(err);
  }
}

export async function calculateEffectivePrice(req, res, next) {
  try {
    res.json(await _calculateEffectivePrice(req.params.pair, req.params.operation, req.params.amount, req.query.priceLimit));
  } catch (err) {
    next(err);
  }
}
