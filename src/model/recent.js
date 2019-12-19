import { ExtraInfo, ExtraInfoMixin, WechatInfoFlyweightFactory } from "./wechatInfo";
import SubordinatorMixin from "./subordinate";
import AssociateMixin from "./associate";

import MessageFactory, { Message } from "./message";
import { Friend } from "./friend";
import { Chatroom } from "./chatroom";

import constants from "../utils/constants";

const __chattargettype__ = constants.CHAT_TARGET_TYPE;
const __disturb__ = constants.DISTURB;

export class Recent extends AssociateMixin( SubordinatorMixin( ExtraInfoMixin( ExtraInfo ) ) ) {
  constructor( personalid, chattargetid, chattargettype, wechatid ) {
    super( );
    this.personalid = personalid;
    this.chattargetid = chattargetid;
    this.chattargettype = chattargettype;
    this.wechatInfoKey = wechatid;
    this.setAttributes( Recent.attributes );
  }
  getUniqKey( ) {
    let { personalid, chattargettype } = this;
    let wechatid = this.getExtraInfoByKey( 'wechatid' );
    return personalid + "-" + chattargettype + "-" + wechatid;
  }
  setExtraInfo( extraInfo ) {
    this.getWechatInfo( ).setExtraInfo( extraInfo );
    super.setExtraInfo( extraInfo );
    this.checkSubordinatorNew( );
    this.establishSubordinate( );
    this.checkAssociateRefNew( );
  }

  setLastmsgInfo( lastMessage ) {
    const self = this;
    if ( !( lastMessage instanceof Message ) ) throw Error( "参数：最后一条记录，必须是类型Message子类", lastMessage );
    if ( lastMessage && lastMessage.locmsgid ) {
      self.lastmsg = lastMessage;
    }
  }
  replaceLastmsgInfo( lastmsgInfo ) {
    const self = this;
    let message = MessageFlyweightFactory.buildMessageInfo( lastmsgInfo );
    if ( self.lastmsg.isReplaced( message ) ) {
      self.setLastmsgInfo( message );
    }
  }

  remove( ) { RecentFactory.delete( this.getUniqKey( ) ); }
  identity( ) { return this.getUniqKey( ); }
}
Recent.attributes = [ "personalid", "stick", "unreadmsgcount", "datastatus", "disturbsetting", "draft" ];

export default class RecentFactory {
  static getRecentInstance( recentInfo ) {
    return RecentFlyweightFactory.buildRecentInstance( recentInfo );
  }
  static buildByCtor( recentInfo ) {
    let { personalid, chattargetid, chattargettype, wechatid } = recentInfo;
    let recent = new Recent( personalid, chattargetid, chattargettype, wechatid );

    let _recent = RecentFactory.getRecentInstance( recent );
    _recent.setExtraInfo( recentInfo );

    let { lastmsg } = recentInfo, message;
    if ( lastmsg ) {
      message = MessageFactory.getMessageInstance( lastmsg );
    }

    return recent;
  }
  static buildByFriend( friend ) {
    let { personalid, friendsid, wechatid } = friend;
    let recent = new Recent( personalid, friendsid, __chattargettype__.friend, wechatid );
    recent.setExtraInfo( friend );
    return recent;
  }
  static buildByChatroom( chatroom ) {
    let { personalid, clusterid, wxchatroomid } = chatroom;
    let recent = new Recent( personalid, clusterid, __chattargettype__.chatroom, wxchatroomid );
    let _recent = RecentFactory.getRecentInstance( recent );
    _recent.setExtraInfo( chatroom );
    let { messageunreadcount, datastatus } = chatroom;
    _recent.refreshUnReadMsgCount( messageunreadcount );
    _recent.refreshDataStatus( datastatus );
    //TODO: setLastmsgInfo ?
    return recent;
  }
  static buildByMessage( messageInfo ) {
    let { personalid } = messageInfo;
    let message = MessageFactory.getMessageInstance( messageInfo );

    let chattargettype, chattargetid, wechatid;
    chattargetid = message.getChattargetid( );
    chattargettype = message.getChattargettype( );
    wechatid = message.getWechatid( );

    let recent = new Recent( personalid, chattargettype, chattargetid, wechatid );
    let _recent = RecentFactory.getRecentInstance( recent );
    _recent.setExtraInfo( messageInfo );
    _recent.refreshUnReadMsgCount( 1 );
    let lastmsg = MessageFlyweightFactory.getMessage( message );
    _recent.setLastmsgInfo( lastmsg );

    return recent;
  }
}

export class RecentFlyweightFactory {
  static buildRecentInstance( recentInfo ) {
    const self = this;
    let recent = null;
    if ( recentInfo instanceof Recent ) {
      return self.getRecent( recentInfo );
    } else {
      if ( recentInfo instanceof Friend ) {
        recent = RecentFactory.buildByFriend( recentInfo );
      } else if ( recentInfo instanceof Chatroom ) {
        recent = RecentFactory.buildByChatroom( recentInfo );
      } else if ( recentInfo instanceof Message ) {
        recent = RecentFactory.buildByMessage( recentInfo );
      } else {
        recent = RecentFactory.buildByCtor( recentInfo );
      }
      return self.getRecent( recent );
    }
  }
  static getRecentListByUniqKeys( uniqKeys ) {
    const self = this;
    let recentList = self.getRecentList( );
    return uniqKeys.reduce( ( ret, uniqKey ) => ret.concat( [ recentList[ self.getRecentIndex( uniqKey ) ] ] ), [ ] );
  }
  static getRecent( recent ) {
    const self = this;
    let recentList = self.getRecentList( );
    let uniqKey = recent.getUniqKey( );
    let index = self.getRecentIndex( uniqKey );
    if ( index > -1 ) {
      //TODO: UPDATED~
      recentList.splice( index, 1, recent );
    } else {
      recentList.push( recent );
    }
    return recent;
  }
  static delete( uniqKey ) {
    const self = this;
    let index = self.getRecentIndex( uniqKey );
    let recentList = self.getRecentList( );
    if ( index > -1 ) {
      recentList.splice( index, 1 );
    }
  }
  static getRecentIndex( uniqKey ) {
    const self = this;
    let recentList = self.getRecentList( );
    if ( !recentList || recentList.length <= 0 ) return -1;
    if ( recentList.length > 0 ) {
      return recentList.findIndex( item => item.getUniqKey( ) === uniqKey );
    }
  }
  static getRecentSize( ) { return this.getRecentList( ).length; }
  static getRecentList( ) { return this.getInstance( ).recentList; }
  static getInstance( ) {
    const ctor = this;
    return ( function ( ) {
      if ( !ctor.instance ) {
        ctor.instance = new ctor( );
        ctor.instance.recentList = [ ];
      }
      return ctor.instance;
    } )( );
  }
}