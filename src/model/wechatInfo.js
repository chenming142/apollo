import '../utils/helper';

import Logging from '../api/logging';
const extraInfoLog = Logging.getLogger( 'extraInfo' );
const wechatInfoLog = Logging.getLogger( 'wechatInfo' );

export class ExtraInfo {
  constructor() {
    this.attributes = new Set();
  }
  setAttributes( attributes ) {
    this.attributes = new Set( attributes );
  }
  setExtraInfo( extraInfo = {} ) {
    const self = this;
    for ( var k in extraInfo ) {
      if ( self.attributes.has( k ) ) {
        self[ k ] = extraInfo[ k ];
      }
    }
  }
  getExtraInfoByKey( key ) {
    const self = this;
    if ( !self.attributes.has( key ) ) {
      throw Error( "ExtraInfo 不含有该 " + key + "的属性" );
    }
    let extraInfo = self[ key ];
    return extraInfo ? extraInfo : null;
  }
  setExtraInfoByKey( key, val ) {
    if ( !this.attributes.has( key ) ) {
      throw Error( "ExtraInfo 不含有该 " + key + "的属性, 无法设置值：" + val );
    } else {
      this[ key ] = val;
    }
  }
  getWechatInfo() { return WechatInfoFlyweightFactory.getWechatInfo( this.wechatInfoKey ); }
}

export function ExtraInfoMixin( Base ) {
  return class ExtraInfoBehavior extends Base {
    constructor( ...args ) {
      super( ...args );
      this._specificPropertiesMethod();
    }
    getExtraInfoByKey( key ) {
      if ( !this.attributes.has( key ) && this.getWechatInfo() ) {
        return this.getWechatInfo().getExtraInfoByKey( key );
      } else {
        return super.getExtraInfoByKey( key );
      }
    }
    setExtraInfoByKey( key, val ) {
      if ( !this.attributes.has( key ) && this.getWechatInfo() ) {
        return this.getWechatInfo().setExtraInfoByKey( key, val );
      } else {
        return super.setExtraInfoByKey( key, val );
      }
    }
    setExtraInfoByKeyVal( keyVals ) {
      const self = this;
      Object.entries( keyVals ).forEach( ( [ key, val ] ) => {
        self.setExtraInfoByKey( key, val );
      } );
      self.reactiveSubordinate();
    }
    _specificPropertiesMethod() {
      const self = this;
      const SPECIFIC_PROPERTIES_LIST = [ 'nickname', 'wechatid', 'headimgurl', 'wechatno' ];

      SPECIFIC_PROPERTIES_LIST.forEach( property => {
        self[ 'get' + property.capitalize() ] = function () {
          if ( !self.attributes.has( property ) ) {
            let wechatInfo = self.getWechatInfo();
            if ( wechatInfo ) {
              return wechatInfo.getExtraInfoByKey( property );
            }
          } else {
            return self.getExtraInfoByKey( property );
          }
        }
      } );
    }
  }
}

export class WechatInfo extends ExtraInfoMixin( ExtraInfo ) {
  constructor( wechatid ) {
    super();
    this.wechatid = wechatid;
    this.setAttributes( WechatInfo.attributes );
  }
}
WechatInfo.attributes = [ "wechatid", "wechatno", "nickname", "headimgurl", "remark" ];

export default class WechatInfoFactory {
  static getWechatInfoInstance( wechatid ) { return this.checkWechatInfoNew( wechatid ); }
  static checkWechatInfoNew( wechatid ) {
    const self = this;
    let wechatInfos = WechatInfoFlyweightFactory.getWechatInfos();
    if ( !wechatInfos.hasWechatInfo( wechatid ) ) {
      return self.getWechatInfoByApi( wechatid );
    }
    return WechatInfoFlyweightFactory.getWechatInfo( wechatid );
  }
  static getWechatInfoByApi( wechatid ) {
    let _wechatInfo = WechatInfoFlyweightFactory.getWechatInfo( wechatid );
    if ( !_wechatInfo ) {
      wechatInfoLog.error( "- 调用Api接口，获取微信基础信息：" + wechatid + ",失败~" );
    }
    let wechatInfo = WechatInfoFlyweightFactory.getWechatInfo( wechatid );
    wechatInfo.setExtraInfo( _wechatInfo );
  }
}

export class WechatInfoFlyweightFactory {
  static getWechatInfo( wechatid ) {
    const self = this;
    let wechatInfos = self.getWechatInfos(),
      wechatInfo;
    if ( self.hasWechatInfo( wechatid ) ) {
      wechatInfo = wechatInfos[ wechatid ];
      return wechatInfo;
    } else {
      let wechatInfo = new WechatInfo( wechatid );
      wechatInfos[ wechatid ] = wechatInfo;
      return wechatInfo;
    }
  }
  static hasWechatInfo( wechatid ) {
    const self = this;
    let wechatInfos = self.getWechatInfos();
    return Object.keys( wechatInfos ).includes( String( wechatid ) );
  }
  static getWechatInfosSize() { return Object.keys( this.getWechatInfos() ).length; }
  static getWechatInfos() { return this.getInstance().wechatInfos; }
  static getInstance() {
    const ctor = this;
    return ( function () {
      if ( !ctor.instance ) {
        ctor.instance = new ctor();
        ctor.instance.wechatInfos = {};
      }
      return ctor.instance;
    } )();
  }
}