import Vue from 'vue';
import { ExtraInfo, ExtraInfoMixin } from "./wechatInfo";
import { SubordinateBehaviorMixin } from './subordinate';

import FriendFatory from "./friend";
import ChatroomFactory from "./chatroom";
import { RecentFlyweightFactory } from "./recent";

import Logging from '../api/logging';

const wechatLog = Logging.getLogger( 'wechat' );

export class Wechat extends SubordinateBehaviorMixin( ExtraInfoMixin( ExtraInfo ) ) {
  constructor( personalid, wechatid ) {
    super();
    this.personalid = personalid;
    this.wechatInfoKey = wechatid;

    this.friendIds = [];
    this.clusterIds = [];
    this.uniqKeys = [];

    this.unreadmsgcnt = 0;
    this.notthroughcount = 0;

    this.setAttributes( Wechat.attributes );
  }
  setExtraInfo( extraInfo ) {
    // wechatLog.info( '- setExtraInfo', extraInfo );
    this.getWechatInfo().setExtraInfo( extraInfo );
    super.setExtraInfo( extraInfo );
  }

  setOnlineStatus( onlinestatus ) { this.setExtraInfoByKey( 'onlinestatus', onlinestatus ); }
  setUnreadmsgcnt( unreadmsgcnt ) { this.setExtraInfoByKey( 'unreadmsgcnt', unreadmsgcnt ); }
  setNotthroughcount( notthroughcount ) { this.setExtraInfoByKey( 'notthroughcount', notthroughcount ); }
  calcUnreadmsgcnt( unreadmsgcnt ) {
    const self = this;
    let _unreadmsgcnt = self[ 'unreadmsgcnt' ];
    unreadmsgcnt += _unreadmsgcnt;
    unreadmsgcnt = Math.max( unreadmsgcnt, 0 );
    this.setExtraInfoByKey( 'unreadmsgcnt', unreadmsgcnt );
  }
  calcNotthroughcount( notthroughcount ) {
    const self = this;
    let _notthroughcount = self[ 'notthroughcount' ];
    notthroughcount += _notthroughcount;
    notthroughcount = Math.max( notthroughcount, 0 );
    this.setExtraInfoByKey( 'notthroughcount', notthroughcount );
  }

  checkAvaliable() {
    let friendAndChatroom = Array.from( this.friendIds ).concat( [ ...this.clusterIds ] );
    wechatLog.info( "- 检测个人号是否有效（存在好友或群）: " + this.personalid, '好友或群数量：' + friendAndChatroom.length );
    if ( friendAndChatroom.length > 0 ) {
      return true;
    } else {
      this.remove();
      return false;
    }
  }
  remove() { WechatFactory.delete( this.personalid ); }
  getFriendList() {
    let friendIds = [ ...this.friendIds ];
    return FriendFatory.getFriendsByFriendIds( friendIds );
  }
  getChatroomList() {
    let clusterIds = [ ...this.clusterIds ];
    // wechatLog.info( '- 获取归属的群列表', clusterIds );
    return ChatroomFactory.getChatroomsByClusterIds( clusterIds );
  }
  getRecentList() {
    let uniqKeys = [ ...this.uniqKeys ];
    return RecentFlyweightFactory.getRecentListByUniqKeys( uniqKeys );
  }
  toString() {
    const self = this;
    let { personalid, unreadmsgcnt, onlinestatus, notthroughcount } = self;
    wechatLog.info( "个人号：" + personalid +
      ', 未读数：' + unreadmsgcnt +
      ', 未通过好友数：' + notthroughcount +
      ', 在线状态: ' + [ '不在线', '在线' ][ onlinestatus ] +
      " - [好友：" + self.getFriendList().length + ", 群：" + self.getChatroomList().length + ", 最近联系人：" + self.getRecentList().length + ']' );
  }
}
Wechat.attributes = [ "personalid", "unreadmsgcnt", "onlinestatus", "notthroughcount" ];

export default class WechatFactory {
  static checkWechatNew( personalid ) {
    const self = this;
    // wechatLog.info( ' - WechatFactory.checkWechatNew 检测个人号是否存在: ' + personalid );
    let index = WechatFlyweightFactory.getWechatIndex( personalid );
    if ( index <= -1 ) {
      self.getWechatByApi( personalid );
    }
  }
  static getFristWechat() {
    const self = this;
    let wechats = WechatFlyweightFactory.getWechats();
    return wechats && wechats.length > 0 ? wechats[ 0 ] : null;
  }
  static delete( personalid ) {
    const self = this;
    let index = WechatFlyweightFactory.getWechatIndex( personalid );
    wechatLog.info( "- 删除个人号:" + personalid, '序号： ' + index );
    if ( index > -1 ) {
      let wechats = WechatFlyweightFactory.getWechats();
      wechats.splice( index, 1 );
    } else {
      throw Error( "删除个人号不存在：" + personalid, index );
    }
  }
  static getWechatByApi( personalid ) {
    wechatLog.info( "- 调用Api接口，获取个人号：" + personalid );
    let wechatInfo = WechatFlyweightFactory.getWechat( personalid );
    if ( !wechatInfo ) {
      throw Error( "- 调用Api接口，获取个人号：" + personalid + ",失败~" );
    }
    let { wechatid } = wechatInfo;
    let wechat = WechatFlyweightFactory.getWechat( personalid, wechatid );
    wechat.setExtraInfo( wechatInfo );
  }
}

export class WechatFlyweightFactory {
  static getWechat( personalid, wechatid ) {
    const self = this;
    let wechats = self.getWechats(),
      index = self.getWechatIndex( personalid );
    if ( index > -1 ) {
      return wechats[ index ];
    } else {
      let wechat = new Wechat( personalid, wechatid );
      //Vue.set( wechats, wechats.length, wechat );
      wechats.push( wechat );
      return wechat;
    }
  }
  static getWechatIndex( personalid ) {
    const self = this;
    let wechats = self.getWechats();
    if ( !wechats || wechats.length <= 0 ) return -1;
    if ( wechats && wechats.length > 0 ) {
      return wechats.findIndex( item => item.personalid === personalid );
    }
    return -1;
  }
  static getWechatSize() { return this.getWechats().length; }
  static getWechats() { return this.getInstance().wechats; }
  static getInstance() {
    const ctor = this;
    return ( function () {
      if ( !ctor.instance ) {
        ctor.instance = new ctor();
        ctor.instance.wechats = [];
      }
      return ctor.instance;
    } )();
  }
};