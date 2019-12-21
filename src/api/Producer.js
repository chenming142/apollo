import { MessageProducer } from '../model/message';

class WSSignalR {

}

export class Producer {
  constructor () {
    this.chat = WSSignalR;
    this.disConnection = true;
  }
  static valid () {
    let valid = self.chat && !self.disConnection;
    if(valid){
      return true;
    } else if (self.disConnection) {
      Message.error('客服端与服务器连接中断，正在连接中.....');
    } 
  }
  static sendMessage (messageInfo) { MessageProducer.Producer(messageInfo, this);}
  static transmit (message) {
    let chatmsg = JSON.stringify(message);
    console.log("WSSignalR[sendMessage]", chatmsg);
    message.sendInvokingHandler();
    return self.chat.invoke('sendchatmsg', chatmsg).then((data) => {
      return new Promise((resolve, reject) => {
        if (data) {
          let result = JSON.parse(data);
          let { Status, Code, Message, Result } = result;
          if (Status == 1) {
            message.sendSucceedHandler(Result);
          } else {
            message.sendFailureHandler(Result);
            sendMessageErrorHandler(Code, Message || Result);
          }
        }
      });
    });

    function sendMessageErrorHandler(code, errMsg) {
      switch (code) {
        case __signalR__.NoSign:
          Notification.error({ title: '错误', message: errMsg });
          break;
        case __signalR__.SSOUnLogin:
          break;
        default:
          if (errMsg) {
            Message.error({ type: 'error', message: errMsg });
          }
      }
    }
  }
}

Producer.getInstance = ( function () {
  let instance = null;
  return function ( argument ) {
    if ( !instance ) {
      instance = new Producer();
    }
    return instance;
  }
} )();

export default Producer.getInstance();