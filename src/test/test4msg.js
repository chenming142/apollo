import { onFriendInfoChanged } from "../api/events";

(function main() {
  console.log("--- event 测试开始 ----------------");
  let events = [onFriendInfoChanged];
  events.forEach(evt => {
    if (typeof evt === "function") {
      evt();
    }
  });
})();
