import Vue from 'vue';
import WechatFactory, { WechatFlyweightFactory } from "./wechat";
import { Friend } from './friend';
import ChatroomFactory, { Chatroom, ChatroomFlyweightFactory } from './chatroom';
import { ChatroomMember } from './chatroomMember';
import { Recent } from './recent';

import Logging from '../api/logging';

const friendLog = Logging.getLogger( 'friend' );
const chatroomLog = Logging.getLogger( 'chatroom' );
const recentLog = Logging.getLogger( 'recent' );

export default function SubordinatorMixin( Base ) {
  return class Subordinator extends Base {
    constructor( ...args ) {
      super( ...args );
    }
    checkSubordinatorNew() {
      let { personalid } = this;
      WechatFactory.checkWechatNew( personalid );
    }
    checkSubordinatorAvaliable() {
      let wechat = this.findSubordinator();
      if ( wechat ) return wechat.checkAvaliable();
      return false;
    }
    findSubordinator() {
      let subordinator, subordinateKey;
      if ( this instanceof ChatroomMember ) {
        let { clusterid } = this;
        subordinateKey = clusterid;
        // chatroomLog.info( '- SubordinatorMixin.findSubordinator: ' + subordinateKey, JSON.stringify( this ) );
        subordinator = ChatroomFlyweightFactory.getChatroom( subordinateKey );
      } else {
        let { personalid } = this;
        subordinateKey = personalid;
        //chatroomLog.info( '- SubordinatorMixin.findSubordinator: ' + subordinateKey, JSON.stringify( this ) );
        subordinator = WechatFlyweightFactory.getWechat( subordinateKey );
      }

      if ( subordinator ) {
        return subordinator;
      } else {
        throw Error( "归属者不存在", subordinateKey );
      }
    }
    establishSubordinate() {
      let subordinator = this.findSubordinator();
      if ( subordinator ) {
        subordinator.establish( this.identity(), this );
      }
    }
    reactiveSubordinate() {
      let subordinator = this.findSubordinator();
      if ( subordinator ) {
        subordinator.responsive( this.identity(), this );
      }
    }
    relieveSubordinate() {
      let subordinator = this.findSubordinator();
      if ( subordinator ) {
        subordinator.relieve( this.identity(), this );
      }
    }
    transferSubordinate( personalid ) {
      this.relieveSubordinate();
      this.setExtraInfoByKey( 'personalid', personalid );
      this.establishSubordinate();
    }
  };
}

export function SubordinateBehaviorMixin( Base ) {
  return class SubordinateBehavior extends Base {
    constructor( ...args ) {
      super( ...args );
    }
    getSubordinator( clazz ) {
      if ( clazz instanceof Friend ) {
        return this.friendIds;
      } else if ( clazz instanceof Chatroom ) {
        return this.clusterIds;
      } else if ( clazz instanceof Recent ) {
        return this.uniqKeys;
      } else if ( clazz instanceof ChatroomMember ) {
        return this.memberIds;
      }
    }
    establish( identity, clazz ) {
      const self = this;
      let subordinator = self.getSubordinator( clazz );
      if ( subordinator.indexOf( identity ) <= -1 ) {
        subordinator.push( identity );
      }
    }
    responsive( identity, clazz ) {
      const self = this;
      let subordinator = self.getSubordinator( clazz );
      let index = subordinator.indexOf( identity );
      if ( index > -1 ) {
        subordinator.splice( index, 1, identity );
      }
    }
    relieve( identity, clazz ) {
      const self = this;
      let subordinator = self.getSubordinator( clazz );
      let index = subordinator.indexOf( identity );
      if ( index > -1 ) {
        subordinator.splice( index, 1 );
      }
    }
    clear( clazz ) {
      const self = this;
      let subordinator = self.getSubordinator( clazz );
      subordinator.clear();
    }
  }
}