import WechatFactory from "../model/wechat";

let result = {
  Result: [
    {
      personalid: 9661,
      wechatid: "wxid_2tvf9y1ndag622",
      wechatno: "wg18601",
      nickname: "乌云125",
      headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/ZedicGuxtb6ISND1u5Jnx3AmUIbJy7pjC6NgUs1mbibibVg4zDYGoUvaAdPv1NUd6PCDTFxqD4icN6icNYT1kVmD0ySSHHmTMSVvsrvgic4hRNB3s/0",
      remark: "",
      onlinestatus: 1
    }
  ],
  Status: 1,
  Code: "1000",
  Message: "成功"
};

let wechats = result["Result"];
for (let i = 0; i < wechats.length; i++) {
  let wechatInfo = wechats[i];
  let { personalid, wechatid } = wechatInfo;
  let wechat = WechatFactory.getWechat(personalid, wechatid);
  wechat.setExtraInfo(wechatInfo);
}
let num = WechatFactory.getWechats().length;
let firstWechat = WechatFactory.getFristWechat();

console.log("当前个人号个数：", num);
console.log("第一个个人号：", firstWechat);
