import { TimeoutError } from '../../errors/timeout.error.js';
import eventEmmiter from '../../utils/eventEmmiter.js';
import { finishProcessing } from './finishProcessing.js';

let resolveInvocationPromise = () => { };
let currentBidDeltas = {quantity: 0, rate: 0};
let currentAskDeltas = {quantity: 0, rate: 0};
let queue;

export async function processOrderbookTip(Mqueue){
  queue = Mqueue;
  return new Promise((resolve, reject) => {
    setTimeout(()=>{
      finishProcessing(internalProcessing);
      reject(new Error)
    }, 10000)
    resolveInvocationPromise = resolve;
    eventEmmiter.on('newMessage', internalProcessing);
  }).catch(() => {throw new TimeoutError()})
}

function internalProcessing(){
  const message = queue.dequeue();
  const askDeltas = message.askDeltas;
  const bidDeltas = message.bidDeltas;

  if(bidDeltas != []){
    for(let i=0; i<bidDeltas.length; i++){
      if(bidDeltas[i].quantity != 0){
        currentBidDeltas.quantity = bidDeltas[i].quantity;
        currentBidDeltas.rate = bidDeltas[i].rate;
      }
    } 
  }

  if(askDeltas != []){
    for(let i=0; i<askDeltas.length; i++){
      if(askDeltas[i].quantity != 0){
        currentAskDeltas.quantity = askDeltas[i].quantity;
        currentAskDeltas.rate = askDeltas[i].rate;
      }
    } 
  }
  if (currentBidDeltas.quantity !== 0 && currentAskDeltas.quantity !== 0){
    const response = {
      "bidDelta": currentBidDeltas,
      "askDelta": currentAskDeltas
    }
    finishProcessing(internalProcessing);
    resolveInvocationPromise(response);
  }

}

