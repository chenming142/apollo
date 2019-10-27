import WechatFactory from "../model/wechat";
import FriendFatory from "../model/friend";

let friends = FriendFatory.getFriends();
console.log("好友的个数：" + friends.size, friends);
