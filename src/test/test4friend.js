import { FriendFlyweightFatory } from "../model/friend";

import Logging from '../api/logging';

const friendLog = Logging.getLogger( 'friend' );

let friends = FriendFlyweightFatory.getFriends();
console.log( '\n--- test4friend -------------------------------' );
friendLog.info( "好友的个数：" + Object.entries( friends ).length, friends );