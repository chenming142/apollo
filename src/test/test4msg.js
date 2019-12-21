import { onFriendInfoChanged, onChatroomInfoChanged } from "../api/events";
import Logging from '../api/logging';

import { MessageProducer } from '../model/message';

const messageLog = Logging.getLogger('message');

(function main() {
  console.log("--- event 测试开始 ----------------");
  let events = [/** onFriendInfoChanged, onChatroomInfoChanged **/];
  events.forEach(evt => {
    if (typeof evt === "function") {
      evt();
    }
  });
})();

let textMessageInfo = {
  "cmdtype":"CmdNewMessage",
  "locmsgid":"15613438912322348",
  "personalid":9678,
  "chatid":15613438912322348,
  "userid":53,
  "fromwechatid":"wxid_oa67vv6yx4do21",
  "clusterid":37948,
  "wxchatroomid":"9122274093@chatroom",
  "friendid":0,
  "towechatid":"wxid_y825887d1uq222",
  "content":"{\"text\":\"我来了\"}",
  "msgtype":1 /* 文本消息 */,
  "msgsvrid":"1041677409530441859",
  "sendstatus":4,
  "reportnum":1,
  "createtime":"2019-06-24T10:38:08+08:00",
  "createtimestamp":1561343888000,
  "issend":0,
  "atwxids":null,
  "duration":0
}, textMessage;

textMessage = MessageProducer.Producer(textMessageInfo);
console.log(textMessage);
console.log(textMessage.msgBrief);