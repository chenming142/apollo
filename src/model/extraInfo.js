import '../utils/helper';

export default class ExtraInfo {
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
}

export function ExtraInfoMixin( Base ) {
  return class ExtraInfoBehavior extends Base {
    constructor( ...args ) {
      super( ...args );
      this._specificPropertiesMethod();
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
    _specificPropertiesMethod() {
      const self = this;
      const SPECIFIC_PROPERTIES_LIST = [ 'nickname', 'wechatid', 'headimgurl', 'wechatno' ];

      SPECIFIC_PROPERTIES_LIST.forEach( property => {
        self[ 'get' + property.capitalize() ] = function () {
          if ( !self.attributes.has( property ) ) {
            if ( self.wechatInfo ) {
              return self.wechatInfo.getExtraInfoByKey( property );
            }
          } else {
            return self.getExtraInfoByKey( property );
          }
        }
      } );
    }
  }
}