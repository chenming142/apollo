import Logging from '../api/logging';

const helperLogging = Logging.getLogger( 'helper' );

Array.prototype.getRdItem = function () {
  return this[ Math.floor( Math.random() * this.length ) ];
}

export function generateRdNum( min, max ) {
  switch ( arguments.length ) {
    case 1:
      return parseInt( Math.random() * min + 1, 10 );
      break;
    case 2:
      return parseInt( Math.random() * ( max - min + 1 ) + min, 10 );
      break;
  }
}
let arr = Array.from( { length: 10 }, () => generateRdNum( 0, 1 ) );
// helperLogging.info( arr );

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(H)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function ( fmt ) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor( ( this.getMonth() + 3 ) / 3 ), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if ( /(y+)/.test( fmt ) )
    fmt = fmt.replace( RegExp.$1, ( this.getFullYear() + "" ).substr( 4 - RegExp.$1.length ) );
  for ( var k in o )
    if ( new RegExp( "(" + k + ")" ).test( fmt ) )
      fmt = fmt.replace( RegExp.$1, ( RegExp.$1.length == 1 ) ? ( o[ k ] ) : ( ( "00" + o[ k ] ).substr( ( "" + o[ k ] ).length ) ) );
  return fmt;
}

String.prototype.capitalize = function () {
  return this.charAt( 0 ).toUpperCase() + this.toString().slice( 1 );
}

export function formatJson( json ) {
  if ( typeof json != 'string' ) {
    json = JSON.stringify( json, undefined, 2 );
  }
  json = json.replace( /&/g, '&' ).replace( /</g, '<' ).replace( />/g, '>' );
  return json.replace( /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function ( match ) {
    var cls = 'number';
    if ( /^"/.test( match ) ) {
      if ( /:$/.test( match ) ) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if ( /true|false/.test( match ) ) {
      cls = 'boolean';
    } else if ( /null/.test( match ) ) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  } );
}