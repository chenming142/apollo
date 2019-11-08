import { ExtraInfo, ExtraInfoMixin, WechatInfoFlyweightFactory } from "./wechatInfo";
import SubordinatorMixin from "./subordinate";

export class ChatroomMember extends SubordinatorMixin( ExtraInfoMixin( ExtraInfo ) ) {
  constructor( memberid, wechatid ) {
    super();
    this.memberid = memberid;
    this.wechatid = wechatid;
    this.wechatInfoKey = wechatid;
    this.setAttributes( ChatroomMember.attributes );
  }
  setExtraInfo( extraInfo ) {
    this.getWechatInfo().setExtraInfo( extraInfo );
    super.setExtraInfo( extraInfo );
    this.establishSubordinate();
  }

  identity() {
    return this.memberid;
  }
}

export default class ChatroomMemberFactory {
  static getChatroomMemberlistByApi( clusterid ) {
    chatroomLog.info( "- 调用Api接口，获取群成员列表：" + clusterid );
  }
}

export class ChatroomMemberFlyweightFactory {
  static getChatroomMember( memberid, wechatid ) {
    const self = this;
    let chatroomMembers = self.getChatroomMembers();
    if ( self.hasChatroomMember( memberid ) ) {
      return chatroomMembers[ memberid ];
    } else {
      let chatroomMember = new ChatroomMember( memberid, wechatid );
      //TODO: Vue.set() ?
      chatroomMembers[ memberid ] = chatroomMember;
      return chatroomMember;
    }
  }
  static hasChatroomMember( memberid ) {
    const self = this;
    let chatroomMembers = self.getChatroomMembers();
    return Object.keys( chatroomMembers ).includes( String( memberid ) );
  }
  static getchatroomMemberSize() { return Object.keys( this.getChatroomMembers() ).length; }
  static getChatroomMembers() { return this.getInstance().chatroomMembers; }
  static getInstance() {
    const ctor = this;
    return ( function () {
      if ( !ctor.instance ) {
        ctor.instance = new ctor();
        ctor.instance.chatroomMembers = {};
      }
      return ctor.instance;
    } )();
  }
}

ChatroomMember.attributes = [ 'clusterid', 'wechatid', 'wechatno', 'nickname', 'headimgurl', 'remark', 'friendstatus', 'friendId', 'status', 'isassignuser', 'isfriend' ]