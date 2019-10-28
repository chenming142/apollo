import GeneratorFactory from "../api/generate";

(function main() {
  GeneratorFactory.generateWechat(10);

  GeneratorFactory.generateFriend(20);

  GeneratorFactory.generateChatroom(30);

  GeneratorFactory.generateRecent(100);
})();
