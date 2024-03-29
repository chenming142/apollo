import Mock from "mockjs";
import Logging from './logging';

import { WechatFlyweightFactory } from '../model/wechat';
import { FriendFlyweightFatory } from '../model/friend';
import { ChatroomFlyweightFactory } from '../model/chatroom';
import RecentFactory from '../model/recent';

const wechatLog = Logging.getLogger( 'wechat' );
const chatroomLog = Logging.getLogger( 'chatroom' );
const friendLog = Logging.getLogger( 'friend' );
const recentLog = Logging.getLogger( 'recent' );

import { generateRdNum } from "../utils/helper";
import constants from '../utils/constants';

const __chattargettype__ = constants.CHAT_TARGET_TYPE;

const rd = Mock.Random;

export class Generator {
  static generateWechat() {
    let nickname = rd.cname();
    return Mock.mock( {
      personalid: rd.increment( 9661 ),
      "wechatid|1": /wxid_[0-9A-Za-z]{14}/,
      "wechatno|1": /[0-9A-Za-z]{4,11}/,
      nickname: nickname,
      headimgurl: rd.image( "120x120", "#894FC4", "#FFF", "png", nickname ),
      remark: rd.cparagraph(),
      "unreadmsgcnt": 0,
      "notthroughcount": 0,
      "onlinestatus|1-3": 1
    } );
  }

  static generateFriend( personalid ) {
    personalid = personalid ? personalid : WechatFlyweightFactory.getWechats().map( item => item.personalid ).getRdItem();
    let nickname = rd.cname();

    return Mock.mock( {
      personalid: personalid,
      friendsid: rd.increment( 1001 ),
      "wechatid": /wxid_[0-9A-Za-z]{14}/,
      "wechatno": /[0-9A-Za-z]{4,11}/,
      nickname: nickname,
      headimgurl: rd.image( "120x120", "#894FC4", "#FFF", "png", nickname ),
      remark: rd.cword( 3, 8 ),
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
    } );
  }

  static generateChatroom( personalid ) {
    personalid = personalid ? personalid : WechatFlyweightFactory.getWechats().map( item => item.personalid ).getRdItem();
    let clustername = rd.cword( 3, 10 );
    let clusterid = rd.increment( 30001 );
    let membercount = rd.integer( 1, 20 );
    let memberlist = Array.from( { length: membercount }, () => Generator.generateChatroomMember( clusterid ) );

    return Mock.mock( {
      personalid: personalid,
      clusterid: clusterid,
      groupid: 0,
      "wxchatroomid": /[1-9][0-9]{10}@chatroom/,
      clustername: clustername,
      headimgurl: rd.image( "120x120", "#894FC4", "#FFF", "png", clustername ),
      remark: rd.cword( 3, 8 ),
      isowner: 1,
      ownerwechatid: "wxid_2tvf9y1ndag622",
      "isreturnname|0-1": 1,
      returnname: rd.cword( 3, 10 ),
      "membercount": membercount,
      memberlist: memberlist,
      "datastatus|1-2": 1,
      "ownerallowflag|0-1": 1
    } );
  }

