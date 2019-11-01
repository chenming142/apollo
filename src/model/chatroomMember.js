import { ExtraInfo, ExtraInfoMixin, WechatInfoFlyweightFactory } from "./wechatInfo";
import SubordinatorMixin from "./subordinate";

export class ChatroomMember extends SubordinatorMixin( ExtraInfoMixin( ExtraInfo ) ) {
  constructor( memberid, wechatid ) {
    super();
    this.memberid = memberid;
    this.wechatid = wechatid;
    this.wechatInfo = WechatInfoFlyweightFactory.getWechatInfo( wechatid );
    this.setAttributes( ChatroomMember.attributes );
  }
  setExtraInfo( extraInfo ) {
    this.wechatInfo.setExtraInfo( extraInfo );
    super.setExtraInfo( extraInfo );
    this.establishSubordinate();
  }

  identity() {
    return this.memberid;
  }
}

ChatroomMember.attributes = [ 'clusterid', 'wechatid', 'wechatno', 'nickname', 'headimgurl', 'remark', 'friendstatus', 'friendId', 'status', 'isassignuser', 'isfriend' ]