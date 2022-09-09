import { Router } from 'express';
import { calculateEffectivePrice, getOrderbookTip } from '../controllers/marketStatus.controller.js';
import { validateRequestSchema } from '../middlewares/validate.request.schema.js';
import { effectivePriceSchema, tipOrderbookSchema } from '../schema/validation.schemas.js';
const router = Router();

router.get('/tip-orderbook/:pair', tipOrderbookSchema, validateRequestSchema, getOrderbookTip);
router.get('/effective-price/:pair/:operation/:amount', effectivePriceSchema, validateRequestSchema, calculateEffectivePrice);

export default router;