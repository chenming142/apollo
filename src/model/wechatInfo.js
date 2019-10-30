import ExtraInfo, { ExtraInfoMixin } from "./extraInfo";
import { Chatroom } from './chatroom';
import Logging from '../api/logging';

const wechatInfoLog = Logging.getLogger( 'wechatInfo' );

export class WechatInfo extends ExtraInfoMixin( ExtraInfo ) {
  constructor( wechatid ) {
    super();
    this.wechatid = wechatid;
    this.setAttributes( WechatInfo.attributes );
  }
}
WechatInfo.attributes = [ "wechatid", "wechatno", "nickname", "headimgurl", "remark" ];

export class WechatInfoFactory {
  static getWechatInfoInstance( wechatid ) {
    return this.checkWechatInfoNew( wechatid );
  }
  static checkWechatInfoNew( wechatid ) {
    const self = this;
    let wechatInfos = WechatInfoFlyweightFactory.getWechatInfos();
    if ( !wechatInfos.has( wechatid ) ) {
      return self.getWechatInfoByApi( wechatid );
    }
    return WechatInfoFlyweightFactory.getWechatInfo( wechatid );
  }
  static getWechatInfoByApi( wechatid ) {
    let wechatInfos = [ {
      wechatid: "wxid_5kh88cpn8ez322",
      wechatno: "liq_test",
      nickname: "无处可逃uu让",
      headimgurl: "http://wx.qlogo.cn/mmhead/ver_1/YXaZpbXWFiazbg87rAbYlI0XIrge3aTyYACXQLnibsBHCbuic43TGWPUXHjJzM4yDsOUAQ9tPJ8pFghEBBRUsZ9ds4RydgeKFM0LNfsgVeRdKM/0",
      remark: "",
      sex: 1,
      mobile: "",
      country: "",
      provice: "阿尔及利亚",
      city: "",
      taglist: [],
    } ];
    let _wechatInfo = wechatInfos.find( item => item.wechatid === wechatid );
    if ( !_wechatInfo ) {
      wechatInfoLog.error( "- 调用Api接口，获取微信基础信息：" + wechatid + ",失败~" );
    }
    let wechatInfo = WechatInfoFlyweightFactory.getWechatInfo( wechatid );
    wechatInfo.setExtraInfo( _wechatInfo );
  }
}

export default class WechatInfoFlyweightFactory {
  static getWechatInfo( wechatid ) {
    const self = this;
    let wechatInfos = self.getWechatInfos(),
      wechatInfo;
    if ( wechatInfos.has( wechatid ) ) {
      wechatInfo = wechatInfos.get( wechatid );
      return wechatInfo;
    } else {
      let wechatInfo = new WechatInfo( wechatid );
      wechatInfos.set( wechatid, wechatInfo );
      return wechatInfo;
    }
  }
  static getWechatInfosSize() { return this.getWechatInfos().size; }
  static getWechatInfos() { return this.getInstance().wechatInfos; }
  static getInstance() {
    const ctor = this;
    return ( function () {
      if ( !ctor.instance ) {
        ctor.instance = new ctor();
        ctor.instance.wechatInfos = new Map();
      }
      return ctor.instance;
    } )();
  }
}