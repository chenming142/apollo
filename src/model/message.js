import ExtraInfo from "./extraInfo";
import WechatInfoFlyweightFactory from "./wechatInfo";

import constants from "../utils/constants";

import Logging from '../api/logging';

const messageLog = Logging.getLogger('message');

const __msgtype__ = constants.MSG_TYPE;

export class Message extends ExtraInfo {
  constructor(locmsgid) {
    messageLog.info("- Message.ctor: " + locmsgid);
    super();
    this.locmsgid = locmsgid;
    this.setAttributes(Message.attributes);
  }
}
Message.attributes = [
  "locmsgid",
  "personalid",
  "fromwechatid",
  "clusterid",
  "wxchatroomid",
  "friendid",
  "towechatid",
  "content",
  "msgtype",
  "msgsvrid",
  "sendstatus",
  "reportnum",
  "createtimestamp",
  "issend",
  "atwxids",
  "duration",
  "percent",
  "msgsvrid",
  "wechatid",
  "isrecord"
];

function CommonMixin(Base) {
  return class CommonBase extends Base {
    constructor(...args) {
      super(...args);
    }
  };
}
function NormalizedMixin(Base) {
  return class NormalizedMessage extends Base {
    constructor(...args) {
      messageLog.info("- NormalizedMessage.ctor: " + args[0]);
      super(...args);
      this.normalized();
    }
    normalized() {
      const self = this;
      let { content } = self;
      try {
        let { text } = JSON.parse(content);
        self.text = text;
      } catch (error) {
        self.text = content;
      }
    }
  };
}

class TextMessage {}
TextMessage.msgtype = __msgtype__.TEXT;

class VoiceMessage {}
class ImageMessage {}
class CustomExpressionMessage {}
class VideoMessage {}
class ImageGIFMessage {}
class ShareCardMessage {}
class UrlMessage {}
class ChatroomCallingMessage {}

class SystemMessage extends NormalizedMixin(Message) {
  constructor(messageInfo) {
    let { locmsgid } = messageInfo;
    super(locmsgid);
    this.msgBrief = "[系统消息]";
  }
}
SystemMessage.msgtype = __msgtype__.SYSTEM;

class JXSYSTEXTMessage {}
class MemberChangeMessage {}
class SystemMoneyMessage {}
class LocationMessage {}
class RealTimePositionMessage {}
class CallingMessage {}
class TransferKFMessage extends NormalizedMixin(Message) {
  constructor(messageInfo) {
    let { locmsgid } = messageInfo;
    messageLog.info("- TransferKFMessage.ctor: " + locmsgid);
    super(locmsgid);
    this.msgBrief = "[系统消息]";
  }
}
TransferKFMessage.msgtype = __msgtype__.TRANSFERKF;

class AccountTransferMessage {}
class RedEnvelopeMessage {}
class CouponMessgae {}

const MESSAGES = [
  TextMessage,
  VoiceMessage,
  ImageMessage,
  CustomExpressionMessage,
  VideoMessage,
  ImageGIFMessage,
  ShareCardMessage,
  UrlMessage,
  ChatroomCallingMessage,
  SystemMessage,
  JXSYSTEXTMessage,
  MemberChangeMessage,
  SystemMoneyMessage,
  LocationMessage,
  RealTimePositionMessage,
  CallingMessage,
  TransferKFMessage,
  AccountTransferMessage,
  RedEnvelopeMessage,
  CouponMessgae
];

export default class MessageFactory {
  static getMessageCtor(msgtype) {
    let clazz = MESSAGES.find(item => item.msgtype === msgtype);
    if (!clazz) {
      throw Error("该消息类型尚未实现：" + msgtype);
    }
    return clazz;
  }
  static getMessageInstance(messageInfo) {
    return MessageFlyweightFactory.buildMessageInstance(messageInfo);
  }
}

export class MessageFlyweightFactory {
  static buildMessageInstance(messageInfo) {
    const self = this;
    if(!messageInfo) return;
    
    if (messageInfo instanceof Message) {
      return self.getMessage(Message);
    } else {
      let { msgtype } = messageInfo;
      let ctor = MessageFactory.getMessageCtor(msgtype);
      // console.log("messsage.constructor: msgtype=" + msgtype, ctor);
      if (ctor) {
        let message = new ctor(messageInfo);
        // message.setExtraInfo(messageInfo);
        return self.getMessage(message);
      }
    }
  }
  static getMessage(message) {
    const self = this;
    let messages = self.getMessages();
    let { locmsgid } = message;
    if (messages.has(message && locmsgid)) {
      message = messages.get(locmsgid);
    } else {
      messages.set(locmsgid, message);
    }
    return message;
  }
  static getMessages() {
    return this.getInstance().messages;
  }
  static getInstance() {
    const ctor = this;
    return (function() {
      if (!ctor.instance) {
        ctor.instance = new ctor();
        ctor.instance.messages = new Map();
      }
      return ctor.instance;
    })();
  }
}

// console.log(SystemMessage);
