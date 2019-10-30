import WechatFactory from "../model/wechat";
import FriendFatory from "../model/friend";

import Logging from '../api/logging';

const friendLog = Logging.getLogger('friend');

let friends = FriendFatory.getFriends();
console.log('\n--- test4friend -------------------------------');
friendLog.info("好友的个数：" + friends.size, friends);
