<template>
  <el-container>
    <!--操作区-->
    <el-header class="operate">
      <el-tabs type="border-card" v-model="active">
        <!-- 生成测试数据 -->
        <el-tab-pane label="生成数据" name="generate">
          <el-divider content-position="left">生成测试对象</el-divider>
          <el-form ref="generate" :model="generateform" label-width="120px" class="generate">
            <el-form-item label="所属个人号" v-if="generateform.type != 'wechat'">
              <el-select v-model="generateform.personalid" clearable placeholder="请选择">
                <el-option v-for="item in wechats" :key="item.personalid" :label="item.getNickname()" :value="item.personalid">
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
              <el-button type="success" @click="generate">开始生成</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 个人号操作 -->
        <el-tab-pane label="个人号操作" name="personalOpt">
          <el-divider content-position="left">更改个人号信息</el-divider>
          <el-form ref="personalOpt" :model="personalOptForm" label-width="120px" class="personalOpt">
            <el-form-item label="所属个人号">
              <el-select v-model="personalOptForm.personalid" clearable placeholder="请选择">
                <el-option v-for="item in wechats" :key="item.personalid" :label="item.getNickname()" :value="item.personalid">
                  <span style="float: left">{{ item.personalid + '-' + item.getNickname() }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ ['', '在线', '离线', '离开'][item.getExtraInfoByKey('onlinestatus')] }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="personalOptForm.onlinestatus" placeholder="请选择">
                <el-option v-for="item in personalOptForm.status" :key="item.value" :label="item.label" :value="item.value">
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
              <el-button type="success" @click="personalOpt">更改状态</el-button>
            </el-form-item>
            <el-form-item label="未读数">
              <el-input-number v-model="personalOptForm.unreadmsgcnt" :min="0" :max="99"></el-input-number>
              <el-button type="primary" @click="personalOptUnreadmsgcnt">更改未读数</el-button>
            </el-form-item>
            <el-form-item label="未通过好友数">
              <el-input-number v-model="personalOptForm.notthroughcount" :min="0" :max="99"></el-input-number>
              <el-button type="warning" @click="personalOptNotthroughtcount">更改未通过好友数</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 好友操作 -->
        <el-tab-pane label="好友操作" name="friendOpt">
          <el-divider content-position="left">更改好友信息</el-divider>
          <el-form ref="friendOpt" :model="friendOptForm" label-width="120px" class="personalOpt">
            <el-form-item label="所属个人号">
              <el-select v-model="friendOptForm.personalid" clearable placeholder="请选择">
                <el-option v-for="item in wechats" :key="item.personalid" :label="item.getNickname()" :value="item.personalid">
                  <span style="float: left">{{ item.personalid + '-' + item.getNickname() }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ '好友数: '+ item.getFriendList().length }}</span>
                </el-option>
              </el-select>
              <el-button @click="addFriendOpt" type="success" icon="el-icon-plus" circle></el-button>
            </el-form-item>
            <el-form-item>
              <el-table :data="friendData(friendOptForm.personalid)" border style="width: 100%">
                <el-table-column prop="friendsid" label="friendsid" width="80" fixed></el-table-column>
                <el-table-column prop="wechatid" label="wechatid" fixed width="160"></el-table-column>
                <el-table-column label="昵称">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.type == changetype.MODIFY" v-model="scope.row.nickname"></el-input>
                    <span v-else v-text="scope.row.nickname"></span>
                  </template>
                </el-table-column>
                <el-table-column label="备注" width="160">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.type == changetype.MODIFY" v-model="scope.row.remark"></el-input>
                    <span v-else v-text="scope.row.remark"></span>
                  </template>
                </el-table-column>
                <el-table-column prop="groupid" label="分组"></el-table-column>
                <el-table-column label="未读数" width="120">
                  <template slot-scope="scope">
                    <el-input-number style="width:100px;" v-if="scope.row.type == changetype.MODIFY" size="small" v-model="scope.row.messageunreadcount" :min="0" :max="99"></el-input-number>
                    <span v-else v-text="scope.row.messageunreadcount"></span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="210">
                  <template slot-scope="scope">
                    <el-button @click="editFriendOpt(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button @click="deleteFriendOpt(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
                    <el-dropdown split-button @command="transferFriendOpt" style="margin-left: 3px;">
                      转接好友
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="item.personalid != scope.row.personalid" v-for="item in wechats" :key="item.personalid" :command="{personalid: item.personalid, item: scope.row}">
                          {{item.personalid + '-' + item.getNickname() +' ['+ item.getFriendList().length +']'}}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 群操作 -->
        <el-tab-pane label="群操作" name="chatroomOpt">
          <el-divider content-position="left">更改群信息</el-divider>
          <el-form ref="chatroomOpt" :model="chatroomOptForm" label-width="120px" class="personalOpt">
            <el-form-item label="所属个人号">
              <el-select v-model="chatroomOptForm.personalid" clearable placeholder="请选择">
                <el-option v-for="item in wechats" :key="item.personalid" :label="item.getNickname()" :value="item.personalid">
                  <span style="float: left">{{ item.personalid + '-' + item.getNickname() }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ '群数: '+ item.getChatroomList().length }}</span>
                </el-option>
              </el-select>
              <el-button @click="addChatroomOpt" type="success" icon="el-icon-plus" circle></el-button>
            </el-form-item>
            <el-form-item>
              <el-table :data="chatroomData(chatroomOptForm.personalid)" border style="width: 100%">
                <el-table-column prop="clusterid" label="clusterid" width="80" fixed></el-table-column>
                <el-table-column prop="wxchatroomid" label="wxchatroomid" width="120" fixed></el-table-column>
                <el-table-column label="群成员" width="160" fixed>
                  <template slot-scope="scope">
                    <el-badge :value="scope.row.membercount" :max="99" class="membercount">
                      <el-dropdown split-button @click="transferFriendOpt(scope.row)" style="margin-left: 3px;">
                        成员列表
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="member in chatroomMember(scope.row.clusterid)" :key="member.memberid">
                            {{member.memberid + '-' + member.getNickname() }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-badge>
                  </template>
                </el-table-column>
                <el-table-column label="群名称" width="120">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.type == changetype.MODIFY" v-model="scope.row.clustername"></el-input>
                    <span v-else v-text="scope.row.clustername"></span>
                  </template>
                </el-table-column>
                <el-table-column label="群备注" width="120">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.type == changetype.MODIFY" v-model="scope.row.remark"></el-input>
                    <span v-else v-text="scope.row.remark"></span>
                  </template>
                </el-table-column>
                <el-table-column label="未读数" width="120">
                  <template slot-scope="scope">
                    <el-input-number style="width:100px;" v-if="scope.row.type == changetype.MODIFY" size="small" v-model="scope.row.messageunreadcount" :min="0" :max="99"></el-input-number>
                    <span v-else v-text="scope.row.messageunreadcount"></span>
                  </template>
                </el-table-column>
                <el-table-column prop="groupid" label="groupid" width="80"></el-table-column>
                <el-table-column label="群名回归名称" width="120">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.type == changetype.MODIFY" v-model="scope.row.returnname"></el-input>
                    <span v-else v-text="scope.row.returnname"></span>
                  </template>
                </el-table-column>
                <el-table-column label="是否群名回归" width="100">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.isreturnname" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="isowner" width="80">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.isowner" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="ismanager" width="90">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.ismanager" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column prop="ownerallowflag" label="ownerallowflag" width="110"></el-table-column>
                <el-table-column fixed="right" label="操作" width="215">
                  <template slot-scope="scope">
                    <el-button @click="editChatroomOpt(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button @click="deleteChatroomOpt(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
                    <el-dropdown split-button @command="transferChatroomOpt" style="margin-left: 3px;">
                      转接群
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="item.personalid != scope.row.personalid" v-for="item in wechats" :key="item.personalid" :command="{personalid: item.personalid, item: scope.row}">
                          {{item.personalid + '-' + item.getNickname()+' ['+ item.getChatroomList().length +']'}}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 消息处理 -->
        <el-tab-pane label="消息处理" name="messageOpt">
          <el-divider content-position="left">消息处理</el-divider>
          <el-form ref="messageOpt" :model="messageOptForm" label-width="120px" class="personalOpt">
            <el-form-item>
              <el-radio-group v-model="messageOptForm.type">
                <el-radio-button label="1">个人号 -> 好友</el-radio-button>
                <el-radio-button label="2">个人号 -> 群</el-radio-button>
                <el-radio-button label="3">好友 -> 个人号</el-radio-button>
                <el-radio-button label="4">群 -> 个人号</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="发送者" v-if="messageOptForm.type == 1 || messageOptForm.type == 2">
              <el-select v-model="messageOptForm.personalid" clearable placeholder="请选择">
                <el-option v-for="item in wechats" :key="item.personalid" :label="item.getNickname()" :value="item.personalid">
                  <span style="float: left">{{ item.personalid + '-' + item.getNickname() }}</span>
                  <span v-if="messageOptForm.type == 1" style="float: right; color: #8492a6; font-size: 13px">{{ '好友数: '+ item.getFriendList().length }}</span>
                  <span v-if="messageOptForm.type == 2" style="float: right; color: #8492a6; font-size: 13px">{{ '群数: '+ item.getChatroomList().length }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="接受者" v-if="messageOptForm.type == 1 || messageOptForm.type == 2">
              <el-select v-model="messageOptForm.friendid" clearable placeholder="请选择" v-if="messageOptForm.type == 1">
                <el-option v-for="item in friendData(messageOptForm.personalid)" :key="item.friendsid" :label="item.nickname" :value="item.friendsid">
                  <span style="float: left">{{ item.friendsid + '-' + item.wechatid + '-' + item.nickname }}</span>
                </el-option>
              </el-select>

              <el-select v-model="messageOptForm.clusterid" clearable placeholder="请选择" v-if="messageOptForm.type == 2">
                <el-option v-for="item in chatroomData(messageOptForm.personalid)" :key="item.clusterid" :label="item.clustername" :value="item.clusterid">
                  <span style="float: left">{{ item.clusterid + '-' + item.wxchatroomid + '-' + item.clustername }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="接受者" v-if="messageOptForm.type == 3 || messageOptForm.type == 4">
              <el-select v-model="messageOptForm.personalid" clearable placeholder="请选择">
                <el-option v-for="item in wechats" :key="item.personalid" :label="item.getNickname()" :value="item.personalid">
                  <span style="float: left">{{ item.personalid + '-' + item.getNickname() }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-header>

    <!--统计区-->
    <div class="state">
      <el-tabs>
        <!--个人号-->
        <el-tab-pane>
          <span slot="label">
            <el-badge :value="WechatFlyweightFactory.getWechatSize()" class="item" type="primary">
              <el-button type="text"> 个人号 </el-button>
            </el-badge>
          </span>
          <el-collapse v-if="WechatFlyweightFactory.getWechats() && WechatFlyweightFactory.getWechats().length > 0">
            <el-collapse-item :title="wechat.personalid + ' - ' + wechat.getNickname()" :name="wechat.personalid" v-for="wechat in WechatFlyweightFactory.getWechats()" :key="wechat.personalid">
              <pre v-html="$options.filters.syntaxHighlight(wechat)"></pre>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-else>
            <el-collapse-item title="无个人号"></el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <!--好友-->
        <el-tab-pane>
          <span slot="label">
            <el-badge :value="FriendFlyweightFatory.getFriendSize()" class="item" type="warning">
              <el-button type="text">好 友</el-button>
            </el-badge>
          </span>
          <el-collapse v-if="FriendFlyweightFatory.getFriends() && Object.keys(FriendFlyweightFatory.getFriends()).length > 0">
            <el-collapse-item :title="friend.friendid + ' - ' + friend.getNickname()" :name="friend.friendid" v-for="friend in Object.values(FriendFlyweightFatory.getFriends())" :key="friend.friendid">
              <pre v-html="$options.filters.syntaxHighlight(friend)"></pre>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-else>
            <el-collapse-item title="无好友"></el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <!--群-->
        <el-tab-pane>
          <span slot="label">
            <el-badge :value="ChatroomFlyweightFactory.getChatroomSize()" class="item">
              <el-button type="text">群</el-button>
            </el-badge>
          </span>
          <el-collapse v-if="ChatroomFlyweightFactory.getChatrooms() && Object.keys(ChatroomFlyweightFactory.getChatrooms()).length > 0">
            <el-collapse-item :title="chatroom.clusterid + ' - ' + chatroom.getNickname()" :name="chatroom.clusterid" v-for="chatroom in Object.values(ChatroomFlyweightFactory.getChatrooms())" :key="chatroom.clusterid">
              <pre v-html="$options.filters.syntaxHighlight(chatroom)"></pre>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-else>
            <el-collapse-item title="无群"></el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <!--最近联系人-->
        <el-tab-pane>
          <span slot="label">
            <el-badge :value="RecentFlyweightFactory.getRecentSize()" class="item" type="success">
              <el-button type="text">最近联系人</el-button>
            </el-badge>
          </span>
          <el-collapse v-if="RecentFlyweightFactory.getRecentList() && RecentFlyweightFactory.getRecentList().length > 0">
            <el-collapse-item :title="recent.getUniqKey()" :name="recent.getUniqKey()" v-for="recent in RecentFlyweightFactory.getRecentList()" :key="recent.getUniqKey()">
              <pre v-html="$options.filters.syntaxHighlight(recent)"></pre>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-else>
            <el-collapse-item title="无群"></el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <!--WechatInfo-->
        <el-tab-pane>
          <span slot="label">
            <el-badge :value="WechatInfoFlyweightFactory.getWechatInfosSize()" class="item" type="info">
              <el-button type="text">WechatInfo</el-button>
            </el-badge>
          </span>
          <el-collapse v-if="WechatInfoFlyweightFactory.getWechatInfos() && Object.keys(WechatInfoFlyweightFactory.getWechatInfos()).length > 0">
            <el-collapse-item :title="wechatInfo.wechatid + ' - ' + wechatInfo.getNickname()" :name="wechatInfo.wechatid" v-for="wechatInfo in Object.values(WechatInfoFlyweightFactory.getWechatInfos())" :key="wechatInfo.wechatid">
              <pre v-html="$options.filters.syntaxHighlight(wechatInfo)"></pre>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-else>
            <el-collapse-item title="无群"></el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--数据主展示区-->
    <el-main>
      <el-card v-for="item in wechats" :key="item.personalid" class="personal">
        <!--个人号信息-->
        <div slot="header">
          <span v-text="item.personalid + ' - ' + item.getNickname()" :title="'状态: ' + item.onlinestatus"></span>
          <el-radio-group v-model="item.onlinestatus">
            <el-radio-button :label="s.value" v-for="(s, index) in personalOptForm.status" :key="s.value + '-' + index">{{s.label}}</el-radio-button>
          </el-radio-group>
          <el-badge :value="item.unreadmsgcnt">
            <el-button size="small">未读数</el-button>
          </el-badge>
          <el-badge :value="item.notthroughcount">
            <el-button size="small">未通过好友数</el-button>
          </el-badge>
        </div>

        <el-row :gutter="24">
          <!--好友列表-->
          <el-col :span="6">
            <el-collapse v-if="item.getFriendList() && item.getFriendList().length > 0">
              <el-collapse-item :name="friend.friendid" v-for="friend in item.getFriendList()" :key="friend.friendid">
                <template slot="title">
                  <span v-text="friend.friendid + ' - ' + friend.getNickname()"></span>
                  <el-badge :value="friend.messageunreadcount">
                    <el-button size="small">未读数</el-button>
                  </el-badge>
                  <el-badge :value="friend.notthroughcount">
                    <el-button size="small">未通过好友数</el-button>
                  </el-badge>
                </template>
                <pre v-html="$options.filters.syntaxHighlight(friend)"></pre>
              </el-collapse-item>
            </el-collapse>
            <el-collapse v-else>
              <el-collapse-item title="无好友"></el-collapse-item>
            </el-collapse>
          </el-col>

          <!--群列表-->
          <el-col :span="8">
            <el-collapse v-if="item.getChatroomList() && item.getChatroomList().length > 0">
              <el-collapse-item :name="chatroom.clusterid" v-for="chatroom in item.getChatroomList()" :key="chatroom.clusterid">
                <template slot="title">
                  <span v-text="chatroom.clusterid + ' - '+ chatroom.getNickname()"></span>
                  <el-badge :value="chatroom.messageunreadcount">
                    <el-button size="small">未读数</el-button>
                  </el-badge>
                  <el-badge :value="chatroom.membercount">
                    <el-button size="small">成员数</el-button>
                  </el-badge>
                </template>
                <pre v-html="$options.filters.syntaxHighlight(chatroom)"></pre>
              </el-collapse-item>
            </el-collapse>
            <el-collapse v-else>
              <el-collapse-item title="无群"></el-collapse-item>
            </el-collapse>
          </el-col>

          <!--最近联系人列表-->
          <el-col :span="10">
            <el-collapse v-if="item.getRecentList() && item.getRecentList().length > 0">
              <el-collapse-item :name="recent.getUniqKey()" v-for="recent in item.getRecentList()" :key="recent.getUniqKey()">
                <template slot="title">
                  <span v-text="recent.getUniqKey()"></span>
                  <el-badge :value="recent.unreadmsgcount">
                    <el-button size="small">未读数</el-button>
                  </el-badge>
                </template>
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
import { onPersonalStatsChanged } from '../api/events';
import constants from '../utils/constants';
const __changetype__ = constants.CHANGETYPE;
export default {
  data() {
    return {
      active: 'generate',
      generateform: {
        types: [
          { value: 'wechat', label: '个人号' },
          { value: 'friend', label: '好友' },
          { value: 'chatroom', label: '群' },
          { value: 'recent', label: '最近联系人' }
        ],
        personalid: null,
        type: 'wechat',
        num: 0,
        chattypes: [
          { value: '1', label: '好友' },
          { value: '2', label: '群' }
        ],
        chattype: '1',
      },
      personalOptForm: {
        status: [
          { value: "1", label: '在线' },
          { value: "2", label: '离线' },
          { value: "3", label: '离开' },
        ],
        onlinestatus: null,
        personalid: null,
        unreadmsgcnt: 0,
        notthroughcount: 0
      },
      friendOptForm: {
        personalid: null,
        type: 2,
      },
      chatroomOptForm: {
        personalid: null,
      },
      messageOptForm: {
        type: 1,
        personalid: null,
      },
      changetype: __changetype__,
      wechats: WechatFlyweightFactory.getWechats(),
      wechatInfos: WechatInfoFlyweightFactory.getWechatInfos(),
      chatrooms: ChatroomFlyweightFactory.getChatrooms(),
      WechatInfoFlyweightFactory: WechatInfoFlyweightFactory,
      WechatFlyweightFactory: WechatFlyweightFactory,
      FriendFlyweightFatory: FriendFlyweightFatory,
      ChatroomFlyweightFactory: ChatroomFlyweightFactory,
      RecentFlyweightFactory: RecentFlyweightFactory
    }
  },
  computed: {
    friendData() {
      return function(personalid) {
        personalid = personalid ? personalid : WechatFlyweightFactory.getWechats().map(item => item.personalid).getRdItem();
        if (this.active === 'friendOpt') this.friendOptForm.personalid = personalid;
        let wechat = WechatFlyweightFactory.getWechat(personalid);
        if (wechat) {
          return wechat.getFriendList().map(item => {
            return {
              type: 0, // CHANGETYPE
              friendsid: item.friendsid,
              personalid: item.personalid,
              wechatid: item.getWechatid(),
              nickname: item.getNickname(),
              remark: item.remark,
              groupid: item.groupid,
              messageunreadcount: item.messageunreadcount
            }
          });
        }
        return [];
      }
    },
    chatroomData() {
      return function(personalid) {
        personalid = personalid ? personalid : WechatFlyweightFactory.getWechats().map(item => item.personalid).getRdItem();
        if (this.active === 'chatroomOpt') this.chatroomOptForm.personalid = personalid;
        let wechat = WechatFlyweightFactory.getWechat(personalid);
        if (wechat) {
          return wechat.getChatroomList().map(item => {
            return {
              type: 0,
              personalid: item.personalid,
              clusterid: item.clusterid,
              groupid: item.groupid,
              wxchatroomid: item.getWechatid(),
              clustername: item.getNickname(),
              headimgurl: item.getHeadimgurl(),
              remark: item.remark,
              membercount: item.membercount,
              messageunreadcount: item.messageunreadcount,
              memberlist: item.memberlist,
              returnname: item.returnname,
              isreturnname: item.isreturnname,
              isowner: item.isowner,
              ismanager: item.ismanager,
              ownerallowflag: item.ownerallowflag
            };
          });
        }
        return [];
      }
    },
    chatroomMember() {
      return function(clusterid) {
        let chatroom = ChatroomFlyweightFactory.getChatroom(clusterid);
        let memberIds = chatroom.memberIds;
        return chatroom.getMemberListByMemberIds(memberIds);
      }
    }
  },
  methods: {
    generate() {
      let { type, num, chattype, personalid } = this.generateform;
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
    },
    personalOpt() {
      let { personalid, onlinestatus } = this.personalOptForm;
      onPersonalStatsChanged(personalid, onlinestatus);
    },
    personalOptUnreadmsgcnt() {
      let { personalid, unreadmsgcnt } = this.personalOptForm;
      personalid = personalid ? personalid : WechatFlyweightFactory.getWechats().map(item => item.personalid).getRdItem();
      let wechat = WechatFlyweightFactory.getWechat(personalid);
      if (wechat) {
        wechat.setUnreadmsgcnt(unreadmsgcnt);
      }
    },
    personalOptNotthroughtcount() {
      let { personalid, notthroughcount } = this.personalOptForm;
      personalid = personalid ? personalid : WechatFlyweightFactory.getWechats().map(item => item.personalid).getRdItem();
      let wechat = WechatFlyweightFactory.getWechat(personalid);
      if (wechat) {
        wechat.setNotthroughcount(notthroughcount);
      }
    },
    addFriendOpt() {
      let { personalid } = this.friendOptForm;
      GeneratorFactory.generateFriend(1, personalid);
    },
    editFriendOpt(item) {
      let { type } = item;
      if (!type) {
        item.type = __changetype__.MODIFY;
      } else if (type === __changetype__.MODIFY) {
        item.type = 0;
        let { personalid } = this.friendOptForm;
        let { friendsid, nickname, remark, groupid, messageunreadcount } = item;
        let friend = FriendFlyweightFatory.getFriend(friendsid);
        if (friend) {
          friend.setExtraInfoByKeyVal({ nickname, remark, groupid, messageunreadcount });
          friend.refreshUnreadmsgCnt(messageunreadcount);
        }
      }
    },
    deleteFriendOpt(item) {
      let { friendsid, messageunreadcount } = item;
      let friend = FriendFlyweightFatory.getFriend(friendsid);
      if (friend) {
        friend.refreshUnreadmsgCnt(-messageunreadcount);
        friend.remove();
      }
    },
    transferFriendOpt({ personalid, item }) {
      let { friendsid } = item;
      let friend = FriendFlyweightFatory.getFriend(friendsid);
      if (friend) {
        friend.transferSubordinate(personalid);
      }
    },
    addChatroomOpt() {
      let { personalid } = this.chatroomOptForm;
      GeneratorFactory.generateChatroom(1, personalid);
    },
    editChatroomOpt(item) {
      let { type } = item;
      if (!type) {
        item.type = __changetype__.MODIFY;
      } else if (type === __changetype__.MODIFY) {
        item.type = 0;
        let { personalid } = this.chatroomOptForm;
        let { clusterid, clustername, remark, groupid, messageunreadcount } = item;
        let chatroom = ChatroomFlyweightFactory.getChatroom(clusterid);
        if (chatroom) {
          chatroom.setExtraInfoByKeyVal({ clustername, remark, groupid, messageunreadcount });
          chatroom.refreshUnreadmsgCnt(messageunreadcount);
        }
      }
    },
    transferChatroomOpt({ personalid, item }) {
      let { clusterid } = item;
      let chatroom = ChatroomFlyweightFactory.getChatroom(clusterid);
      if (chatroom) {
        chatroom.transferSubordinate(personalid);
      }
    }
  }
}
</script>

<style>
div.state {
  border: 1px solid #EBEEF5;
  border-radius: 5px;
  margin: 20px;
  padding: 30px 10px 10px;
}

div.state .item {
  margin: 0 8px;
}

div.state .item .el-badge__content {
  top: 10px;
  right: 7px;
}

header.operate {
  min-height: 80px;
  height: auto !important;
}

.operate .el-form-item__content {
  text-align: left;
}

.operate .el-form-item__content>* {
  margin-right: 5px;
}

.personal {
  margin-bottom: 15px;
}

.personal .el-card__body {
  padding: 5px;
}

.personal .el-card__header div>* {
  margin-right: 10px;
}

.personal .el-card__header div.el-radio-group>* {
  margin-right: 0;
}

.state .el-collapse,
.personal .el-collapse {
  border-top: none;
  border-bottom: none;
}

.state .el-collapse-item__header,
.personal .el-collapse-item__header {
  height: 36px;
  line-height: 36px;
}

.personal .el-collapse-item__header button {
  padding: 5px;
  margin-left: 12px;
}

.personal .el-collapse-item__header .el-badge sup {
  top: 10px;
}

.membercount.el-badge sup {
  top: 9px;
}

pre {
  text-align: left;
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
}

.string {
  color: green;
}

.number {
  color: darkorange;
}

.boolean {
  color: blue;
}

.null {
  color: magenta;
}

.key {
  color: red;
}
</style>