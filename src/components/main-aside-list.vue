<template>
  <div class="main-aside-list">
    <ul v-if="wechats && wechats.length > 0">
      <li v-for="item in wechats" :key="item.personalid" class="personal">
          <div class="content">
            <span v-text="item.personalid"></span> - <span v-text="item.getNickname()"></span>
          </div>

          <div class="children">
            <ul class="friend" v-if="item.getFriendList() && item.getFriendList().length > 0">
              <li v-for="friend in item.getFriendList()">
                <span v-text="friend.friendid"></span> - <span v-text="friend.getNickname()"></span>
              </li>
            </ul>
            <ul class="friend" v-else><li>无好友</li></ul> 

            <ul class="chatroom" v-if="item.getChatroomList() && item.getChatroomList().length > 0">
              <li v-for="chatroom in item.getChatroomList()">
                <span v-text="chatroom.clusterid"></span> - <span v-text="chatroom.getNickname()"></span>
              </li>
            </ul>
            <ul class="chatroom" v-else><li>无群</li></ul>

            <ul class="recent" v-if="item.getRecentList() && item.getRecentList().length > 0">
              <li v-for="recent in item.getRecentList()">
                <span v-text="recent.getUniqKey()"></span>
              </li>
            </ul>
            <ul class="recent" v-else><li>无好友</li></ul>
          </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { WechatFlyweightFactory } from '../model/wechat';
  export default {
    computed: {
      wechats () {
        return WechatFlyweightFactory.getWechats();
      }
    }
  }
</script>

<style>
ul {list-style: disc;padding-left: 40px;}
li {display: list-item; list-style: none;}

li.personal {text-align: left;}
li.personal .content { border-bottom: 1px solid gray; padding: 10px 0; margin: 2px 0;}

li.personal div.children { overflow: hidden;}
li.personal div.children ul {display: block;width: 33.33%;float: left;margin: 0;padding:0;}
li.personal div.children ul li {padding: 8px 0;}
</style>