import { ChatroomFlyweightFactory } from '../model/chatroom';

import Logging from '../api/logging';

const chatroomLog = Logging.getLogger( 'chatroom' );

let chatrooms = ChatroomFlyweightFactory.getChatrooms();
chatrooms.forEach( chatroom => {
  // chatroomLog.info( chatroom.getNickname() );
} );
console.log( '\n--- test4chatroom -------------------------------' );
chatroomLog.info( "群的个数：" + chatrooms.size, chatrooms );
//chatrooms.forEach( item => item.toString() );