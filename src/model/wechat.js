import ExtraInfo, { ExtraInfoMixin } from "./extraInfo";
import WechatInfoFlyweightFactory from "./wechatInfo";
import FriendFatory, { Friend } from "./friend";
import ChatroomFactory, { Chatroom } from "./chatroom";
import { RecentFlyweightFactory, Recent } from "./recent";
import { SubordinateBehaviorMixin } from './subordinate';
import Logging from '../api/logging';

const wechatLog = Logging.getLogger( 'wechat' );

export class Wechat extends SubordinateBehaviorMixin( ExtraInfoMixin( ExtraInfo ) ) {
  constructor( personalid, wechatid ) {
    super();
    this.personalid = personalid;
    this.wechatInfo = WechatInfoFlyweightFactory.getWechatInfo( wechatid );

    this.friendIds = new Set();
    this.chatroomIds = new Set();
    this.uniqKeys = new Set();

    this.unreadmsgcnt = 0;
    this.notthroughcount = 0;

    this.setAttributes( Wechat.attributes );
  }
  setExtraInfo( extraInfo ) {
    wechatLog.info( '- setExtraInfo', extraInfo );
    this.wechatInfo.setExtraInfo( extraInfo );
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
    let friendAndChatroom = Array.from( this.friendIds ).concat( [ ...this.chatroomIds ] );
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
    let chatroomIds = [ ...this.chatroomIds ];
    return ChatroomFactory.getChatroomsByClusterIds( chatroomIds );
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
  static getWechat( personalid, wechatid ) {
    const self = this;
    let wechats = self.getWechats(),
      index = self.getWechatIndex( personalid );
    if ( index > -1 ) {
      return wechats[ index ];
    } else {
      let wechat = new Wechat( personalid, wechatid );
      wechats.push( wechat );
      return wechat;
    }
  }
  static checkWechatNew( personalid ) {
    const self = this;
    let index = self.getWechatIndex( personalid );
    if ( index <= -1 ) {
      self.getWechatByApi( personalid );
    }
  }
  static getFristWechat() {
    const self = this;
    let wechats = self.getWechats();
    return wechats && wechats.length > 0 ? wechats[ 0 ] : null;
  }
  static delete( personalid ) {
    const self = this;
    let index = self.getWechatIndex( personalid );
    wechatLog.info( "- 删除个人号:" + personalid, '序号： ' + index );
    if ( index > -1 ) {
      let wechats = self.getWechats();
      wechats.splice( index, 1 );
    } else {
      throw Error( "删除个人号不存在：" + personalid, index );
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
  static getWechatByApi( personalid ) {
    wechatLog.info( "- 调用Api接口，获取个人号：" + personalid );
    let _wechats = [ {
      personalid: 9661,
      wechatid: "wxid_2tvf9y1ndag622",
      wechatno: "wg18601",
      nickname: "乌云125",
      headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/ZedicGuxtb6ISND1u5Jnx3AmUIbJy7pjC6NgUs1mbibibVg4zDYGoUvaAdPv1NUd6PCDTFxqD4icN6icNYT1kVmD0ySSHHmTMSVvsrvgic4hRNB3s/0",
      remark: "",
      onlinestatus: 0,
      unreadmsgcnt: 0,
      notthroughcount: 0
    }, {
      personalid: 9676,
      wechatid: "wxid_peib914d9kw222",
      wechatno: "",
      nickname: "爱拼不会赢1",
      headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/KhHc3zD3ESlsAFLoLypHqjEZWHvSkknOdoYk09xoTEmHwjblnibPKScDGAepMicR4CqwN0MicIWIqwxxqS1yzqJdichbZLy8icn3POEb94rZhEHE/0",
      remark: "",
      onlinestatus: 1,
      unreadmsgcnt: 0,
      notthroughcount: 0
    }, {
      personalid: 9658,
      wechatid: "wxid_xin84739fdfhd089",
      wechatno: "",
      nickname: "爱河中划船",
      headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/KhHc3zD3ESlsAFLoLypHqjEZWHvSkknOdoYk09xoTEmHwjblnibPKScDGAepMicR4CqwN0MicIWIqwxxqS1yzqJdichbZLy8icn3POEb94rZhEHE/0",
      remark: "",
      onlinestatus: 0,
      unreadmsgcnt: 0,
      notthroughcount: 0
    } ];
    let wechatInfo = _wechats.find( item => item.personalid === personalid );
    if ( !wechatInfo ) {
      throw Error( "- 调用Api接口，获取个人号：" + personalid + ",失败~" );
    }
    let { wechatid } = wechatInfo;
    let wechat = this.getWechat( personalid, wechatid );
    wechat.setExtraInfo( wechatInfo );
  }
}