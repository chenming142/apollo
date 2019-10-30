import RecentFactory, { RecentFlyweightFactory } from "../model/recent";
import Logging from '../api/logging';

const recentLog = Logging.getLogger( 'recent' );

let recents = RecentFlyweightFactory.getRecentList();
console.log( '\n--- test4recent -------------------------------' );
recentLog.info( "最近联系人的个数：" + recents.length, recents );