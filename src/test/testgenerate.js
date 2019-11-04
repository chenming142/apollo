import GeneratorFactory from "../api/generate";

( function main() {
  GeneratorFactory.generateWechat( 3 );

  GeneratorFactory.generateFriend( 5 );

  GeneratorFactory.generateChatroom( 5 );

  GeneratorFactory.generateRecent( 10 );
} )();