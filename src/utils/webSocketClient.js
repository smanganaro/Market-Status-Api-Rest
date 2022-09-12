import 'dotenv/config.js';
import { client as _client } from 'signalr-client';
import { inflateRaw } from 'zlib';
import { clientFailedToConnectError } from '../errors/client.failed.to.connect.error.js';
import { clientFailedToSubscribeError } from '../errors/client.failed.to.subscribe.error.js';
import { clientFailedToUnsubscribeError } from '../errors/client.failed.to.unsubscribe.error.js';
import eventEmmiter from './eventEmmiter.js';
import logger from './logger.js';
const url = process.env.BITTREX_WEBSOCKET_URL;
const hub = [process.env.BITTREX_WEBSOCKET_HUB];
let client;
let queue;
let resolveInvocationPromise = () => { };

export async function makeSocketRequest(channels, Mqueue) {
  client = await connect();
  queue = Mqueue;
  await subscribe(client, channels);
}

async function connect() {
  return new Promise((resolve) => {
    try{ 
      const client = new _client(url, hub);
      client.serviceHandlers.messageReceived = messageReceived;
      client.serviceHandlers.connected = () => {
        logger.info('Connected');
        return resolve(client)
      }
    }catch(err){
      logger.error('Client failed to connect:' + err)
      throw new clientFailedToConnectError(err)
    }
  });
}

async function disconnect(client) { 
  try{
    client.end();
    logger.info('Disconnected');
  }catch(err){
    logger.error('Failed to disconnect', err);
  }
  
}

async function subscribe(client, channel) {
  try {
    await invoke(client, 'subscribe', channel);  
    logger.info('Subscription to "' + channel + '" successful');
    const unsuscribeU = unsubscribe.bind({ client: client, channel: channel });
    eventEmmiter.once('FinishedProcessing', unsuscribeU);
  }catch(err){
    logger.error('Subscription to "' + channel + '" failed: ' + err);
    throw new clientFailedToSubscribeError(err);
  }
}

async function unsubscribe(){
  try {
    await invoke(this.client, 'Unsubscribe', this.channel); 
    disconnect(this.client);
    logger.info('Unsubscription to "' + this.channel + '" successful');
  }catch(err){
    logger.error('Unsubscription to "' + this.channel + '" failed: ' + err);
    //should retry
    throw new clientFailedToUnsubscribeError(err);
  }
}

async function invoke(client, method, ...args) {
  return new Promise((resolve, reject) => {
    resolveInvocationPromise = resolve
    client.call(hub[0], method, ...args)
      .done(function (err) {
        if (err) { return reject(err); }
      });
  })
}

async function messageReceived(message) {
  const data = JSON.parse(message.utf8Data);
  if(data['R']) resolveInvocationPromise(data.R)
  if (data['M']) {
    data.M.forEach(function (m) {
      if (m['A']) {
        if (m.A[0]) {
          const b64 = m.A[0];
          const raw = new Buffer.from(b64, 'base64');
          inflateRaw(raw, function (err, inflated) {
            if (!err) {
              const json = JSON.parse(inflated.toString('utf8'));
              queue.enqueue(json);
              eventEmmiter.emit('newMessage');
            }
          });
        }
      }
    });
  }
}
