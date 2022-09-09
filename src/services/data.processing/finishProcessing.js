import eventEmmiter from "../../utils/eventEmmiter.js";

export const finishProcessing = function (removeListenerFunction){
  eventEmmiter.removeListener('newMessage', removeListenerFunction);
  eventEmmiter.emit('FinishedProcessing');
}