import FriendFatory from "./friend";
import ChatroomFatory from "./chatroom";
import constants from "../utils/constants";
const __chattargettype__ = constants.CHAT_TARGET_TYPE;

const AssociateMixin = Base =>
  class AssociateRef extends Base {
    constructor(...args) {
      super(...args);
    }
    checkAssociateRefNew() {
      let { chattargetid, chattargettype } = this;
      switch (chattargettype) {
        case __chattargettype__.friend:
          // console.log("- friend.checkAssociateRefNew", chattargetid);
          FriendFatory.checkFriendNew(chattargetid);
          break;
        case __chattargettype__.chatroom:
          // console.log("- chatroom.checkAssociateRefNew", chattargetid);
          ChatroomFatory.checkChatroomNew(chattargetid);
          break;
        default:
          throw Error("建立关联失败，无法建立该类型关联: "+chattargettype);
          break;
      }
    }
  };
export default AssociateMixin;
