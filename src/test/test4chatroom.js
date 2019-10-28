import WechatFactory from "../model/wechat";
import ChatroomFactory from '../model/chatroom';

import Logging from '../api/logging';

const chatroomLog = Logging.getLogger('chatroom');

let chatrooms = ChatroomFactory.getChatrooms();
chatroomLog.info("群的个数：" + chatrooms.size, chatrooms);
chatrooms.forEach(item => item.toString());
