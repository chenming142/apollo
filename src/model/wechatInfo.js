import ExtraInfo from "./extraInfo";

export class WechatInfo extends ExtraInfo {
  constructor(wechatid) {
    super();
    this.wechatid = wechatid;
    this.setAttributes(WechatInfo.attributes);
  }
}
WechatInfo.attributes = ["wechatid", "wechatno", "nickname", "headimgurl", "remark"];

export default class WechatInfoFlyweightFactory {
  static getWechatInfo(wechatid) {
    const self = this;
    let wechatInfos = self.getWechatInfos(),
      wechatInfo;
    if (wechatInfos.has(wechatid)) {
      wechatInfo = wechatInfos.get(wechatid);
      return wechatInfo;
    } else {
      let wechatInfo = new WechatInfo(wechatid);
      wechatInfos.set(wechatid, wechatInfo);
      return wechatInfo;
    }
  }
  static getWechatInfosSize() {
    return this.getWechatInfos().size;
  }
  static getWechatInfos() {
    return this.getInstance().wechatInfos;
  }
  static getInstance() {
    const ctor = this;
    return (function() {
      if (!ctor.instance) {
        ctor.instance = new ctor();
        ctor.instance.wechatInfos = new Map();
      }
      return ctor.instance;
    })();
  }
}

// console.log("--- WechatInfo");
// console.log(WechatInfo.prototype);
