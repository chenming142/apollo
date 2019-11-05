export function Publisher() {
  this.handlers = {};
}

Publisher.prototype = {
  on: function ( type, handler ) {
    const self = this;
    if ( !( type in self.handlers ) ) {
      self.handlers[ type ] = [];
    }
    self.handlers[ type ].push( handler );
    return self;
  },
  emit: function ( type ) {
    const self = this;
    let handlerArgs = Array.prototype.slice.call( arguments, 1 );
    if ( self.handlers[ type ] && self.handlers[ type ].length > 0 ) {
      for ( let i = 0; i < self.handlers[ type ].length; i++ ) {
        let event = self.handlers[ type ][ i ];
        if ( typeof event === 'function' ) {
          event.apply( self, handlerArgs );
        }
      }
    }
    return self;
  },
  off: function ( type, handler ) {
    const self = this;
    let events, len = 0;
    events = self.handlers[ type ];
    if ( events && events.length > 0 ) {
      delete self.handlers[ type ];
    }
    return self;
  }
};

Publisher.EVENT_KEYS = { unreadmsgcntChange: "UNREADMSGCNTCHANGE" };

Publisher.getInstance = ( function () {
  let instance = null;
  return function ( argument ) {
    if ( !instance ) {
      instance = new Publisher();
    }
    return instance;
  }
} )();

export default Publisher.getInstance();