import WechatFactory from "../model/wechat";
import FriendFatory from "../model/friend";

let result = {
  Result: {
    itemlist: [
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
      }
    ],
    pageindex: 1,
    totalpage: 1
  },
  Status: 1,
  Code: "1000",
  Message: "成功"
};

let itemlist = result["Result"]["itemlist"];
for (let i = 0; i < itemlist.length; i++) {
  let friendInfo = itemlist[i];
  let { personalid, friendsid, wechatid } = friendInfo;
  let wechat;
  if (WechatFactory.getWechatIndex(personalid) <= -1) {
    console.warn("该个人号不存在，需新增：", personalid);
    let wechatInfo = _wechats.find(item => item.personalid === personalid),
      _wechat;
    if (wechatInfo) {
      let { wechatid } = wechatInfo;
      _wechat = WechatFactory.getWechat(personalid, wechatid);
      _wechat.setExtraInfo(wechatInfo);
    }
    console.log("个人号添加后的个数： " + WechatFactory.getWechats().length);
  }
  let friend = FriendFatory.getFriend(friendsid, wechatid);
  friend.setExtraInfo(friendInfo);

  wechat = WechatFactory.getWechat(personalid, wechatid);
  wechat.addFriendId(friendsid);
  let friendList = wechat.getFriendList();
  console.log("[ " + wechat.personalid + " ]的好友数：" + friendList.length, friendList);
}

let friends = FriendFatory.getFriends();
console.log("好友的个数：" + friends.size, friends);
