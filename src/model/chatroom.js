import ExtraInfo from "./extraInfo";
import WechatInfoFlyweightFactory from "./wechatInfo";
import SubordinateMixin from "./subordinate";

export class Chatroom extends SubordinateMixin(ExtraInfo) {
  constructor(clusterid, wxchatroomid) {
    super();
    this.clusterid = clusterid;
    this.wxchatroomid = wxchatroomid;
    this.wechatInfo = WechatInfoFlyweightFactory.getWechatInfo(wxchatroomid);
    this.setAttributes(Chatroom.attributes);
  }
  setExtraInfo(extraInfo) {
    this.wechatInfo.setExtraInfo(extraInfo);
    super.setExtraInfo(extraInfo);
    this.checkSubordinateWechatNew();
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
  getNickname(){
    return this.getExtraInfoByKey('clustername');
  }
  getWechatid(){
    return this.getExtraInfoByKey('wxchatroomid');
  }
  getHeadimgurl(){
    return this.getExtraInfoByKey('headimgurl');
  }
  getWechatno(){
    return this.getExtraInfoByKey('wxchatroomid');
  }

  remove() {
    ChatroomFactory.delete(this.clusterid);
  }
  identity() {
    return this.clusterid;
  }
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
  "datastatus",
  "ownerallowflag",
  "messageunreadcount",
  "userid",
  "merchantid",
  "ismanager"
];

export default class ChatroomFactory {
  static getChatroom(clusterid, wxchatroomid) {
    const self = this;
    let chatrooms = self.getChatrooms();
    if (chatrooms.has(clusterid)) {
      return chatrooms.get(clusterid);
    } else {
      let chatroom = new Chatroom(clusterid, wxchatroomid);
      chatrooms.set(clusterid, chatroom);
      return chatroom;
    }
  }
  static checkChatroomNew(clusterid) {
    const self = this;
    if (!self.getChatrooms().has(clusterid)) {
      self.getChatroomByApi(clusterid);
    }
  }
  static getChatroomsByClusterIds(clusterIds = []) {
    const self = this;
    let chatrooms = self.getChatrooms();
    return clusterIds.reduce((ret, clusterId) => ret.concat([chatrooms.get(clusterId)]), []);
  }
  delete(clusterId) {
    const self = this;
    let chatrooms = self.getChatrooms();
    if (chatrooms.has(clusterId)) {
      chatrooms.delete(clusterId);
    }
  }
  static getChatrooms() {
    return this.getInstance().chatrooms;
  }
  static getInstance() {
    const ctor = this;
    return (function() {
      if (!ctor.instance) {
        ctor.instance = new ctor();
        ctor.instance.chatrooms = new Map();
      }
      return ctor.instance;
    })();
  }
  static getChatroomByApi(clusterid) {
    console.log("- 调用Api接口，获取好友：" + clusterid);
    let chatroomList = [
      {
        personalid: 9661,
        clusterid: 38891,
        groupid: 0,
        wxchatroomid: "22615851297@chatroom",
        clustername: "016",
        headimgurl: "http://wx.qlogo.cn/mmcrhead/6OXnmZ7zcgfnxeeiaGuiaJC93XfARZ7FaZTRLoywTqrTxpmAux6xTFEicv4unkcrhVnCjPzl1F2YGJ6AFDFEAs2wiboL5hZulIR8/0",
        remark: "",
        isowner: 1,
        ownerwechatid: "wxid_2tvf9y1ndag622",
        isreturnname: 0,
        returnname: "",
        membercount: 4,
        datastatus: 2,
        ownerallowflag: 0
      },
      {
        personalid: 9661,
        clusterid: 38976,
        groupid: 0,
        wxchatroomid: "22431750377@chatroom",
        clustername: "555555555",
        headimgurl: "http://wx.qlogo.cn/mmcrhead/oyG9nzLg9aKj5WxDZTeqktjq3l82kw1B3rDp9ny8HHH9ic5eEzAicUmP1YdzY7jH8lVorRlGeibfHrrmFW17A9PmKbgpCS7wBt2/0",
        remark: "",
        isowner: 1,
        ownerwechatid: "wxid_2tvf9y1ndag622",
        isreturnname: 0,
        returnname: "",
        membercount: 6,
        datastatus: 2,
        ownerallowflag: 0
      }
    ];
    let chatroomInfo = chatroomList.find(item => item.clusterid === clusterid);
    if (!chatroomInfo) {
      throw Error("- 调用Api接口，获取群：" + clusterid + ",失败~");
    }
    let { wxchatroomid } = chatroomInfo;
    let chatroom = this.getChatroom(clusterid, wxchatroomid);
    chatroom.setExtraInfo(chatroomInfo);
  }
}