  static generateRecent( personalid, chattargettype ) {
    chattargettype = chattargettype ? chattargettype : generateRdNum( 1, 2 );

    let chattargets, chattargetids, chattargetid, chattarget;
    if ( !personalid ) {
      chattargets = chattargettype == __chattargettype__.friend ? FriendFlyweightFatory.getFriends() : ChatroomFlyweightFactory.getChatrooms();
      chattargets = Object.entries( chattargets ).map( item => item[ 1 ] );
    } else {
      let wechat = WechatFlyweightFactory.getWechat( personalid );
      chattargets = chattargettype == __chattargettype__.friend ? wechat.getFriendList() : wechat.getChatroomList();
    }
    // recentLog( '类型: ' + chattargettype + ',  个人号: ' + personalid, chattargets );
    chattargetids = chattargettype == __chattargettype__.friend ?
      chattargets.map( item => item[ 'friendid' ] ) :
      chattargets.map( item => item[ 'clusterid' ] )

    chattargetid = chattargetids.getRdItem();
    // recentLog( '- generateRecent -> 生成最近联系人: 类型' + chattargettype + ', 个人号：' + personalid, chattargetid );

    chattarget = chattargettype == __chattargettype__.friend ?
      chattargets.find( item => item.friendid === chattargetid ) :
      chattargets.find( item => item.clusterid === chattargetid );

    let nickname = chattarget.getNickname(),
      wechatid = chattarget.getWechatid(),
      headimgurl = chattarget.getHeadimgurl();

    return Mock.mock( {
      personalid: chattarget[ 'personalid' ],
      chattargettype: chattargettype,
      chattargetid: chattargetid,
      wechatid: wechatid,
      nickname: nickname,
      headimgurl: headimgurl,
      remark: chattarget[ 'remark' ],
      "stick|0-1": 1,
      "unreadmsgcount|1-20": 1,
      lastmsg: null,
      /*{ issend: 0, locmsgid: "15719712905370006", msgtype: 50001, content: "admin 将此好友从 系统 转接给 13800000000(admin)", createtimestamp: 1571971290537 }*/
      "datastatus|1-2": 1,
      "disturbsetting|1-2": 1,
    } );
  }

  static generateChatroomMember( clusterid ) {
    let nickname = rd.cname();
    return Mock.mock( {
      clusterid: clusterid,
      memberid: rd.increment( 90001 ),
      friendId: rd.increment( 1001 ),
      "wechatid": /wxid_[0-9A-Za-z]{14}/,
      "wechatno": /[0-9A-Za-z]{4,11}/,
      nickname: nickname,
      headimgurl: rd.image( "120x120", "#894FC4", "#FFF", "png", nickname ),
      remark: rd.cword( 3, 8 ),
      'friendstatus|0-1': 1,
      'status|0-1': 1,
      'isassignuser|0-1': 0,
      'isfriend|0-1': 1
    } );
  }
}

export default class GeneratorFactory {
  static generateWechat( num ) {
    // wechatLog.info( "- generateWechat: " + num );
    GeneratorFactory.initQuantity[ 0 ] += num;
    let wechatInfos = Array.from( { length: num }, () => Generator.generateWechat() );
    wechatLog.info( wechatInfos );
    wechatInfos.forEach( item => {
      let { personalid, wechatid } = item;
      let wechat = WechatFlyweightFactory.getWechat( personalid, wechatid );
      wechat.setExtraInfo( item );
    } );
  }
  static generateFriend( num, personalid ) {
    //friendLog.info( "- generateFriend: " + num );
    GeneratorFactory.initQuantity[ 1 ] += num;
    let friends = Array.from( { length: num }, () => Generator.generateFriend( personalid ) );
    friendLog.info( friends );
    friends.forEach( item => {
      let { friendsid, wechatid } = item;
      let friend = FriendFlyweightFatory.getFriend( friendsid, wechatid );
      friend.setExtraInfo( item );
    } );
  }
  static generateChatroom( num, personalid ) {
    //chatroomLog.info( "- generateChatroom: " + num );
    GeneratorFactory.initQuantity[ 2 ] += num;
    let chatrooms = Array.from( { length: num }, () => Generator.generateChatroom( personalid ) );
    chatroomLog.info( chatrooms );
    chatrooms.forEach( item => {
      let { clusterid, wxchatroomid } = item;
      let chatroom = ChatroomFlyweightFactory.getChatroom( clusterid, wxchatroomid );
      chatroom.setExtraInfo( item );
    } );
  }
  static generateRecent( num, personalid, chattargettype ) {
    //recentLog.info( "- generateRecent: " + num );
    GeneratorFactory.initQuantity[ 3 ] += num;
    let recents = [];
    for ( let i = 0; i < num; i++ ) {
      let recentInfo = Generator.generateRecent( personalid, chattargettype );
      let recent = RecentFactory.getRecentInstance( recentInfo );
      recent.setExtraInfo( recentInfo );
      recents.push( recent );
    }
    recentLog.info( recents );
  }
}

GeneratorFactory.initQuantity = [ 0, 0, 0, 0 ];