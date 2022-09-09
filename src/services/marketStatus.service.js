import { getEffectivePriceServiceError } from "../errors/get.effective.price.service.error.js";
import { getOrderbookTipServiceError } from "../errors/get.orderbook.tip.service.error.js";
import { Queue } from "../utils/queue.js";
import { makeSocketRequest } from "../utils/webSocketClient.js";
import { processEffectivePrice } from "./data.processing/processEffectivePrice.js";
import { processOrderbookTip } from './data.processing/processOrderbookTip.js';

export async function getOrderbookTip(pair){
  try{
    const queue = new Queue();
    const channel = ['orderbook_'+pair+'_1'];
    await makeSocketRequest(channel, queue);
    return await processOrderbookTip(queue);
  }catch(err){
    throw new getOrderbookTipServiceError(err);
  }
}

export async function calculateEffectivePrice(pair, operation, amount, priceLimit){
  try{
    const queue = new Queue();
    const channel = ['orderbook_'+pair+'_500'];
    await makeSocketRequest(channel, queue);
    return await processEffectivePrice(queue, operation, amount, priceLimit);
  }catch(err){
    throw new getEffectivePriceServiceError(err)
  }
}
