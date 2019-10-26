import RecentFactory from "../model/recent";

let result = {
  Result: [
    {
      personalid: 9661,
      chattargettype: 1,
      chattargetid: 651098,
      wechatid: "wxid_efhd7m6h6jhv22",
      nickname: "明城",
      headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/krcM2NoEV3vsk9MEVNGIQU72wiczTh5UdYZ6Dy21AjAxoZGnLLkibQHGsiaHU9xc6OxV0e9GC7Iaoc45BnFdw68azkkKCPgGgQw4ian3Pjs7540/0",
      remark: "",
      stick: 0,
      unreadmsgcount: 1,
      lastmsg: { issend: 0, locmsgid: "15719712905370006", msgtype: 50001, content: "admin 将此好友从 系统 转接给 13800000000(admin)", createtimestamp: 1571971290537 },
      datastatus: 2,
      disturbsetting: 2
    },
    {
      personalid: 9661,
      chattargettype: 2,
      chattargetid: 38976,
      wechatid: "22431750377@chatroom",
      nickname: "555555555",
      headimgurl: "http://wx.qlogo.cn/mmcrhead/oyG9nzLg9aKj5WxDZTeqktjq3l82kw1B3rDp9ny8HHH9ic5eEzAicUmP1YdzY7jH8lVorRlGeibfHrrmFW17A9PmKbgpCS7wBt2/0",
      remark: "",
      stick: 0,
      unreadmsgcount: 3,
      lastmsg: {
        locmsgid: "1187610336314167296",
        msgtype: 1,
        content: '{"text":"1221"}',
        createtimestamp: 1571983342002
      },
      datastatus: 2,
      disturbsetting: 2
    }
  ],
  Status: 1,
  Code: "1000",
  Message: "成功"
};

let recentInfos = result["Result"];
recentInfos.forEach(recentInfo => {
  let recent = RecentFactory.getRecentInstance(recentInfo);
  console.log(recent);
  let wechat = recent.findSubordinateWechat();
  wechat.toString();
});
