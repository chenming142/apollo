import ExtraInfo from "./extraInfo";
import WechatInfoFlyweightFactory from "./wechatInfo";
import SubordinateMixin from "./subordinate";

export class Friend extends SubordinateMixin(ExtraInfo) {
  constructor(friendid, wechatid) {
    super();
    this.friendid = friendid;
    this.wechatInfo = WechatInfoFlyweightFactory.getWechatInfo(wechatid);
    this.setAttributes(Friend.attributes);
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
  remove() {
    FriendFatory.delete(this.friendid);
  }
  identity() {
    return this.friendid;
  }
}
Friend.attributes = ["personalid", "friendsid", "groupid", "sex", "mobile", "country", "provice", "city", "taglist", "datastatus", "attributioncustomer", "prevattribution", "prevcustomer", "messageunreadcount"];

export default class FriendFatory {
  static getFriend(friendid, wechatid) {
    const self = this;
    let friends = self.getFriends();
    if (friends.has(friendid)) {
      return friends.get(friendid);
    } else {
      let friend = new Friend(friendid, wechatid);
      friends.set(friendid, friend);
      return friend;
    }
  }
  static checkFriendNew(friendid) {
    const self = this;
    if (!self.getFriends().has(friendid)) {
      self.getFriendByApi(friendid);
    }
  }
  static getFriendsByFriendIds(friendids = []) {
    const self = this;
    let friends = self.getFriends();
    return friendids.reduce((ret, friendid) => ret.concat([friends.get(friendid)]), []);
  }
  static delete(friendid) {
    const self = this;
    let friends = self.getFriends();
    if (friends.has(friendid)) {
      friends.delete(friendid);
    }
  }
  static getFriends() {
    return this.getInstance().friends;
  }
  static getInstance() {
    const ctor = this;
    return (function() {
      if (!ctor.instance) {
        ctor.instance = new ctor();
        ctor.instance.friends = new Map();
      }
      return ctor.instance;
    })();
  }
  static getFriendByApi(friendid) {
    console.log("- 调用Api接口，获取好友：" + friendid);
    let friendList = [
      {
        personalid: 9658,
        friendsid: 2636,
        groupid: 0,
        wechatid: "wxid_ufm3l8mywndo22",
        wechatno: "",
        nickname: "四狗",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/xAYCQIfIiaaLcJp1k293RpbEmKXhWMpDqeEYo9VjpiaFU6AX4sXe0LKicEZkNRW0TriawdWX39hzIQNIdpDCbWgxFUs5wIS0hZFEa1icQHRVm2XI/0",
        remark: "sigoo00",
        sex: 2,
        mobile: "",
        country: "",
        provice: "广东",
        city: "",
        taglist: [],
        datastatus: 2,
        attributioncustomer: null,
        prevattribution: null,
        prevcustomer: null
      },
      {
        personalid: 9658,
        friendsid: 2614,
        groupid: 0,
        wechatid: "wxid_5kh88cpn8ez322",
        wechatno: "liq_test",
        nickname: "无处可逃uu让",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/YXaZpbXWFiazbg87rAbYlI0XIrge3aTyYACXQLnibsBHCbuic43TGWPUXHjJzM4yDsOUAQ9tPJ8pFghEBBRUsZ9ds4RydgeKFM0LNfsgVeRdKM/0",
        remark: "",
        sex: 1,
        mobile: "",
        country: "",
        provice: "阿尔及利亚",
        city: "",
        taglist: [],
        datastatus: 2,
        attributioncustomer: null,
        prevattribution: null,
        prevcustomer: null
      },
      {
        personalid: 9661,
        friendsid: 1905,
        groupid: 46,
        wechatid: "wxid_9xfnrod59kkj22",
        wechatno: "chenming142",
        nickname: "MC",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/JEwkcjoceWMbXrKpWrAicJw7gbpNCWyPoNQbZ2wd3vtPuKarvMoZIQ8Ntm1M1ygttm8rjP7RPn2NYoFy8myLN7at8QLALWrBZfzVHicmdI2icc/0",
        remark: "陈明xxxxxxxxx",
        sex: 1,
        mobile: "",
        country: "",
        provice: "广东",
        city: "广州",
        taglist: [
          {
            tagname: "测试只有利群",
            friendid: 1905,
            tagid: 984
          },
          {
            tagname: "壹豆的测试同事",
            friendid: 1905,
            tagid: 981
          },
          {
            tagname: "蔡文姬2",
            friendid: 1905,
            tagid: 1002
          },
          {
            tagname: "淘宝",
            friendid: 1905,
            tagid: 1009
          },
          {
            tagname: "阿波罗",
            friendid: 1905,
            tagid: 960
          },
          {
            tagname: "月球小队",
            friendid: 1905,
            tagid: 959
          },
          {
            tagname: "蔡文姬1",
            friendid: 1905,
            tagid: 1001
          },
          {
            tagname: "蔡文姬3",
            friendid: 1905,
            tagid: 1003
          },
          {
            tagname: "蔡文姬4",
            friendid: 1905,
            tagid: 1004
          },
          {
            tagname: "测试7894565656",
            friendid: 1905,
            tagid: 2378
          },
          {
            tagname: "足球小子",
            friendid: 1905,
            tagid: 2558
          }
        ],
        datastatus: 2,
        attributioncustomer: null,
        prevattribution: null,
        prevcustomer: "17817791952(17817791952)"
      },
      {
        personalid: 9661,
        friendsid: 651098,
        groupid: 46,
        wechatid: "wxid_efhd7m6h6jhv22",
        wechatno: "mingc",
        nickname: "明城",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/krcM2NoEV3vsk9MEVNGIQU72wiczTh5UdYZ6Dy21AjAxoZGnLLkibQHGsiaHU9xc6OxV0e9GC7Iaoc45BnFdw68azkkKCPgGgQw4ian3Pjs7540/0",
        remark: "",
        sex: 1,
        mobile: "",
        country: "",
        provice: "广东",
        city: "广州",
        taglist: [],
        datastatus: 2,
        attributioncustomer: null,
        prevattribution: null,
        prevcustomer: "17817791952(17817791952)"
      }
    ];
    let friendInfo = friendList.find(item => item.friendsid === friendid);
    if (!friendInfo) {
      throw Error("- 调用Api接口，获取好友：" + friendid + ",失败~");
    }
    let { wechatid } = friendInfo;
    let friend = this.getFriend(friendid, wechatid);
    friend.setExtraInfo(friendInfo);
  }
}
