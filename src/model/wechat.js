import ExtraInfo from "./extraInfo";
import WechatInfoFlyweightFactory from "./wechatInfo";
import FriendFatory, { Friend } from "./friend";
import ChatroomFactory, { Chatroom } from "./chatroom";
import { RecentFlyweightFactory, Recent } from "./recent";

import Logging from '../api/logging';

const wechatLog = Logging.getLogger('wechat');

export class Wechat extends ExtraInfo {
  constructor(personalid, wechatid) {
    super();
    this.personalid = personalid;
    this.wechatInfo = WechatInfoFlyweightFactory.getWechatInfo(wechatid);
    this.friendIds = new Set();
    this.chatroomIds = new Set();
    this.uniqKeys = new Set();
    this.setAttributes(Wechat.attributes);
  }
  setExtraInfo(extraInfo) {
    this.wechatInfo.setExtraInfo(extraInfo);
    super.setExtraInfo(extraInfo);
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
  setOnlineStatus(onlinestatus) {
    this.onlinestatus = onlinestatus;
  }
  setUnreadmsgcnt(unreadmsgcnt) {
    this.unreadmsgcnt = unreadmsgcnt || 0;
  }
  setNotthroughcount(notthroughcount) {
    this.notthroughcount = notthroughcount;
  }

  getOnlineStatus() {
    let onlinestatus = this.onlinestatus;
    // return findValueByKey(__online_status__, onlinestatus);
  }

  calcUnreadmsgcntByRecent(recent) {
    if (recent) {
      let unreadmsgcnt = this.unreadmsgcnt + recent.unreadmsgcount;
      if (unreadmsgcnt <= 0) unreadmsgcnt = 0;
      this.setUnreadmsgcount(unreadmsgcnt);
    }
  }
  calcUnreadmsgcntBySelf(unreadmsgcnt) {
    if (this.unreadmsgcnt) {
      this.unreadmsgcnt += unreadmsgcnt;
    }
  }
  resetUnreadmsgcnt() {
    this.unreadmsgcnt = 0;
  }

  calcNotthroughcountBySelf(notthroughcount) {
    if (this.notthroughcount) {
      this.notthroughcount += notthroughcount;
    }
  }
  resetNotthroughcount() {
    this.notthroughcount = 0;
  }

  checkAvaliable() {
    let friendAndChatroom = Array.from(this.friendIds).concat([...this.chatroomIds]);
    console.log("- checkAvaliable: " + this.personalid, friendAndChatroom.length);
    if (friendAndChatroom.length > 0) {
      return true;
    } else {
      this.remove();
      return false;
    }
  }

  remove() {
    WechatFactory.delete(this.personalid);
  }

  getSubordinate(clazz) {
    if (clazz instanceof Friend) {
      return this.friendIds;
    } else if (clazz instanceof Chatroom) {
      return this.chatroomIds;
    } else if (clazz instanceof Recent) {
      return this.uniqKeys;
    }
  }
  establish(identity, clazz) {
    const self = this;
    let subordinate = self.getSubordinate(clazz);
    if (!subordinate.has(identity)) {
      subordinate.add(identity);
    }
  }
  relieve(identity, clazz) {
    const self = this;
    let subordinate = self.getSubordinate(clazz);
    if (subordinate.has(identity)) {
      subordinate.delete(identity);
    }
  }
  clear(clazz) {
    const self = this;
    let subordinate = self.getSubordinate(clazz);
    subordinate.clear();
  }

  getFriendList() {
    let friendIds = [...this.friendIds];
    return FriendFatory.getFriendsByFriendIds(friendIds);
  }
  getChatroomList() {
    let chatroomIds = [...this.chatroomIds];
    return ChatroomFactory.getChatroomsByClusterIds(chatroomIds);
  }
  getRecentList() {
    let uniqKeys = [...this.uniqKeys];
    return RecentFlyweightFactory.getRecentListByUniqKeys(uniqKeys);
  }
  toString() {
    const self = this;
    let { personalid } = self;
    wechatLog.info("个人号：" + personalid + ",好友：" + self.getFriendList().length + ",群：" + self.getChatroomList().length + ",最近联系人：" + self.getRecentList().length);
  }
}
Wechat.attributes = ["personalid", "onlinestatus", "notthroughcount"];

export default class WechatFactory {
  static getWechat(personalid, wechatid) {
    const self = this;
    let wechats = self.getWechats(),
      index = self.getWechatIndex(personalid);
    if (index > -1) {
      return wechats[index];
    } else {
      let wechat = new Wechat(personalid, wechatid);
      wechats.push(wechat);
      return wechat;
    }
  }
  static checkWechatNew(personalid) {
    const self = this;
    let index = self.getWechatIndex(personalid);
    if (index <= -1) {
      self.getWechatByApi(personalid);
    }
  }
  static getFristWechat() {
    const self = this;
    let wechats = self.getWechats();
    return wechats && wechats.length > 0 ? wechats[0] : null;
  }
  static delete(personalid) {
    const self = this;
    let index = self.getWechatIndex(personalid);
    console.log("- delete:" + personalid, index);
    if (index > -1) {
      let wechats = self.getWechats();
      wechats.splice(index, 1);
    } else {
      throw Error("删除个人号不存在：" + personalid, index);
    }
  }
  static getWechatIndex(personalid) {
    const self = this;
    let wechats = self.getWechats();
    if (!wechats || wechats.length <= 0) return -1;
    if (wechats && wechats.length > 0) {
      return wechats.findIndex(item => item.personalid === personalid);
    }
    return -1;
  }
  static getWechats() {
    return this.getInstance().wechats;
  }
  static getInstance() {
    const ctor = this;
    return (function() {
      if (!ctor.instance) {
        ctor.instance = new ctor();
        ctor.instance.wechats = [];
      }
      return ctor.instance;
    })();
  }
  static getWechatByApi(personalid) {
    console.log("- 调用Api接口，获取个人号：" + personalid);
    let _wechats = [
      {
        personalid: 9661,
        wechatid: "wxid_2tvf9y1ndag622",
        wechatno: "wg18601",
        nickname: "乌云125",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/ZedicGuxtb6ISND1u5Jnx3AmUIbJy7pjC6NgUs1mbibibVg4zDYGoUvaAdPv1NUd6PCDTFxqD4icN6icNYT1kVmD0ySSHHmTMSVvsrvgic4hRNB3s/0",
        remark: "",
        onlinestatus: 1
      },
      {
        personalid: 9658,
        wechatid: "wxid_peib914d9kw222",
        wechatno: "",
        nickname: "爱拼不会赢1",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/KhHc3zD3ESlsAFLoLypHqjEZWHvSkknOdoYk09xoTEmHwjblnibPKScDGAepMicR4CqwN0MicIWIqwxxqS1yzqJdichbZLy8icn3POEb94rZhEHE/0",
        remark: "",
        onlinestatus: 1
      }
    ];
    let wechatInfo = _wechats.find(item => item.personalid === personalid);
    if (!wechatInfo) {
      throw Error("- 调用Api接口，获取个人号：" + personalid + ",失败~");
    }
    let { wechatid } = wechatInfo;
    let wechat = this.getWechat(personalid, wechatid);
    wechat.setExtraInfo(wechatInfo);
  }
}
