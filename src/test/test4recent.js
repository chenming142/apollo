import RecentFactory, {RecentFlyweightFactory} from "../model/recent";
import Logging from '../api/logging';

const recentLog = Logging.getLogger('recent');

let recents = RecentFlyweightFactory.getRecentList();
recentLog.info("最近联系人的个数：" + recents.length, recents);
