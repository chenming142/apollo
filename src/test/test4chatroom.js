import WechatFactory from "../model/wechat";
import ChatroomFactory from '../model/chatroom';

let chatrooms = ChatroomFactory.getChatrooms();
console.log("群的个数：" + chatrooms.size, chatrooms);
