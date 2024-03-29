import WechatFactory, { WechatFlyweightFactory } from "../model/wechat";
import Logging from '../api/logging';

const wechatLog = Logging.getLogger( 'wechat' );

let wechats = WechatFlyweightFactory.getWechats();
let num = wechats.length;
let firstWechat = WechatFactory.getFristWechat();

console.log( '\n--- test4wechat -------------------------------' );
wechatLog.info( "当前个人号个数：", num );
//wechatLog.info( wechats );
wechats.forEach( item => item.toString() );

// wechatLog.info("第一个个人号：", firstWechat);