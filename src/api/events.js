import Vue from "vue";
import constants from "../utils/constants";
import MessageFactory from "../model/message";
import FriendFatory, { FriendFlyweightFatory } from "../model/friend";
import { WechatFlyweightFactory } from "../model/wechat";
import { Chatroom, ChatroomFlyweightFactory } from '../model/chatroom';
import { WechatInfoFlyweightFactory } from '../model/wechatInfo';
import Logging from '../api/logging';
import Mock from "mockjs";

const messageLog = Logging.getLogger( 'message' );
const __events__ = constants.EVENT_BUS_EVENTS;
const __changetype__ = constants.CHANGETYPE;
let Singleton = function ( ) {};
Singleton.getInstance = ( function ( ) {
  let instance = null;
  return function ( ) {
    if ( !instance ) {
      instance = new Vue( );
    }
    return instance;
  };
} )( );
let instance = Singleton.getInstance( );
const rd = Mock.Random;

function parseSignalRMessageInfo( messageInfo ) {
  let messageData;
  try {
    messageData = JSON.parse( messageInfo );
  } catch ( error ) {
    messageData = messageInfo;
  }
  let {
    cmdtype
  } = messageData;
  if ( cmdtype === "CmdAll" ) {
    let messages = messageData[ "customerdownmsgs" ];
    messages.forEach( messageProcessHandler );
  } else {
    messageProcessHandler( messageData );
  }

  function messageProcessHandler( message ) {
    let {
      cmdtype
    } = message;
    console.log( '\n' )
    switch ( cmdtype ) {
      case "CmdNewSysMessage":
        messageLog.info( "--- receive[CmdNewSysMessage]" );
        instance.$emit( __events__.NEW_MESSAGE, message );
        break;
      case "CmdFriendInfoChanged":
        messageLog.info( "--- receive[CmdFriendInfoChanged]" );
        instance.$emit( __events__.FRIEND_INFO_CHANGED, message );
        break;
      case "CmdClusterInfoChanged":
        messageLog.info( "--- receive[CmdClusterInfoChanged]" );
        instance.$emit( __events__.CHATROOM_INFO_CHANGED, message );
        break;
      case "CmdPersonalStatusChange":
        messageLog.info( "--- receive[CmdPersonalStatusChange]" );
        instance.$emit( __events__.WECHAT_ACCOUNTS_ALIVE_STATUS, message );
        break;
      default:
        messageLog.warn( "消息事件尚未实现: " + cmdtype, message );
    }
  }
}
export function onFriendInfoChanged( ) {
  let messageInfo = {
    cmdtype: "CmdAll",
    locmsgid: null,
    personalid: 0,
    userid: 151,
    customerdownmsgs: [ {
      cmdtypecode: 0,
      userid: 0,
      cmdtype: "CmdNewSysMessage",
      locmsgid: "15719712905370006",
      personalid: 9661,
      msgtype: 10000,
      message: "",
      friendid: 651098,
      clusterid: 0,
      content: "admin 将此好友从 系统 转接给 13800000000(admin)",
      createtimestamp: 1571971290537,
      reportnum: 1,
      wechatid: "wxid_efhd7m6h6jhv22"
    }, {
      cmdtype: "CmdFriendInfoChanged",
      locmsgid: null,
      personalid: 9658,
      userid: 151,
      changetype: 1,
      friendsid: 651098,
      groupid: 0,
      nickname: "明城",
      wechatid: "wxid_efhd7m6h6jhv22",
      wechatno: "",
      mobile: null,
      headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/krcM2NoEV3vsk9MEVNGIQU72wiczTh5UdYZ6Dy21AjAxoZGnLLkibQHGsiaHU9xc6OxV0e9GC7Iaoc45BnFdw68azkkKCPgGgQw4ian3Pjs7540/0",
      sex: 0,
      country: "",
      provice: "",
      city: "",
      source: 0,
      remark: "",
      createtime: "2019-10-21T17:31:52.827044",
      friendstatus: 2,
      status: 2,
      messageunreadcount: 0,
      lastmsg: {
        locmsgid: null,
        msgtype: 0,
        content: null,
        createtimestamp: 0
      },
      datastatus: 2
    }, {
      cmdtype: "CmdFriendInfoChanged",
      personalid: 9661,
      friendsid: 1906,
      changetype: 1,
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
      taglist: [ {
        tagname: "测试只有利群",
        friendid: 1905,
        tagid: 984
      }, {
        tagname: "壹豆的测试同事",
        friendid: 1905,
        tagid: 981
      }, {
        tagname: "蔡文姬2",
        friendid: 1905,
        tagid: 1002
      }, {
        tagname: "淘宝",
        friendid: 1905,
        tagid: 1009
      }, {
        tagname: "阿波罗",
        friendid: 1905,
        tagid: 960
      }, {
        tagname: "月球小队",
        friendid: 1905,
        tagid: 959
      }, {
        tagname: "蔡文姬1",
        friendid: 1905,
        tagid: 1001
      }, {
        tagname: "蔡文姬3",
        friendid: 1905,
        tagid: 1003
      }, {
        tagname: "蔡文姬4",
        friendid: 1905,
        tagid: 1004
      }, {
        tagname: "测试7894565656",
        friendid: 1905,
        tagid: 2378
      }, {
        tagname: "足球小子",
        friendid: 1905,
        tagid: 2558
      } ],
      datastatus: 2,
      attributioncustomer: null,
      prevattribution: null,
      prevcustomer: "17817791952(17817791952)"
    } ]
  };
  parseSignalRMessageInfo( messageInfo );
}
export function onChatroomInfoChanged( ) {
  let messageInfo = {
    cmdtype: "CmdAll",
    locmsgid: null,
    personalid: 0,
    userid: 151,
    customerdownmsgs: [ {
      cmdtype: "CmdClusterInfoChanged",
      locmsgid: null,
      personalid: 9676,
      userid: 151,
      changetype: 1,
      merchantid: 0,
      clusterid: 38976,
      wxchatroomid: "22431750377@chatroom",
      isowner: 0,
      groupid: 0,
      clustername: "555555555",
      headimgurl: "http://wx.qlogo.cn/mmcrhead/oyG9nzLg9aKj5WxDZTeqktjq3l82kw1B3rDp9ny8HHH9ic5eEzAicUmP1YdzY7jH8lVorRlGeibfHrrmFW17A9PmKbgpCS7wBt2/0",
      ownerwechatid: "wxid_2tvf9y1ndag622",
      ownernickname: "",
      ownerheadimgurl: "",
      createtime: "2019-10-25T14:01:43.045088",
      memberlist: [ {
        changetype: 1,
        memberid: 1002,
        clusterid: 38976,
        wechatid: "wxid_2tvf9y1ndag622",
        wechatno: "",
        nickname: "乌云125",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/aV1s3mvP5VdBianIR0bfguUC8bhllLWLsrEkeerTDDdtjUibbREficDeleNQAmHjVU17rq811CyD9Nk7iaXK5QwBBUDK4xro9Ynfbwibicic4EdtFg/0",
        friendstatus: 0,
        friendId: 2611,
        status: 2,
        isassignuser: 0,
        isfriend: 1
      }, {
        changetype: 1,
        memberid: 1003,
        clusterid: 38976,
        wechatid: "wxid_ig4d4uh7fqlm21",
        wechatno: "",
        nickname: "_其實我好劲",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/BrSYgPaMUc2Jqkw3QV0FQNYIRwDuiaQoQCicFCrQrnJsVTicskMU1Xc2B5dyUucGLz2uSzArgazj0xYIbnceYlCYKS9gfBaqbGVkcLhIZ1tLkA/0",
        friendstatus: 0,
        friendId: 0,
        status: 2,
        isassignuser: 0,
        isfriend: 0
      }, {
        changetype: 1,
        memberid: 1004,
        clusterid: 38976,
        wechatid: "wxid_48eq4p9fs3v921",
        wechatno: "",
        nickname: "Feic😘🐻",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/aH0MK4wjJ8qybIoIR7ZCqaMFHxkzjhC2ibqIVSnJAdDniaBsIAMJsaaKPXfBIqiaUiagYJx62FnXQeCXia8icKPhkHe40VeibJ6lcuff0B520ymSLI/0",
        friendstatus: 0,
        friendId: 2461,
        status: 2,
        isassignuser: 0,
        isfriend: 1
      }, {
        changetype: 1,
        memberid: 1005,
        clusterid: 38976,
        wechatid: "wxid_j45e7f7zb28e22",
        wechatno: "",
        nickname: "【非法操作】",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/QNeC1v7dyt7zrdGXG3AtNoviaCCEia3AAnHns80hLmuYLiaT7Cgkoh3v2k7NZ2ErWibWHCJLHmjEgod4uzLV8g50IO6yd6JSRAgZm1ATBtRnlgk/0",
        friendstatus: 0,
        friendId: 0,
        status: 2,
        isassignuser: 0,
        isfriend: 0
      }, {
        changetype: 1,
        memberid: 1006,
        clusterid: 38976,
        wechatid: "wxid_0j5gpp6unncs22",
        wechatno: "",
        nickname: "Jason｜微管家18771960701",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/iceyad1ZC89rgo5myt777seozOl0T6ibRlKJVlIhBInuYZPWI9p9hmL830dDDROSJe5rye8l0KLicnFg7Y8Urichtl22D6hx5qFX9kibFz1bUuiaI/0",
        friendstatus: 0,
        friendId: 0,
        status: 2,
        isassignuser: 0,
        isfriend: 0
      }, {
        changetype: 1,
        memberid: 1007,
        clusterid: 38976,
        wechatid: "wxid_glmka4wodl0j21",
        wechatno: "",
        nickname: "hi",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/Ie15icibJo1TQiaB4MTIeU3KDEicpku7fNcEIRR8qfCJECJFMzaZDmXghlnJAJGNhLsk8kjiahCh46krVAjoVknL9YCFyiaf2NrEnX3R3aRsUX7vA/0",
        friendstatus: 0,
        friendId: 2460,
        status: 2,
        isassignuser: 0,
        isfriend: 1
      } ],
      isreturnname: 0,
      returnname: "",
      messageunreadcount: 3,
      lastmsg: {
        locmsgid: "1187610336314167296",
        msgtype: 1,
        content: '{"text":"1221"}',
        createtimestamp: 1571983342002
      },
      createtimestamp: 1571983303045,
      ownerallowflag: 0,
      datastatus: 2
    }, {
      cmdtype: "CmdClusterInfoChanged",
      locmsgid: null,
      personalid: 9676,
      userid: 151,
      changetype: 2,
      merchantid: 0,
      clusterid: 38976,
      wxchatroomid: "22431750377@chatroom",
      isowner: 0,
      groupid: 0,
      clustername: "555555555",
      headimgurl: "http://wx.qlogo.cn/mmcrhead/oyG9nzLg9aKj5WxDZTeqktjq3l82kw1B3rDp9ny8HHH9ic5eEzAicUmP1YdzY7jH8lVorRlGeibfHrrmFW17A9PmKbgpCS7wBt2/0",
      ownerwechatid: "wxid_2tvf9y1ndag622",
      ownernickname: "",
      ownerheadimgurl: "",
      createtime: "2019-10-25T14:01:43.045088",
      memberlist: [ {
        changetype: 1,
        memberid: 1002,
        clusterid: 38976,
        wechatid: "wxid_2tvf9y1ndag622",
        wechatno: "",
        nickname: "乌云125",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/aV1s3mvP5VdBianIR0bfguUC8bhllLWLsrEkeerTDDdtjUibbREficDeleNQAmHjVU17rq811CyD9Nk7iaXK5QwBBUDK4xro9Ynfbwibicic4EdtFg/0",
        friendstatus: 0,
        friendId: 2611,
        status: 2,
        isassignuser: 0,
        isfriend: 1
      }, {
        changetype: 1,
        memberid: 1003,
        clusterid: 38976,
        wechatid: "wxid_ig4d4uh7fqlm21",
        wechatno: "",
        nickname: "_其實我好劲",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/BrSYgPaMUc2Jqkw3QV0FQNYIRwDuiaQoQCicFCrQrnJsVTicskMU1Xc2B5dyUucGLz2uSzArgazj0xYIbnceYlCYKS9gfBaqbGVkcLhIZ1tLkA/0",
        friendstatus: 0,
        friendId: 0,
        status: 2,
        isassignuser: 0,
        isfriend: 0
      }, {
        changetype: 1,
        memberid: 1004,
        clusterid: 38976,
        wechatid: "wxid_48eq4p9fs3v921",
        wechatno: "",
        nickname: "Feic😘🐻",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/aH0MK4wjJ8qybIoIR7ZCqaMFHxkzjhC2ibqIVSnJAdDniaBsIAMJsaaKPXfBIqiaUiagYJx62FnXQeCXia8icKPhkHe40VeibJ6lcuff0B520ymSLI/0",
        friendstatus: 0,
        friendId: 2461,
        status: 2,
        isassignuser: 0,
        isfriend: 1
      }, {
        changetype: 1,
        memberid: 1005,
        clusterid: 38976,
        wechatid: "wxid_j45e7f7zb28e22",
        wechatno: "",
        nickname: "【非法操作】",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/QNeC1v7dyt7zrdGXG3AtNoviaCCEia3AAnHns80hLmuYLiaT7Cgkoh3v2k7NZ2ErWibWHCJLHmjEgod4uzLV8g50IO6yd6JSRAgZm1ATBtRnlgk/0",
        friendstatus: 0,
        friendId: 0,
        status: 2,
        isassignuser: 0,
        isfriend: 0
      }, {
        changetype: 1,
        memberid: 1006,
        clusterid: 38976,
        wechatid: "wxid_0j5gpp6unncs22",
        wechatno: "",
        nickname: "Jason｜微管家18771960701",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/iceyad1ZC89rgo5myt777seozOl0T6ibRlKJVlIhBInuYZPWI9p9hmL830dDDROSJe5rye8l0KLicnFg7Y8Urichtl22D6hx5qFX9kibFz1bUuiaI/0",
        friendstatus: 0,
        friendId: 0,
        status: 2,
        isassignuser: 0,
        isfriend: 0
      }, {
        changetype: 1,
        memberid: 1007,
        clusterid: 38976,
        wechatid: "wxid_glmka4wodl0j21",
        wechatno: "",
        nickname: "hi",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/Ie15icibJo1TQiaB4MTIeU3KDEicpku7fNcEIRR8qfCJECJFMzaZDmXghlnJAJGNhLsk8kjiahCh46krVAjoVknL9YCFyiaf2NrEnX3R3aRsUX7vA/0",
        friendstatus: 0,
        friendId: 2460,
        status: 2,
        isassignuser: 0,
        isfriend: 1
      } ],
      isreturnname: 0,
      returnname: "",
      messageunreadcount: 3,
      lastmsg: {
        locmsgid: "1187610336314167296",
        msgtype: 1,
        content: '{"text":"1221"}',
        createtimestamp: 1571983342002
      },
      createtimestamp: 1571983303045,
      ownerallowflag: 0,
      datastatus: 2
    }, {
      cmdtype: "CmdClusterInfoChanged",
      locmsgid: null,
      personalid: 9676,
      userid: 151,
      changetype: 3,
      merchantid: 0,
      clusterid: 38976,
      wxchatroomid: "22431750377@chatroom",
      isowner: 0,
      groupid: 0,
      clustername: "555555555",
      headimgurl: "http://wx.qlogo.cn/mmcrhead/oyG9nzLg9aKj5WxDZTeqktjq3l82kw1B3rDp9ny8HHH9ic5eEzAicUmP1YdzY7jH8lVorRlGeibfHrrmFW17A9PmKbgpCS7wBt2/0",
      ownerwechatid: "wxid_2tvf9y1ndag622",
      ownernickname: "",
      ownerheadimgurl: "",
      createtime: "2019-10-25T14:01:43.045088",
      memberlist: [ {
        changetype: 1,
        memberid: 1002,
        clusterid: 38976,
        wechatid: "wxid_2tvf9y1ndag622",
        wechatno: "",
        nickname: "乌云125",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/aV1s3mvP5VdBianIR0bfguUC8bhllLWLsrEkeerTDDdtjUibbREficDeleNQAmHjVU17rq811CyD9Nk7iaXK5QwBBUDK4xro9Ynfbwibicic4EdtFg/0",
        friendstatus: 0,
        friendId: 2611,
        status: 2,
        isassignuser: 0,
        isfriend: 1
      }, {
        changetype: 1,
        memberid: 1003,
        clusterid: 38976,
        wechatid: "wxid_ig4d4uh7fqlm21",
        wechatno: "",
        nickname: "_其實我好劲",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/BrSYgPaMUc2Jqkw3QV0FQNYIRwDuiaQoQCicFCrQrnJsVTicskMU1Xc2B5dyUucGLz2uSzArgazj0xYIbnceYlCYKS9gfBaqbGVkcLhIZ1tLkA/0",
        friendstatus: 0,
        friendId: 0,
        status: 2,
        isassignuser: 0,
        isfriend: 0
      }, {
        changetype: 1,
        memberid: 1004,
        clusterid: 38976,
        wechatid: "wxid_48eq4p9fs3v921",
        wechatno: "",
        nickname: "Feic😘🐻",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/aH0MK4wjJ8qybIoIR7ZCqaMFHxkzjhC2ibqIVSnJAdDniaBsIAMJsaaKPXfBIqiaUiagYJx62FnXQeCXia8icKPhkHe40VeibJ6lcuff0B520ymSLI/0",
        friendstatus: 0,
        friendId: 2461,
        status: 2,
        isassignuser: 0,
        isfriend: 1
      }, {
        changetype: 1,
        memberid: 1005,
        clusterid: 38976,
        wechatid: "wxid_j45e7f7zb28e22",
        wechatno: "",
        nickname: "【非法操作】",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/QNeC1v7dyt7zrdGXG3AtNoviaCCEia3AAnHns80hLmuYLiaT7Cgkoh3v2k7NZ2ErWibWHCJLHmjEgod4uzLV8g50IO6yd6JSRAgZm1ATBtRnlgk/0",
        friendstatus: 0,
        friendId: 0,
        status: 2,
        isassignuser: 0,
        isfriend: 0
      }, {
        changetype: 1,
        memberid: 1006,
        clusterid: 38976,
        wechatid: "wxid_0j5gpp6unncs22",
        wechatno: "",
        nickname: "Jason｜微管家18771960701",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/iceyad1ZC89rgo5myt777seozOl0T6ibRlKJVlIhBInuYZPWI9p9hmL830dDDROSJe5rye8l0KLicnFg7Y8Urichtl22D6hx5qFX9kibFz1bUuiaI/0",
        friendstatus: 0,
        friendId: 0,
        status: 2,
        isassignuser: 0,
        isfriend: 0
      }, {
        changetype: 1,
        memberid: 1007,
        clusterid: 38976,
        wechatid: "wxid_glmka4wodl0j21",
        wechatno: "",
        nickname: "hi",
        headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/Ie15icibJo1TQiaB4MTIeU3KDEicpku7fNcEIRR8qfCJECJFMzaZDmXghlnJAJGNhLsk8kjiahCh46krVAjoVknL9YCFyiaf2NrEnX3R3aRsUX7vA/0",
        friendstatus: 0,
        friendId: 2460,
        status: 2,
        isassignuser: 0,
        isfriend: 1
      } ],
      isreturnname: 0,
      returnname: "",
      messageunreadcount: 3,
      lastmsg: {
        locmsgid: "1187610336314167296",
        msgtype: 1,
        content: '{"text":"1221"}',
        createtimestamp: 1571983342002
      },
      createtimestamp: 1571983303045,
      ownerallowflag: 0,
      datastatus: 2
    } ]
  };
  parseSignalRMessageInfo( messageInfo );
}
export function onPersonalStatsChanged( personalid, onlinestatus ) {
  personalid = personalid ? personalid : WechatFlyweightFactory.getWechats( ).map( item => item.personalid ).getRdItem( );
  onlinestatus = onlinestatus ? onlinestatus : [ 1, 2, 3 ].getRdItem( );
  let messageInfo = {
    "cmdtypecode": 0,
    "cmdtype": "CmdPersonalStatusChange",
    "locmsgid": null,
    "personalid": personalid,
    "userid": 53,
    "onlinestatus": onlinestatus,
    "remarks": "",
    "time": 1561088529224
  }
  parseSignalRMessageInfo( messageInfo );
}
export function onNewMessage( personalid, friendsidOrClusterid, type, msgtype ) {
  personalid = personalid ? personalid : WechatFlyweightFactory.getWechats( ).map( item => item.personalid ).getRdItem( );
  let wechat = WechatFlyweightFactory.getWechat( personalid );
  let fromwechatid = wechat.getExtraInfoByKey( 'wechatid' );
  let chatTarget = null;
  let messageInfo = {
    "cmdtype": "CmdNewMessage",
    "locmsgid|1": /1[0-9]{15}/,
    "personalid": personalid,
    "userid": 53,
    "fromwechatid": fromwechatid,

    "clusterid": 37948,
    "wxchatroomid": "9122274093@chatroom",
    "friendid": 0,
    "towechatid": "wxid_y825887d1uq222",
    "content": "{'text': ''}",
    "msgtype": 1,
    "msgsvrid|1": /1[0-9]{18}/,
    "sendstatus": 4,
    "reportnum": 1,
    "createtimestamp": 1561343888000,
    "issend": 0,
    "atwxids": null,
    "duration": 0
  }
};

