import Mock from "mockjs";
import Logging from './logging';

import WechatFactory from '../model/wechat';
import FriendFatory from '../model/friend';

import "../utils/helper";

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

  static generateFriend(){
    let personalid = WechatFactory.getWechats().map(item => item.personalid).getRdItem();
    let nickname = rd.cname();

    return Mock.mock({
      personalid: personalid,

      "wechatid": /wxid_[0-9A-Za-z]{14}/,
      "wechatno": /[0-9A-Za-z]{4,11}/,
      nickname: nickname,
      headimgurl: rd.image("120x120", "#894FC4", "#FFF", "png", nickname),
      remark: rd.cparagraph(),

      friendsid: rd.increment(1001),
      groupid: 0,
      "sex|0-2":1 ,
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
}

export default class GeneratorFactory {
  static generateWechat(num) {
    Logging.info("- generateWechat: " + num);
    let wechatInfos = Array.from({ length: num }, () =>
      Generator.generateWechat()
    );
    Logging.info(wechatInfos);
    wechatInfos.forEach(item =>{
      let {personalid, wechatid} = item;
      let wechat = WechatFactory.getWechat(personalid, wechatid);
      wechat.setExtraInfo(item);
    });
  }
  static generateFriend(num) {
    Logging.info("- generateFriend: " + num);
    let friends = Array.from({ length: num }, () =>
      Generator.generateFriend()
    );
    Logging.info(friends);
    friends.forEach(item =>{
      let {friendsid, wechatid} = item;
      let friend = FriendFatory.getFriend(friendsid, wechatid);
      friend.setExtraInfo(item);
    });
  }
}
