export default class ExtraInfo {
  constructor() {
    this.attributes = new Set();
  }
  setExtraInfo( extraInfo = {} ) {
    const self = this;
    for ( var k in extraInfo ) {
      if ( self.attributes.has( k ) ) {
        // console.log('- super-----has->'+ self.attributes.has(k) +', k: '+k, extraInfo[k]);
        self[ k ] = extraInfo[ k ];
      }
    }
  }
  setAttributes( attributes ) {
    this.attributes = new Set( attributes );
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
}

export function ExtraInfoMixin( Base ) {
  return class ExtraInfoBehavior extends Base {
    constructor( ...args ) {
      super( ...args );
    }
    getExtraInfoByKey( key ) {
      if ( !this.attributes.has( key ) && this.wechatInfo ) {
        return this.wechatInfo.getExtraInfoByKey( key );
      } else {
        return super.getExtraInfoByKey( key );
      }
    }
    setExtraInfoByKey( key, val ) {
      if ( !this.attributes.has( key ) && this.wechatInfo ) {
        return this.wechatInfo.setExtraInfoByKey( key, val );
      } else {
        return super.setExtraInfoByKey( key, val );
      }
    }
    getNickname() {
      if ( !this.attributes.has( key ) ) {
        if ( this.wechatInfo ) {
          return this.wechatInfo.getExtraInfoByKey( 'nickname' );
        }
      } else {
        return this.getExtraInfoByKey( 'nickname' );
      }
    }
    getWechatid() {
      if ( !this.attributes.has( key ) ) {
        if ( this.wechatInfo ) {
          return this.wechatInfo.getExtraInfoByKey( 'wechatid' );
        }
      } else {
        return this.getExtraInfoByKey( 'wechatid' );
      }
    }
    getHeadimgurl() {
      if ( !this.attributes.has( key ) ) {
        if ( this.wechatInfo ) {
          return this.wechatInfo.getExtraInfoByKey( 'headimgurl' );
        }
      } else {
        return this.getExtraInfoByKey( 'headimgurl' );
      }
    }
    getWechatno() {
      if ( !this.attributes.has( key ) ) {
        if ( this.wechatInfo ) {
          return this.wechatInfo.getExtraInfoByKey( 'wechatno' );
        }
      } else {
        return this.getExtraInfoByKey( 'wechatno' );
      }
    }
  }
}