import WechatFactory from "./wechat";

export default function SubordinateMixin(Base) {
  return class SubordinateWechat extends Base {
    constructor(...args) {
      super(...args);
    }
    checkSubordinateWechatNew() {
      let { personalid } = this;
      // console.log("- checkSubordinateWechatNew: " + personalid);
      WechatFactory.checkWechatNew(personalid);
    }
    checkSubordinateWechatAvaliable() {
      let wechat = this.findSubordinateWechat();
      if (wechat) return wechat.checkAvaliable();
      return false;
    }
    findSubordinateWechat() {
      let { personalid } = this;
      let wechat = WechatFactory.getWechat(personalid);
      if (wechat) {
        return wechat;
      } else {
        throw Error("好友归属的个人号已不存在了", personalid);
      }
    }
    establishSubordinate() {
      let wechat = this.findSubordinateWechat();
      if (wechat) {
        wechat.establish(this.identity(), this);
      }
    }
    relieveSubordinate() {
      let wechat = this.findSubordinateWechat();
      if (wechat) {
        wechat.relieve(this.identity(), this);
      }
    }
  };
}
