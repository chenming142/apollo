import WechatFactory from "./wechat";
import {
  Friend
} from './friend';
import ChatroomFactory, {
  Chatroom
} from './chatroom';
import {
  ChatroomMember
} from './chatroomMember';
import { Recent } from './recent';

import Logging from '../api/logging';

const friendLog = Logging.getLogger('friend');
const chatroomLog = Logging.getLogger('chatroom');
const recentLog = Logging.getLogger('recent');

export default function SubordinatorMixin(Base) {
  return class Subordinator extends Base {
    constructor(...args) {
      super(...args);
    }
    checkSubordinatorNew() {
      let {
        personalid
      } = this;
      if (this instanceof Friend) {
        friendLog.info("- checkSubordinateWechatNew: " + personalid);
      }
      if (this instanceof Chatroom) {
        chatroomLog.info("- checkSubordinateWechatNew: " + personalid);
      }
      WechatFactory.checkWechatNew(personalid);
    }
    checkSubordinatorAvaliable() {
      let wechat = this.findSubordinateWechat();
      if (wechat) return wechat.checkAvaliable();
      return false;
    }
    findSubordinator() {
      let subordinator, subordinateKey;
      if (this instanceof Friend || this instanceof Chatroom) {
        let {
          personalid
        } = this;
        subordinateKey = personalid;
        subordinator = WechatFactory.getWechat(subordinateKey);
      }
      if (this instanceof ChatroomMember) {
        let {
          clusterid
        } = this;
        subordinateKey = clusterid;
        subordinator = ChatroomFactory.getChatroom(subordinateKey);
      }
      if (subordinator) {
        return subordinator;
      } else {
        throw Error("归属者不存在", subordinateKey);
      }
    }
    establishSubordinate() {
      let subordinator = this.findSubordinator();
      if (subordinator) {
        subordinator.establish(this.identity(), this);
      }
    }
    relieveSubordinate() {
      let subordinator = this.findSubordinator();
      if (subordinator) {
        subordinator.relieve(this.identity(), this);
      }
    }
  };
}

export function SubordinateBehaviorMixin(Base) {
  return class SubordinateBehavior extends Base {
    constructor(...args) {
      super(...args);
    }
    getSubordinator(clazz) {
      if (clazz instanceof Friend) {
        return this.friendIds;
      } else if (clazz instanceof Chatroom) {
        return this.chatroomIds;
      } else if (clazz instanceof Recent) {
        return this.uniqKeys;
      } else if (clazz instanceof ChatroomMember) {
        return this.memberIds;
      }
    }
    establish(identity, clazz) {
      const self = this;
      let subordinator = self.getSubordinator(clazz);
      if (!subordinator.has(identity)) {
        subordinator.add(identity);
      }
    }
    relieve(identity, clazz) {
      const self = this;
      let subordinator = self.getSubordinator(clazz);
      if (subordinator.has(identity)) {
        subordinator.delete(identity);
      }
    }
    clear(clazz) {
      const self = this;
      let subordinator = self.getSubordinator(clazz);
      subordinator.clear();
    }
  }
}