<template>
  <el-container>
    <el-header>
      操作区
    </el-header>

    <el-main>
      <el-card v-for="item in wechats" :key="item.personalid" class="personal">
        <div slot="header">
          <span v-text="item.personalid + ' - ' + item.getNickname()"></span>
          <el-switch
            v-model="item.onlinestatus"
            active-color="#13ce66" active-value="1"
            inactive-color="#ff4949" inactive-value="0">
          </el-switch>
          <el-badge :value="item.unreadmsgcnt">
            <el-button size="small">未读数</el-button>
          </el-badge>
          <el-badge :value="item.notthroughcount">
            <el-button size="small">未通过好友数</el-button>
          </el-badge>
        </div>

        <el-row :gutter="24">
          <el-col :span="6">
            <el-collapse v-if="item.getFriendList() && item.getFriendList().length > 0">
              <el-collapse-item :title="friend.friendid + ' - ' + friend.getNickname()" :name="friend.friendid" v-for="friend in item.getFriendList()">
                <pre v-html="$options.filters.syntaxHighlight(friend)"></pre>
              </el-collapse-item>
            </el-collapse>
          </el-col>

          <el-col :span="8">
            <el-collapse v-if="item.getChatroomList() && item.getChatroomList().length > 0">
              <el-collapse-item :title="chatroom.clusterid + ' - '+ chatroom.getNickname()" :name="chatroom.clusterid" v-for="chatroom in item.getChatroomList()">
                <pre v-html="$options.filters.syntaxHighlight(chatroom)"></pre>
              </el-collapse-item>
            </el-collapse>
          </el-col>

          <el-col :span="10">
            <el-collapse v-if="item.getRecentList() && item.getRecentList().length > 0">
              <el-collapse-item :title="recent.getUniqKey()" :name="recent.getUniqKey()" v-for="recent in item.getRecentList()">
                <pre v-html="$options.filters.syntaxHighlight(recent)"></pre>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </el-card>
    </el-main>

    <el-footer>
      数据统计区
    </el-footer>
  </el-container>
</template>

<script>
  import { WechatFlyweightFactory } from '../model/wechat';
  export default {
    computed: {
      wechats () {
        return WechatFlyweightFactory.getWechats();
      },
      friendid () {
        let wechats = this.wechats;
        return wechats[0].getFriendList()[0].friendid;
      },
      clusterid () {
        let wechats = this.wechats;
        return wechats[0].getChatroomList()[0].clusterid;
      },
      uniqKey () {
        let wechats = this.wechats;
        return wechats[0].getRecentList()[0].getUniqKey();
      }
    }
  }
</script>

<style>
  .personal {margin-bottom: 15px;}
  .personal .el-card__header div > * {
    margin-right: 10px;
  }
  pre {text-align:left;outline: 1px solid #ccc; padding: 5px; margin: 5px; }
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: red; }
</style>