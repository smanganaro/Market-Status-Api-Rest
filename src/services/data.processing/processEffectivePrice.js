import { TimeoutError } from '../../errors/timeout.error.js';
import { OPERATIONS } from '../../models/operations.js';
import eventEmmiter from '../../utils/eventEmmiter.js';
import { finishProcessing } from './finishProcessing.js';

let resolveInvocationPromise = () => { };
let currentBidDeltas = [], currentAskDeltas = [];
let queue;
let amount = 0;
let priceLimit = -1;

function sortByRateAsk (a, b) {return a.rate - b.rate}
function sortByRateBid (a, b) {return b.rate - a.rate}

export async function processEffectivePrice(Mqueue, Moperation,  Mamount, MpriceLimit){
  queue = Mqueue;
  amount = Mamount;
  if(MpriceLimit){
    priceLimit = MpriceLimit;
  }
  
  if(Moperation === OPERATIONS.BUY){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        finishProcessing(internalProcessingBuy);
        reject(new TimeoutError)
      }, 10000)
      resolveInvocationPromise = resolve;
      eventEmmiter.on('newMessage', internalProcessingBuy);
    }).catch((err) => {throw new TimeoutError()})
  }else if(Moperation === OPERATIONS.SELL){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        finishProcessing(internalProcessingSell);
        reject(new TimeoutError)
      }, 10000)
      resolveInvocationPromise = resolve;
      eventEmmiter.on('newMessage', internalProcessingSell);
    }).catch((err) => {throw new TimeoutError()})
  }
}

function internalProcessingBuy(){
  const message = queue.dequeue();
  const askDeltas = message.askDeltas;
  internalProcessing(askDeltas, currentAskDeltas, sortByRateAsk, internalProcessingBuy)
}

function internalProcessingSell(){
  const message = queue.dequeue();
  const bidDeltas = message.bidDeltas;
  internalProcessing(bidDeltas, currentBidDeltas, sortByRateBid, internalProcessingSell)
}

export function internalProcessing(deltas, currentDeltas, sortByRate, internalProcessingFunction){
  let sum = 0;
  let shouldPush = true;

  for(let i=0; i<deltas.length; i++){
    for(let j=0; j<currentDeltas.length; j++){
      if(deltas[i].rate === currentDeltas[j].rate){
        currentDeltas[j].quantity = deltas[i].quantity
        shouldPush = false;
      } 
    }
    if(shouldPush){
      currentDeltas.push(deltas[i])
    }
    shouldPush = true
  }
  currentDeltas = currentDeltas.filter(item => !(item.quantity === '0')).sort(sortByRate);
  
  //returns -1 if not possible
  const result = checkIfPossibleAndCalculate(currentDeltas);
  if(result !== -1){
    finishProcessing(internalProcessingFunction);
    resolveInvocationPromise(result);
  }
}

export function checkIfPossibleAndCalculate(currentDeltas){
  let price = 0;
  let currentAmount = amount;
  let currentPriceLimit = priceLimit;
  let maxOrderSize = 0;
  for(let i=0; i<currentDeltas.length && currentAmount>0 && validateCurrentPriceLimit(currentPriceLimit); i++){
    const rate = parseFloat(currentDeltas[i].rate)
    const quantity = parseFloat(currentDeltas[i].quantity)
    
    if(priceLimit !== -1){
      if(currentPriceLimit > (quantity * rate)){
        //can buy/sell everything
        maxOrderSize += quantity;
        currentPriceLimit -= (quantity * rate);
      }else{
        //can buy/sell a piece
        maxOrderSize += currentPriceLimit/rate;
        currentPriceLimit = 0; //Limit reached
      }
    }
    
    if(currentAmount > quantity){
      //can buy/sell everything
      price += rate * quantity; 
      currentAmount -= quantity; 
    }else{
      //can buy/sell a piece
      price += rate * currentAmount;
      currentAmount = 0; //Amount reached
    }
  }
  if(currentAmount > 0 && validateCurrentPriceLimit(currentPriceLimit)) return -1;
  else return (priceLimit != -1)? {"maximumOrderSize" : maxOrderSize} : {"effectivePrice" : price};
}

export function validateCurrentPriceLimit(currentPriceLimit){
  return (priceLimit == -1)? true : (currentPriceLimit>0)
}