// --- 事件接收器
instance.$on( __events__.NEW_MESSAGE, function newMessage( messageInfo ) {
  messageLog.info( "--- process[" + __events__.NEW_MESSAGE + "]" );
  let message = MessageFactory.getMessageInstance( messageInfo );
} );

instance.$on( __events__.ON_MESSAGES, function onMessages( messageInfos ) {
  messageLog.info( "--- 接收一组消息---------------------------" );
} );

instance.$on( __events__.FRIEND_INFO_CHANGED, function onFriendInfoChanged( friendInfo ) {
  messageLog.info( "--- process[" + __events__.FRIEND_INFO_CHANGED + "]" );
  let { friendsid, wechatid } = friendInfo;
  let friend = FriendFlyweightFatory.getFriend( friendsid, wechatid );
  //TODO: friend 可能存在，也可能是New
  //更新需要特殊处理么？
  friend.setExtraInfo( friendInfo );
  let wechat, friendList;
  wechat = friend.findSubordinator( );
  friendList = wechat.getFriendList( );
  let { changetype } = friendInfo;
  friend.onFriendInfoChangedHandle( changetype );
  console.log( '\n--- result.' + __events__.FRIEND_INFO_CHANGED + ' ---------------' );
  let wechats = WechatFlyweightFactory.getWechats( );
  wechats.forEach( item => item.toString( ) );
  messageLog.info( "wechatInfos: ", WechatInfoFlyweightFactory.getWechatInfos( ) );
} );

