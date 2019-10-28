import Mock from "mockjs";
import Logging from './logging';

import WechatFactory from '../model/wechat';
import FriendFatory from '../model/friend';
import ChatroomFactory from '../model/chatroom';
import RecentFactory from '../model/recent';


import {
  generateRdNum
} from "../utils/helper";
import constants from '../utils/constants';

const __chattargettype__ = constants.CHAT_TARGET_TYPE;

const rd = Mock.Random;

export class Generator {
  static generateWechat() {
    let nickname = rd.cname();
    return Mock.mock({
      personalid: rd.increment(9661),
      "wechatid|1": /wxid_[0-9A-Za-z]{14}/,
      "wechatno|1": /[0-9A-Za-z]{4,11}/,
      nickname: nickname,
      headimgurl: rd.image("120x120", "#894FC4", "#FFF", "png", nickname),
      remark: rd.cparagraph(),
      "onlinestatus|0-1": 1
    });
  }

  static generateFriend() {
    let personalid = WechatFactory.getWechats().map(item => item.personalid).getRdItem();
    let nickname = rd.cname();

    return Mock.mock({
      personalid: personalid,
      friendsid: rd.increment(1001),
      "wechatid": /wxid_[0-9A-Za-z]{14}/,
      "wechatno": /[0-9A-Za-z]{4,11}/,
      nickname: nickname,
      headimgurl: rd.image("120x120", "#894FC4", "#FFF", "png", nickname),
      remark: rd.cparagraph(),
      groupid: 0,
      "sex|0-2": 1,
      mobile: "",
      country: "",
      provice: rd.province(),
      city: rd.city(),
      taglist: [],
      "datastatus|1-2": 1,
      attributioncustomer: null,
      prevattribution: null,
      prevcustomer: null
    });
  }

  static generateChatroom() {
    let personalid = WechatFactory.getWechats().map(item => item.personalid).getRdItem();
    let clustername = rd.cword(3, 10);

    return Mock.mock({
      personalid: personalid,
      clusterid: rd.increment(30001),
      groupid: 0,
      "wxchatroomid": /[1-9][0-9]{10}@chatroom/,
      clustername: clustername,
      headimgurl: rd.image("120x120", "#894FC4", "#FFF", "png", clustername),
      remark: "",
      isowner: 1,
      ownerwechatid: "wxid_2tvf9y1ndag622",
      "isreturnname|0-1": 1,
      returnname: rd.cword(3, 10),
      "membercount|1-20": 1,
      "datastatus|1-2": 1,
      "ownerallowflag|0-1": 1
    });
  }

  static generateRecent() {
    let chattargettype = generateRdNum(1, 2);

    let chattargets = chattargettype == __chattargettype__.friend ?
      FriendFatory.getFriends() :
      ChatroomFactory.getChatrooms();
    let chattargetids = [...chattargets].map(item => item[0]);

    let chattargetid = chattargetids.getRdItem();
    let chattarget = chattargets.get(chattargetid);
    console.log('- 1.generateRecent.chattarget:{chattargettype: ' + chattargettype + ', chattargetid: ' + chattargetid + '} ');

    let nickname = chattarget.getNickname(),
      wechatid = chattarget.getWechatid(),
      headimgurl = chattarget.getHeadimgurl();
    console.log('- 2.generateRecent.chattarget:{nickname: ' + nickname + ', wechatid: ' + wechatid + ', headimgurl:' + headimgurl + '}');
    console.log('')
    return Mock.mock({
      personalid: chattarget['personalid'],
      chattargettype: chattargettype,
      chattargetid: chattargetid,
      wechatid: wechatid,
      nickname: nickname,
      headimgurl: headimgurl,
      remark: chattarget['remark'],
      "stick|0-1": 1,
      "unreadmsgcount|1-20": 1,
      lastmsg: null,
      /*{ issend: 0, locmsgid: "15719712905370006", msgtype: 50001, content: "admin 将此好友从 系统 转接给 13800000000(admin)", createtimestamp: 1571971290537 }*/
      "datastatus|1-2": 1,
      "disturbsetting|1-2": 1,
    });
  }
}

export default class GeneratorFactory {
  static generateWechat(num) {
    Logging.info("- generateWechat: " + num);
    let wechatInfos = Array.from({
        length: num
      }, () =>
      Generator.generateWechat()
    );
    Logging.info(wechatInfos);
    wechatInfos.forEach(item => {
      let {
        personalid,
        wechatid
      } = item;
      let wechat = WechatFactory.getWechat(personalid, wechatid);
      wechat.setExtraInfo(item);
    });
  }
  static generateFriend(num) {
    Logging.info("- generateFriend: " + num);
    let friends = Array.from({
        length: num
      }, () =>
      Generator.generateFriend()
    );
    Logging.info(friends);
    friends.forEach(item => {
      let {
        friendsid,
        wechatid
      } = item;
      let friend = FriendFatory.getFriend(friendsid, wechatid);
      friend.setExtraInfo(item);
    });
  }
  static generateChatroom(num) {
    Logging.info("- generateChatroom: " + num);
    let chatrooms = Array.from({
      length: num
    }, () => Generator.generateChatroom());
    Logging.info(chatrooms);
    chatrooms.forEach(item => {
      let {
        clusterid,
        wechatid
      } = item;
      let chatroom = ChatroomFactory.getChatroom(clusterid, wechatid);
      chatroom.setExtraInfo(item);
    });
  }
  static generateRecent(num) {
    Logging.info("- generateRecent: " + num);
    let recents = new Map();
    for (let i = 0; i < num; i++) {
      let recentInfo = Generator.generateRecent();
      let recent = RecentFactory.getRecentInstance(recentInfo);
      recent.setExtraInfo(recentInfo);
      recents.set(recent.getUniqKey(), recent);
    }
    Logging.info(recents);
  }
}