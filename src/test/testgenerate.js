import GeneratorFactory from "../api/generate";

( function main() {
  GeneratorFactory.generateWechat( 1 );

  GeneratorFactory.generateFriend( 5 );

  GeneratorFactory.generateChatroom( 5 );

  //GeneratorFactory.generateRecent( 100 );
} )();