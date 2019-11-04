import Vue from 'vue';
import { ExtraInfo, ExtraInfoMixin } from "./wechatInfo";
import SubordinatorMixin from "./subordinate";

import constants from "../utils/constants";
import Logging from '../api/logging';

const friendLog = Logging.getLogger( 'friend' );
const __changetype__ = constants.CHANGETYPE;

export class Friend extends SubordinatorMixin( ExtraInfoMixin( ExtraInfo ) ) {
  constructor( friendid, wechatid ) {
    super();
    this.friendid = friendid;
    this.wechatInfoKey = wechatid;
    this.messageunreadcount = 0;
    this.setAttributes( Friend.attributes );
  }
  setExtraInfo( extraInfo ) {
    this.getWechatInfo().setExtraInfo( extraInfo );
    super.setExtraInfo( extraInfo );
    this.checkSubordinatorNew();
    this.establishSubordinate();
  }
  onFriendInfoChangedHandle( changetype ) {
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
        friendLog.warn( "未能处理该好友操作类型：" + changetype );
        break;
    }
  }

  remove() { FriendFatory.delete( this.friendid ); }
  identity() { return this.friendid; }
}
Friend.attributes = [ "personalid", "friendsid", "groupid", "sex", "mobile", "country", "provice", "city", "taglist", "datastatus", "attributioncustomer", "prevattribution", "prevcustomer", "messageunreadcount" ];

export default class FriendFatory {
  static checkFriendNew( friendid ) {
    const self = this;
    if ( !FriendFlyweightFatory.hasFriend( friendid ) ) {
      self.getFriendByApi( friendid );
    }
  }
  static getFriendsByFriendIds( friendids = [] ) {
    const self = this;
    let friends = FriendFlyweightFatory.getFriends();
    return friendids.reduce( ( ret, friendid ) => ret.concat( [ friends[ friendid ] ] ), [] );
  }
  static delete( friendid ) {
    const self = this;
    let friends = FriendFlyweightFatory.getFriends();
    if ( friends.hasFriend( friendid ) ) {
      delete friends[ friendid ];
    }
  }
  static getFriendByApi( friendid ) {
    let friendInfo = FriendFlyweightFatory.getFriend( friendid );
    if ( !friendInfo ) {
      friendLog.error( "- 调用Api接口，获取好友：" + friendid + ",失败~" );
    }
    // friendLog.info( "- 调用Api接口，获取好友：" + friendid, friendInfo );
    let { wechatid } = friendInfo;
    let friend = FriendFlyweightFatory.getFriend( friendid, wechatid );
    friend.setExtraInfo( friendInfo );
  }
}

export class FriendFlyweightFatory {
  static getFriend( friendid, wechatid ) {
    const self = this;
    let friends = self.getFriends();
    if ( self.hasFriend( friendid ) ) {
      return friends[ friendid ];
    } else {
      let friend = new Friend( friendid, wechatid );
      friends[ friendid ] = friend;
      return friend;
    }
  }
  static hasFriend( friendid ) {
    const self = this;
    let friends = self.getFriends();
    return Object.keys( friends ).includes( String( friendid ) );
  }
  static getFriends() { return this.getInstance().friends; }
  static getInstance() {
    const ctor = this;
    return ( function () {
      if ( !ctor.instance ) {
        ctor.instance = new ctor();
        ctor.instance.friends = {};
      }
      return ctor.instance;
    } )();
  }
}