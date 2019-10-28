import RecentFactory, {RecentFlyweightFactory} from "../model/recent";

let recents = RecentFlyweightFactory.getRecentList();
console.log("最近联系人的个数：" + recents.length, recents);
