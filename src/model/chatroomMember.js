import WechatInfoFlyweightFactory, { WechatInfo } from "./wechatInfo";
import SubordinatorMixin from "./subordinate";

export class ChatroomMember extends SubordinatorMixin(WechatInfo){
  constructor (memberid, wechatid) {
    super();
    this.memberid = memberid;
    this.wechatid = wechatid;
    this.wechatInfo = WechatInfoFlyweightFactory.getWechatInfo(wechatid);
    this.setAttributes(ChatroomMember.attributes);
  }
  setExtraInfo(extraInfo) {
    this.wechatInfo.setExtraInfo(extraInfo);
    super.setExtraInfo(extraInfo);
    this.establishSubordinate();
  }
  getExtraInfoByKey(key) {
    if (!this.attributes.has(key)) {
      return this.wechatInfo.getExtraInfoByKey(key);
    } else {
      return super.getExtraInfoByKey(key);
    }
  }
  setExtraInfoByKey(key, val) {
    if (!this.attributes.has(key)) {
      return this.wechatInfo.setExtraInfoByKey(key, val);
    } else {
      return super.setExtraInfoByKey(key, val);
    }
  }
  identity() {
    return this.memberid;
  }
}

ChatroomMember.attributes = ['clusterid', 'wechatid', 'wechatno', 'nickname', 'headimgurl', 'remark', 'friendstatus', 'friendId', 'status', 'isassignuser', 'isfriend']