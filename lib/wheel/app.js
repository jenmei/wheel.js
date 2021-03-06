Wheel.App = Wheel.Class.Singleton.subclass({
  init: function() {
    window.app = this;

    this.connectionChecker = Wheel.Utils.ConnectionChecker.build();
    this.requestQueue = Wheel.Utils.RequestQueue.build({app: this});
    this.eventManager = Modernizr.touch ? Wheel.TouchManager.build() : Wheel.MouseManager.build();

    this.listen();
  },

  listen: function() {
    var self = this;
    this.connectionChecker.on('offline', function() {
      self.connected(false);
    });
    this.connectionChecker.on('online', function() {
      self.connected(true);
    });
  },

  checkConnection: function() {
    if ( ('onLine' in navigator) && (navigator.onLine == false)) {
      this.connected(false);
    } else {
      this.connectionChecker.test();
    }
  },

  connected: function(value) {
    if (value != undefined && this._connected != value) {
      var event = value ? 'online' : 'offline';
      this._connected = value;
      this.trigger(event);
    }
    if (value === false) this.trigger('offline-beacon');
    return this._connected;
  }
}, {
  View: {},
  Model: {}
});
