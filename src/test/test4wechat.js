import WechatFactory from "../model/wechat";
import Logging from '../api/logging';

let wechats = WechatFactory.getWechats();
let num = wechats.length;
let firstWechat = WechatFactory.getFristWechat();

Logging.info("当前个人号个数：", num);
Logging.info(wechats);
wechats.forEach(item => item.toString());
Logging.info("第一个个人号：", firstWechat);
