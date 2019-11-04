import { ChatroomFlyweightFactory } from '../model/chatroom';

import Logging from '../api/logging';

const chatroomLog = Logging.getLogger( 'chatroom' );

let chatrooms = ChatroomFlyweightFactory.getChatrooms();
Object.entries( chatrooms ).forEach( ( key, chatroom ) => {
  // chatroomLog.info( chatroom.getNickname() );
} );
console.log( '\n--- test4chatroom -------------------------------' );
chatroomLog.info( "群的个数：" + Object.entries( chatrooms ).length, chatrooms );
//chatrooms.forEach( item => item.toString() );