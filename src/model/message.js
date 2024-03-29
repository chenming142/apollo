import WechatInfoFactory, { ExtraInfo, ExtraInfoMixin } from "./wechatInfo";
import Producer from '../api/Producer';

import constants from "../utils/constants";
import Logging from '../api/logging';
import store from '../store';

import { html_encode } from "../utils/helper"

const messageLog = Logging.getLogger( 'message' );
const __msgtype__ = constants.MSG_TYPE;
const __sendstatus__ = constants.SEND_STATUS;
const __issend__ = constants.IS_SEND;

export class Message extends ExtraInfo {
  constructor( messageInfo ) {
    let { locmsgid, msgtype } = messageInfo;
    messageLog.info( "- Message.ctor: " + msgtype + ", locmsgid: "+ locmsgid );
    super(messageInfo);
    this.locmsgid = locmsgid ? locmsgid : void 0;
    this.setAttributes( Message.attributes );

    this.setExtraInfo( messageInfo )
  }
  setExtraInfo( extraInfo ) {
    super.setExtraInfo( extraInfo );
    this.parseMsgInfo( );
  }
  parseMsgInfo( ) {
    let { content } = this;
    if ( content ) {
      try {
        content = JSON.parse( content );
      } catch ( err ) {
        messageLog.error( '- parseMsgInfo 出错： ' + err );
      }
      return content;
    } else {
      throw Error( '该消息无content内容：', this );
    }
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

class SenderInfoDecorator {
  static getSenderInfo( message ) {
    let { wechatid } = message;
    let wechatInfo = WechatInfoFactory.getWechatInfoInstance( wechatid );
    message[ 'sender' ] = wechatInfo;
  }
}
class AnnouncementDecorator {
  static atuserlist( message ) {
    if ( message.msgAt == __atType__.all ) {
      let chatroom = Chatroom.buildChatroomByChangedMsg( message );
      if ( chatroom.isSelectedChatTarget( ) ) {
        instance.$emit( __events__.UPDATE_ANNOUNCEMENT, message.msgBrief );
      }
    }
  }
}
class SensitiveWordsMessageDecorator {
  static identifierSensitiveWords( richText, message ) {
    function getSensitiveWords( ) {
      if ( SensitiveWordsMessageDecorator.SENSITIVEWORDS ) {
        return Promise.resolve( SensitiveWordsMessageDecorator.SENSITIVEWORDS );
      }
      return getSensitiveWordsByVuex( );
    }

    function getSensitiveWordsByVuex( ) {
      let sensitiveWords = store.state.main.sensitiveWords;
      if ( sensitiveWords ) {
        return Promise.resolve( store.state.main.sensitiveWords );
      }
      return getSensitiveWordsByDB( );
    }

    function getSensitiveWordsByDB( ) {
      return sensitiveWords.listSensitiveWords( ).then( data => {
        let result = data;
        SensitiveWordsMessageDecorator.SENSITIVEWORDS = result;
        store.commit( "SET_SENSITIVE_WORDS", result );
        return Promise.resolve( result );
      } )
    }

    function SensitiveWordsHandler( sensitiveWords ) {
      if ( sensitiveWords && sensitiveWords.length > 0 ) {
        sensitiveWords.forEach( word => {
          let reg_sensitiveWord = new RegExp( word, "g" );
          if ( richText.indexOf( word ) >= 0 ) {
            if ( message ) message.sensitive = true;
            richText = richText.replace( reg_sensitiveWord, `<span style="color:red;font-weight:bold">${word}</span>` );
          }
        } );
      }
      return Promise.resolve( richText );
    }

    function getMsgInfoByDecorator( richText ) {
      richText = LinkMessageDecorator.identifierLinks( richText );
      let toBeUpdated = EmojiMessageDecorator.isEmojiMsg( richText );
      toBeUpdated[ 'opt' ] = 'decorator|sensitivewords,link,emoji';
      let existMessage = MessageFactory.getMessageByLocmsgId( message );
      if ( existMessage ) {
        store.commit( "UPDATE_MESSAGE", { message: existMessage, toBeUpdated } );
      }
      return Promise.resolve( toBeUpdated );
    }
    return getSensitiveWords( ).then( SensitiveWordsHandler ).then( getMsgInfoByDecorator );
  }
}
class LinkMessageDecorator {
  static identifierLinks( richText ) {
    let reg_url = /https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/ig;
    if ( richText ) {
      richText = richText.replace( reg_url, function ( url ) {
        let idx = url.indexOf( "&lt;" ),
          regUrl;
        if ( idx != -1 ) {
          regUrl = url.slice( 0, idx );
          return `<a href="${regUrl}" target='_blank' style="color:#2330FE;text-decoration: underline">${regUrl}</a>${url.slice(idx)}`;
        } else {
          return `<a href="${url}" target='_blank' style="color:#2330FE;text-decoration: underline">${url}</a>`;
        }
      } );
    }
    return richText;
  }
}
class EmojiMessageDecorator {
  static isEmojiMsg( richText ) {
    richText = emoji.emoticonFormat( richText );
    let isEmoji = false;
    let emojiRegex = /<(i|span)\s+class="[^"]+"\s+text="[^"]+"\s+src="[^"]+"\s+><\/\1>/;
    if ( emojiRegex.test( richText ) ) {
      isEmoji = true;
    }
    return { richText, isEmoji };
  }
}
class ShareCardMessageDecorator {
  static setShareCardMsgInfo( message ) {
    let { content } = message, shareCardInfo;
    if ( typeof content == 'string' ) {
      content = parseJSON( content );
    }

    function getShareCardMsgInfoByContent( ) {
      if ( content ) {
        let { headPic, nickname } = content;
        if ( headPic && nickname ) {
          shareCardInfo = { headPic, nickname };
          //console.log('getShareCardMsgInfoByContent: 消息');
          return Promise.resolve( shareCardInfo );
        }
      }
      return getShareCareMsgInfoByVuex( content );
    }

    function getShareCareMsgInfoByVuex( content ) {
      if ( content ) {
        if ( typeof content == 'string' ) content = parseJSON( content );
        let { username } = content;
        let shareCards = store.state.main.cardManagement;
        if ( shareCards && shareCards.length > 0 ) {
          let sharCard = shareCards.find( item => item.wechatid === username );
          if ( sharCard ) {
            let { headPic, nickname } = sharCard;
            shareCardInfo = { headPic, nickname };
            //console.log('getShareCardMsgInfoByContent: vuex');
            return Promise.resolve( shareCardInfo );
          }
        }
      }
      return getShareCardMsgInfoByDB( content );
    }

    function getShareCardMsgInfoByDB( content ) {
      return new Promise( ( resolve, reject ) => {
        if ( typeof content == 'string' ) content = parseJSON( content );
        let { username, nickname } = content;
        if ( username ) {
          wechatApi.getWechatInfo( username ).then( data => {
            if ( data && data[ 'Result' ] && data[ 'Status' ] === 1 ) {
              let { Result } = data;
              let { headimgurl, nick_name, wechat_id, wechat_no } = Result;
              store.commit( "SET_CARD_MANAGEMENT", { headPic: headimgurl, nickname: nick_name, wechatid: wechat_id, wechat_no } );
              shareCardInfo = { headPic: headimgurl, nickname: nick_name };
            } else {
              shareCardInfo = { headPic: '', nickname: nickname };
            }
            resolve( shareCardInfo );
            //console.log('getShareCardMsgInfoByContent: 接口');
          } );
        }
      } );
    }

    function setShareCardMsgInfoHandler( result ) {
      if ( result ) {
        let { headPic, nickname } = result;
        let toBeUpdated = { cardheadPic: headPic, cardNickname: nickname };
        toBeUpdated[ 'opt' ] = "decorator|sharecard";
        store.commit( "UPDATE_MESSAGE", { message, toBeUpdated } );
      }
    }

    return getShareCardMsgInfoByContent( ).then( setShareCardMsgInfoHandler );
  }
}

const NormalizedMixin = Base => class NormalizedMessage extends Base {
  constructor( ...args ) {
    messageLog.info( "- NormalizedMessage.ctor: " + args[ 0 ] );
    super( ...args );
    this.normalized( );
  }
  normalized( ) {
    const self = this;
    let { content } = self;
    try {
      let { text } = JSON.parse( content );
      self.text = text;
    } catch ( error ) {
      self.text = content;
    }
  }
};
const RecalledMixin = Base => class RecalledMessage extends Base {
  constructor( ...args ) {
    super( ...args );
    this.recalled = false;
  }
  recalledHandle( ) {
    this.recalled = true;
    this.sendstatus = __sendstatus__.recall;
  }
  setRecalled( ) {
    let { sendstatus } = this;
    if ( sendstatus === __sendstatus__.recall ) {
      this.recalled = true;
    }
  }
};
const TranslateMixin = Base => class TranslateMessage extends Base {
  constructor( ...args ) {
    super( ...args );
    this.translating = false;
  }
  setTranslating( ) {
    this.translating = true;
  }
  translateMsgHandler( translateText ) {
    this.translating = false;
    this.translateText = translateText;
  }
};
const ReplacedMixin = Base => class ReplacedMessage extends Base {
  constructor( ...args ) {
    super( ...args );
    this.isReplaceMsg( true );
  }
  isReplaceMsg( isReplaceMsg ) { this.isReplaceMsg = isReplaceMsg; }
};
const SecondaryMixin = Base => class SecondaryMessage extends Base {
  constructor( ...args ) {
    super( ...args );
    this.lazy = true;
    this.placeholder = '';
    this.received = false;
    this.detectImgHd( );
  }
  setMsgPlaceholer( ) {
    //TODO: 图片|视频 占位符
    this.placeholder = '';
  }
  startMsgLoaded( ) {
    let { received } = this;
    if ( received ) {
      this.lazy = false;
      this.placeholder = null;
    }
  }
  setMsgRecevied( message ) {
    let existLocmsgid = this.locmsgid;
    let { locmsgid } = message;
    if ( existLocmsgid !== locmsgid ) return;

    let content = this.parseMsgInfo( );
    if ( content ) {
      let { url } = JSON.parse( content );
      if ( url ) {
        this.received = true;
      }
    }
  }
  detectImgHd( ) {
    let content = this.parseMsgInfo( );
    if ( content ) {
      try {
        let { attachtype } = parseJSON( content );
        if ( attachtype ) self.attachtype = attachtype;
      } catch ( err ) {}
    }
  }
};

class TextMessage extends RecalledMixin( ReplacedMixin( Message ) ) {
  constructor( messageInfo ) {
    super( messageInfo );
    this.buildMsgInfo();
  }
  setTextMsgInfo( result ) {
    let { richText, isEmoji } = result;
    this.richText = richText;
    this.isEmoji = isEmoji;
  }
  buildMsgInfo( ) {
    const self = this;
    let content = self.parseMsgInfo( );
    let { text, msgsource } = content;
    self.msgBrief = text;
    if ( typeof msgsource == 'string' ) {
      msgsource = JSON.parse( msgsource );
      self.msgAt = msgsource && msgsource[ 'atuserlist' ];
      if ( self.msgAt && self.msgAt == __atType__.all ) {
        AnnouncementDecorator.atuserlist( self );
      }
    }
    if ( text ) {
      let richText = html_encode( text );
      SensitiveWordsMessageDecorator.identifierSensitiveWords( richText, self ).then( data => { self.setTextMsgInfo( data ); } )
    }
  }
}
TextMessage.msgtype = __msgtype__.TEXT;

class VoiceMessage extends TranslateMixin( RecalledMixin( ReplacedMixin( Message ) ) ) {
  constructor( messageInfo ) {
    super( messageInfo );
    this.isReplaceMsg( true );
    this.msgBrief = "[语音消息]";
  }
}
VoiceMessage.msgtype = __msgtype__.VOICE;

class ImageMessage extends SecondaryMixin( RecalledMixin( ReplacedMixin( Message ) ) ) {
  constructor( messageInfo ) {
    super( messageInfo );
    this.msgBrief = '[图片消息]';
  }
}
ImageMessage.msgtype = __msgtype__.IMAGE;

class ImageGIFMessage extends SecondaryMixin( RecalledMixin( ReplacedMixin( Message ) ) ) {
  constructor( messageInfo ) {
    super( messageInfo );
    this.msgBrief = '[动画表情]';
  }
}
ImageGIFMessage.msgtype = __msgtype__.IMAGE_GIF;

class CustomExpressionMessage extends SecondaryMixin( RecalledMixin( ReplacedMixin( Message ) ) ) {
  constructor( messageInfo ) {
    super( messageInfo );
    this.msgBrief = '[自定义表情]';
  }
}
CustomExpressionMessage.msgtype = __msgtype__.CUSTOM_EXPRESSION;

class VideoMessage extends SecondaryMixin( RecalledMixin( ReplacedMixin( Message ) ) ) {
  constructor( messageInfo ) {
    super( messageInfo );
    this.msgBrief = '[视频消息]';
  }
}
VideoMessage.msgtype = __msgtype__.VIDEO;

class ShareCardMessage extends RecalledMixin( Message ) {
  constructor( messageInfo ) {
    super( messageInfo );
    this.msgBrief = '[名片消息]';
  }
  buildMsgInfo( ) {
    let content = this.parseMsgInfo( );
    ShareCardMessageDecorator.setShareCardMsgInfo( this );
    let { certflag } = content;
    if ( certflag ) this.certflag = certflag;
  }
}
ShareCardMessage.msgtype = __msgtype__.SHARE_CARD;

class UrlMessage extends RecalledMixin( Message ) {
  constructor( messageInfo ) {
    super( messageInfo );
    this.msgBrief = "[链接消息]";
    this.buildMsgInfo( );
  }
  buildMsgInfo( ) {
    const self = this;
    let json = this.parseMsgInfo( );
    let { type, url, title, des, sourcedisplayname, thumbUrl } = json;
    self.urlType = type;
    switch ( type ) {
      case __attachtype__.file:
        let parts, splits;
        self.url = url || '';
        if ( self.url && self.url.length > 0 ) {
          parts = self.url.split( "/" );
          self.title = decodeURIComponent( parts[ parts.length - 1 ] );
          splits = self.url.split( "." );
          self.fileExt = __file_exts__[ splits[ splits.length - 1 ] ] || "unknown";
        }
        self.title = title || self.title;
        self.downloading = false;
        self.msgBrief = "[文件消息]";
        break;
      case __attachtype__.link:
      case __attachtype__.favorite:
        self.title = title;
        self.url = url;
        self.des = des;
        break;
      case __attachtype__.routine:
      case __attachtype__[ "open-routine" ]:
        self.title = title;
        self.url = url;
        self.des = des;
        self.sourcedisplayname = sourcedisplayname;
        self.thumbUrl = thumbUrl;
        self.msgBrief = "[小程序消息]";
        break;
    }
  }
  downloadFile( ) {
    this.downloading = !!this.downloading;
  }
}
UrlMessage.msgtype = __msgtype__.URL;

class ChatroomCallingMessage extends NormalizedMixin( Message ) {
  constructor( messageInfo ) {
    super( messageInfo );
    this.msgBrief = "[群语音/群视频通话]";
  }
}
ChatroomCallingMessage.msgtype = __msgtype__.CHATROOM_CALLING;

class SystemMessage extends NormalizedMixin( Message ) {
  constructor( messageInfo ) {
    let { locmsgid } = messageInfo;
    messageLog.info( "- SystemMessage.ctor: " + locmsgid );
    super( locmsgid );
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
class TransferKFMessage extends NormalizedMixin( Message ) {
  constructor( messageInfo ) {
    let { locmsgid } = messageInfo;
    messageLog.info( "- TransferKFMessage.ctor: " + locmsgid );
    super( locmsgid );
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
  static getMessageCtor( msgtype ) {
    let clazz = MESSAGES.find( item => item.msgtype === msgtype );
    if ( !clazz ) {
      throw Error( "该消息类型尚未实现：" + msgtype );
    }
    return clazz;
  }
  static newMessageInstance( messageInfo ) {
    let { msgtype } = messageInfo;
    let ctor = this.getMessageCtor( msgtype );
    if ( ctor ) {
      return new ctor( messageInfo );
    }
    throw new Error('未找到对应的消息类型：'+ msgtype+', 无法构造消息');
  }
  static getMessageInstance( messageInfo ) {
    return MessageFlyweightFactory.buildMessageInstance( messageInfo );
  }
}

export class MessageFlyweightFactory {
  static buildMessageInstance( messageInfo ) {
    const self = this;
    if ( !messageInfo ) return;
    if ( messageInfo instanceof Message ) {
      return self.getMessage( Message );
    } else {
      let message = MessageFactory.newMessageInstance(messageInfo);
      return self.getMessage( message );
    }
  }
  static getMessage( message ) {
    const self = this;
    let messages = self.getMessages();
    let { locmsgid } = message;
    if ( self.hasMessage( message && locmsgid ) ) {
      message = messages[ locmsgid ];
    } else {
      messages[ locmsgid ] = message;
    }
    return message;
  }
  static hasMessage( locmsgid ) {
    const self = this;
    let messages = self.getMessages( );
    return Object.keys( messages ).indexOf( locmsgid ) > -1;
  }
  static deleteMessage (locmsgid) {
    const self = this;
    if(self.hasMessage( locmsgid )) {
      let messages = self.getMessages( );
      delete messages[locmsgid];
    }
  }
  static getMessages( ) { return this.getInstance( ).messages; }
  static getInstance( ) {
    const ctor = this;
    return ( function ( ) {
      if ( !ctor.instance ) {
        ctor.instance = new ctor( );
        ctor.instance.messages = {};
      }
      return ctor.instance;
    } )( );
  }
}

const KFMessageMixin = Base => class _XXMessage extends Base {
  constructor( ...args ) {
    let [producer, messageInfo] = args;
    super( messageInfo );
    let message = MessageFactory.newMessageInstance(messageInfo);
    this.__Producer__ = producer;
    this.__message__ = message;
  }
  transmitted() {
    const self = this;
    self.__message__.cmdtype = 'CmdSendMessage';
    self.__message__.issend = __issend__.self;
    self.__message__.timeout = false;
    self.__message__.sendstatus = __sendstatus__.sending;

    self._getLocmsgId().then(() => {
      self.__Producer__.transmit(self.__message__);
    });
    return self;
  }
  _getLocmsgId () {
    const self = this;
    if(self._checkProducerValid()){
      return getLocmsgId().then(locmsgidHandler);

      function getLocmsgId(){
        let { locmsgid } = self.__message__;
        if (!locmsgid) {
          let sysmsg = { cmdtype: "CmdGetLocMsgId" };
          return self.__Producer__.chat.invoke("sendsysmsg", JSON.stringify(sysmsg)).then((data) => {
            return new Promise((resolve, reject) => {
              if (!data) reject(data);
              let result = data;
              if(result)resolve(result['Message']);
              reject(result);
            });
          }); 
        }
        return Promise.resolve();
      }
      function locmsgidHandler(locmsgid) {
        if(locmsgid && !self.__message__.hasOwnProperty('locmsgid')){
          self.__message__.locmsgid = locmsgid;
          MessageFlyweightFactory.getMessage(self.__message__);
        }
      }
    }
  }
  _checkProducerValid () { return this.__Producer__.valid();}
  sendInvokingHandler () {
    const self = this;
    self.timeoutref = setTimeout(() => {
      self.__message__.timeout = true;
      self.__message__.sendstatus = __sendstatus__.fail;
      self._clearTimeoutRef();
    }, 10e3);
    self.__message__.createtimestamp = +new Date;
    store.dispatch('processANewMessage', { message: self.__message__ });
  }
  sendSucceedHandler (result) {
    const self = this;
    if (typeof result === 'string') {
      result = JSON.parse(result);
    }
    let { sendstatus, createtimestamp } = result;
    self.__message__.sendstatus = sendstatus;
    self.__message__.createtimestamp = createtimestamp;
    self._clearTimeoutRef();
  }
  sendFailureHandler(result) {
    const self = this;
    if (typeof result === 'string') {
      try {
        result = JSON.parse(result);
      } catch (err) {}
    }
    let { createtimestamp } = result;
    self.__message__.createtimestamp = createtimestamp;
    self.__message__.sendstatus = __sendstatus__.fail;
    self._clearTimeoutRef();
  }
  _clearTimeoutRef () {
    let { __message__: { sendstatus }, timeoutref } = this;
    if (sendstatus === __sendstatus__.fail 
      || sendstatus === __sendstatus__.success) {
      this.__message__.timeout = false;
    }
    clearTimeout(timeoutref);
    this.timeoutref = null;
  }
};
class KFMessage extends KFMessageMixin (Message){
  setExtraInfo (extraInfo) {/** 装饰占位 **/}
  decorator () {
    const self = this;
    return new Proxy(self, {
      get (target, key) {
        return self.__message__[key];
      },
      set (target, key, val) {
        return self.__message__[key] = val;
      }
    });
  }
}

export class MessageProducer {
  static Producer(messageInfo, producer = Producer, ) { 
    return new KFMessage(producer, messageInfo).decorator();
  }
}