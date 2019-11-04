import { ExtraInfo, ExtraInfoMixin } from "./wechatInfo";
import SubordinatorMixin, { SubordinateBehaviorMixin } from "./subordinate";

import { ChatroomMember } from './chatroomMember';
import { WechatInfoFlyweightFactory } from './wechatInfo';

import constants from "../utils/constants";
import Logging from '../api/logging';

const chatroomLog = Logging.getLogger( 'chatroom' );
const __changetype__ = constants.CHANGETYPE;

export class Chatroom extends SubordinateBehaviorMixin( SubordinatorMixin( ExtraInfoMixin( ExtraInfo ) ) ) {
  constructor( clusterid, wxchatroomid ) {
    super();
    this.clusterid = clusterid;
    this.wxchatroomid = wxchatroomid;
    this.wechatInfoKey = wxchatroomid;
    this.memberIds = [];
    this.setAttributes( Chatroom.attributes );

    //TODO: 动态重载方法
    this.getNickname = function () { return this.getExtraInfoByKey( 'clustername' ); }
    this.getWechatid = function () { return this.getExtraInfoByKey( 'wxchatroomid' ); }
  }
  setExtraInfo( extraInfo ) {
    this.getWechatInfo().setExtraInfo( extraInfo );
    super.setExtraInfo( extraInfo );
    this.checkSubordinatorNew();
    this.establishSubordinate();
    this.generateMembers();
    this.calcMessageunreadcount();
  }

  calcMessageunreadcount() {
    const self = this;
    let { changetype, messageunreadcount } = self;
    if ( messageunreadcount ) {
      let wechat = self.findSubordinator();
      switch ( changetype ) {
        case __changetype__.ADD:
          break;
        case __changetype__.MODIFY:
          //TODO: 修改如何处理 ？
          messageunreadcount = 0;
          break;
        case __changetype__.REMOVE:
          messageunreadcount *= -1;
          break;
      }
      wechat.calcUnreadmsgcnt( messageunreadcount );
    }
  }
  onChatroomInfoChangeHandle( changetype ) {
    const self = this;
    switch ( changetype ) {
      case __changetype__.ADD:
        self.establishSubordinate();
        break;
      case __changetype__.MODIFY:
        break;
      case __changetype__.REMOVE:
        self.remove();
        self.relieveSubordinate();
        self.checkSubordinatorAvaliable();
        break;
      default:
        chatroomLog.warn( "未能处理该群操作类型：" + changetype );
        break;
    }
  }

  generateMembers() {
    const self = this;
    let { clusterid, memberlist } = self;
    if ( memberlist && memberlist.length > 0 ) {
      chatroomLog.info( '- generateMembers -> 群:' + clusterid + ', 的成员有' + memberlist.length + '个' );
      memberlist.forEach( item => {
        let { memberid, wechatid } = item;
        let chatroomMember = new ChatroomMember( memberid, wechatid );
        chatroomMember.setExtraInfo( item );
      } );
    }
  }
  getMemberList() {
    let memberIds = [ ...this.memberIds ];
    return memberIds.length;
  }
  remove() { ChatroomFactory.delete( this.clusterid ); }
  identity() { return this.clusterid; }
  toString() { chatroomLog.info( "- toString -> 群：" + this.clusterid + "，的群成员数：" + this.getMemberList() ); }
}
Chatroom.attributes = [
  "changetype",
  "personalid",
  "clusterid",
  "groupid",
  "wxchatroomid",
  "clustername",
  "headimgurl",
  "remark",
  "isowner",
  "ownerwechatid",
  "ownernickname",
  "ownerheadimgurl",
  "isreturnname",
  "returnname",
  "membercount",
  "memberlist",
  "datastatus",
  "ownerallowflag",
  "messageunreadcount",
  "userid",
  "merchantid",
  "ismanager"
];

export default class ChatroomFactory {
  static checkChatroomNew( clusterid ) {
    const self = this;
    if ( !ChatroomFlyweightFactory.hasChatroom( clusterid ) ) {
      self.getChatroomByApi( clusterid );
    }
  }
  static getChatroomsByClusterIds( clusterIds = [] ) {
    const self = this;
    let chatrooms = ChatroomFlyweightFactory.getChatrooms();
    return clusterIds.reduce( ( ret, clusterId ) => ret.concat( [ chatrooms[ clusterId ] ] ), [] );
  }
  static delete( clusterId ) {
    const self = this;
    let chatrooms = ChatroomFlyweightFactory.getChatrooms();
    if ( chatrooms.hasChatroom( clusterId ) ) {
      //TODO: Vue.delete() ?
      delete chatrooms[ clusterId ];
    }
  }
  static getChatroomByApi( clusterid ) {
    chatroomLog.info( "- 调用Api接口，获取好友：" + clusterid );
    let chatroomInfo = ChatroomFlyweightFactory.getChatroom( clusterid );
    if ( !chatroomInfo ) {
      chatroomLog.error( "- 调用Api接口，获取群：" + clusterid + ",失败~" );
    }
    let { wxchatroomid } = chatroomInfo;
    let chatroom = this.getChatroom( clusterid, wxchatroomid );
    chatroom.setExtraInfo( chatroomInfo );
  }
}

export class ChatroomFlyweightFactory {
  static getChatroom( clusterid, wxchatroomid ) {
    const self = this;
    let chatrooms = self.getChatrooms();
    if ( self.hasChatroom( clusterid ) ) {
      return chatrooms[ clusterid ];
    } else {
      let chatroom = new Chatroom( clusterid, wxchatroomid );
      //TODO: Vue.set() ?
      chatrooms[ clusterid ] = chatroom;
      return chatroom;
    }
  }
  static hasChatroom( clusterid ) {
    const self = this;
    let chatrooms = self.getChatrooms();
    return Object.keys( chatrooms ).includes( String( clusterid ) );
  }
  static getChatrooms() { return this.getInstance().chatrooms; }
  static getInstance() {
    const ctor = this;
    return ( function () {
      if ( !ctor.instance ) {
        ctor.instance = new ctor();
        ctor.instance.chatrooms = {};
      }
      return ctor.instance;
    } )();
  }
}