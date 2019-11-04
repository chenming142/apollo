<template>
  <el-container>
    <el-header class="operate">
      <el-tabs type="border-card">
        <el-tab-pane label="生成数据">
          <el-form ref="generate" :model="generateform" label-width="120px" class="generate">
            <el-form-item label="所属个人号" v-if="generateform.type != 'wechat'">
              <el-select v-model="personalid" clearable placeholder="请选择">
                <el-option v-for="item in wechats" 
                  :key="item.personalid" 
                  :label="item.getNickname()"
                  :value="item.personalid">
                  <span style="float: left">{{ item.personalid }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.getNickname() }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生成对象">
              <el-select v-model="generateform.type" placeholder="请选择">
                <el-option v-for="item in generateform.types" :key="item.value" :label="item.label" :value="item.value">
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="最近联系人类型" v-if="generateform.type == 'recent'">
              <el-select v-model="generateform.chattype" placeholder="请选择">
                <el-option v-for="item in generateform.chattypes" :key="item.value" :label="item.label" :value="item.value">
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生成数量">
              <el-input-number v-model="generateform.num" :min="1" :max="1000" label="生成个数"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="generate">开始生成数据</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人号操作">个人号操作</el-tab-pane>
        <el-tab-pane label="好友操作">好友操作</el-tab-pane>
        <el-tab-pane label="群操作">群操作</el-tab-pane>
        <el-tab-pane label="消息处理">消息处理</el-tab-pane>
      </el-tabs>
    </el-header>

    <div class="state">
      <el-tabs>
        <el-tab-pane>
          <span slot="label">
            <el-badge :value="WechatFlyweightFactory.getWechatSize()" class="item" type="primary">
              <el-button type="text"> 个人号 </el-button>
            </el-badge>
          </span>

          <el-collapse v-if="WechatFlyweightFactory.getWechats() && WechatFlyweightFactory.getWechats().length > 0">
            <el-collapse-item :title="wechat.personalid + ' - ' + wechat.getNickname()" :name="wechat.personalid" v-for="wechat in WechatFlyweightFactory.getWechats()">
              <pre v-html="$options.filters.syntaxHighlight(wechat)"></pre>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-else>
            <el-collapse-item title="无个人号"></el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">
            <el-badge :value="FriendFlyweightFatory.getFriendSize()" class="item" type="warning">
              <el-button type="text">好  友</el-button>
            </el-badge>
          </span>

          <el-collapse v-if="FriendFlyweightFatory.getFriends() && Object.keys(FriendFlyweightFatory.getFriends()).length > 0">
            <el-collapse-item :title="friend.friendid + ' - ' + friend.getNickname()" :name="friend.friendid" v-for="friend in Object.values(FriendFlyweightFatory.getFriends())">
              <pre v-html="$options.filters.syntaxHighlight(friend)"></pre>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-else>
            <el-collapse-item title="无好友"></el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">
            <el-badge :value="ChatroomFlyweightFactory.getChatroomSize()" class="item">
              <el-button type="text">群</el-button>
            </el-badge>
          </span>

          <el-collapse v-if="ChatroomFlyweightFactory.getChatrooms() && Object.keys(ChatroomFlyweightFactory.getChatrooms()).length > 0">
            <el-collapse-item :title="chatroom.clusterid + ' - ' + chatroom.getNickname()" :name="chatroom.clusterid" v-for="chatroom in Object.values(ChatroomFlyweightFactory.getChatrooms())">
              <pre v-html="$options.filters.syntaxHighlight(chatroom)"></pre>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-else>
            <el-collapse-item title="无群"></el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">
            <el-badge :value="RecentFlyweightFactory.getRecentSize()" class="item" type="success">
              <el-button type="text">最近联系人</el-button>
            </el-badge>
          </span>

          <el-collapse v-if="RecentFlyweightFactory.getRecentList() && RecentFlyweightFactory.getRecentList().length > 0">
            <el-collapse-item :title="recent.getUniqKey()" :name="recent.getUniqKey()" v-for="recent in RecentFlyweightFactory.getRecentList()">
              <pre v-html="$options.filters.syntaxHighlight(recent)"></pre>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-else>
            <el-collapse-item title="无群"></el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">
            <el-badge :value="WechatInfoFlyweightFactory.getWechatInfosSize()" class="item" type="info">
              <el-button type="text">WechatInfo</el-button>
            </el-badge>
          </span>

          <el-collapse v-if="WechatInfoFlyweightFactory.getWechatInfos() && Object.keys(WechatInfoFlyweightFactory.getWechatInfos()).length > 0">
            <el-collapse-item :title="wechatInfo.wechatid + ' - ' + wechatInfo.getNickname()" :name="wechatInfo.wechatid" v-for="wechatInfo in Object.values(WechatInfoFlyweightFactory.getWechatInfos())">
              <pre v-html="$options.filters.syntaxHighlight(wechatInfo)"></pre>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-else>
            <el-collapse-item title="无群"></el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </div>

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
            <el-collapse v-else>
              <el-collapse-item title="无好友"></el-collapse-item>
            </el-collapse>
          </el-col>

          <el-col :span="8">
            <el-collapse v-if="item.getChatroomList() && item.getChatroomList().length > 0">
              <el-collapse-item :title="chatroom.clusterid + ' - '+ chatroom.getNickname()" :name="chatroom.clusterid" v-for="chatroom in item.getChatroomList()">
                <pre v-html="$options.filters.syntaxHighlight(chatroom)"></pre>
              </el-collapse-item>
            </el-collapse>
            <el-collapse v-else>
              <el-collapse-item title="无群"></el-collapse-item>
            </el-collapse>
          </el-col>

          <el-col :span="10">
            <el-collapse v-if="item.getRecentList() && item.getRecentList().length > 0">
              <el-collapse-item :title="recent.getUniqKey()" :name="recent.getUniqKey()" v-for="recent in item.getRecentList()">
                <pre v-html="$options.filters.syntaxHighlight(recent)"></pre>
              </el-collapse-item>
            </el-collapse>
            <el-collapse v-else>
                <el-collapse-item title="无最近联系人"></el-collapse-item>
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
  import Vue from 'vue';
  import { WechatFlyweightFactory } from '../model/wechat';
  import { FriendFlyweightFatory } from '../model/friend';
  import { ChatroomFlyweightFactory } from '../model/chatroom';
  import { RecentFlyweightFactory } from '../model/recent';
  import { WechatInfoFlyweightFactory } from '../model/wechatInfo';
  import GeneratorFactory from '../api/generate';

  export default {
    data () {
      return {
        personalid: null,
        generateform: {
          types: [
            {value: 'wechat', label: '个人号'},
            {value: 'friend', label: '好友'},
            {value: 'chatroom', label: '群'},
            {value: 'recent', label: '最近联系人'}
          ],
          type: 'wechat',
          num: 0,
          chattypes: [
            {value: '1', label: '好友'},
            {value: '2', label: '群'}
          ],
          chattype: '1',
        },

        wechats: WechatFlyweightFactory.getWechats(),

        WechatInfoFlyweightFactory: WechatInfoFlyweightFactory,
        WechatFlyweightFactory: WechatFlyweightFactory,
        FriendFlyweightFatory: FriendFlyweightFatory,
        ChatroomFlyweightFactory: ChatroomFlyweightFactory,
        RecentFlyweightFactory: RecentFlyweightFactory
      }
    },
    methods: {
      generate () {
        let personalid = this.personalid;
        let { type, num, chattype } = this.generateform;
        switch (type) {
          case 'wechat':
          GeneratorFactory.generateWechat(num);
          break;
          case 'friend':
          GeneratorFactory.generateFriend(num, personalid);
          break;
          case 'chatroom':
          GeneratorFactory.generateChatroom(num, personalid);
          break;
          case 'recent':
          GeneratorFactory.generateRecent(num, personalid, chattype);
          break;
        }
      }
    }
  }
</script>

<style>
  div.state {border:1px solid #EBEEF5;border-radius: 5px;margin: 20px;padding: 30px 10px 10px;}
  div.state .item {margin: 0 8px;}
  div.state .item .el-badge__content {top: 10px;right: 7px;}
  header.operate {min-height: 80px;height: auto !important;}

  .generate .el-form-item__content {text-align: left;}
  .generate .el-form-item__content > * {margin-right: 5px;}

  .personal {margin-bottom: 15px;}
  .personal .el-card__header div > * {
    margin-right: 10px;
  }
  .state .el-collapse, .personal .el-collapse {border-top: none;}
  pre {text-align:left;outline: 1px solid #ccc; padding: 5px; margin: 5px; }
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: red; }
</style>