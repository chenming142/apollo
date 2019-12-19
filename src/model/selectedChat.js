import { ExtraInfo, ExtraInfoMixin, WechatInfoFlyweightFactory } from "./wechatInfo";
import { Message } from "./message";
import { Friend } from "./friend";
import { Chatroom } from "./chatroom";
import { Recent } from './recent';

export class SelectedChat extends ExtraInfoMixin(ExtraInfo) {
  constructor() {
    super();
    this.chattargetid = null;
  }
}
class SelectedChat4Message extends SelectedChat {};
class SelectedChat4Friend extends SelectedChat {};
class SelectedChat4Chatroom extends SelectedChat {};
class SelectedChat4Recent extends SelectedChat {};

export default class SelectedChatFactory {
  static buildSelectedChatInstance(selectedChatInfo) {
    const self = this;
    let selectedChat;
    if (selectedChatInfo instanceof Message) {
      selectedChat = new SelectedChat4Message(selectedChatInfo);
    } else if (selectedChatInfo instanceof Friend) {
      selectedChat = new SelectedChat4Friend(selectedChatInfo);
    } else if (selectedChatInfo instanceof Chatroom) {
      selectedChat = new SelectedChat4Chatroom(selectedChatInfo);
    } else if (selectedChatInfo instanceof Recent) {
      selectedChat = new SelectedChat4Recent(selectedChatInfo);
    }
    self.setSelectedChat(selectedChat);
  }
  static setSelectedChat(selectedChat) { this.getInstance().selectedChat = selectedChat; }
  static getSelectedChat() { return this.getInstance().selectedChat; }
  static getInstance() {
    const ctor = this;
    return (function() {
      if (!ctor.instance) {
        ctor.instance = new ctor();
        ctor.instance.selectedChat = null;
      }
      return ctor.instance;
    })();
  }
}