instance.$on( __events__.CHATROOM_INFO_CHANGED, function onChatroomInfoChanged( chatroomInfo ) {
  messageLog.info( "--- process[" + __events__.CHATROOM_INFO_CHANGED + "]" );
  let { clusterid, wxchatroomid } = chatroomInfo;
  let chatroom = ChatroomFlyweightFactory.getChatroom( clusterid, wxchatroomid );
  //TODO: chatroom 可能存在，也可能是New
  //更新需要特殊处理么？
  chatroom.setExtraInfo( chatroomInfo );
  let { changetype } = chatroomInfo;
  chatroom.onChatroomInfoChangeHandle( changetype );
  console.log( '\n--- result.' + __events__.CHATROOM_INFO_CHANGED + ' ---------------' );
  let wechats = WechatFlyweightFactory.getWechats( );
  wechats.forEach( item => item.toString( ) );
  messageLog.info( "wechatInfos: ", WechatInfoFlyweightFactory.getWechatInfos( ) );
} );

instance.$on( __events__.WECHAT_ACCOUNTS_ALIVE_STATUS, function onPersonalStatsChanged( wechatInfo ) {
  messageLog.info( "--- process[" + __events__.WECHAT_ACCOUNTS_ALIVE_STATUS + "]" );
  let { personalid, onlinestatus } = wechatInfo;
  let wechat = WechatFlyweightFactory.getWechat( personalid );
  if ( wechat ) {
    wechat.setOnlineStatus( onlinestatus );
  }
} );
export default instance;