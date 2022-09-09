import { param, query } from 'express-validator'
import { OPERATIONS } from '../models/operations.js'
import { PAIRS } from '../models/pairs.js'

export const tipOrderbookSchema = [
  param('pair').isIn(Object.keys(PAIRS).map((key) => PAIRS[key]))
]

export const effectivePriceSchema = [
  param('pair').isIn(Object.keys(PAIRS).map((key) => PAIRS[key])),
  param('operation').isIn(Object.keys(OPERATIONS).map((key) => OPERATIONS[key])),
  param('amount').isFloat({gt: 0.0}),
  query('priceLimit').optional().isFloat({gt: 0.0})
]