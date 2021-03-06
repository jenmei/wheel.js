Wheel.Model = Wheel.Base.subclass({
  optionize: function(opts) {
    var normalOpts = {};
    var opt;
    for( opt in opts ) {
      if ( typeof this._class.prototype[opt] == 'function' ) {
        this['_'+opt] = opts[opt];
      } else {
        normalOpts[opt] = opts[opt];
      }
    }
    this._super(normalOpts);
  },

  // state -------------------------------------
  isNew: function() {
    return !this.id;
  },

  // CRUDiness
  url: function() {
    this._basePath = this._basePath || this._class.basePath();
    return this.isNew() ?  this._basePath : this._basePath + '/' + this.id;
  },

  properties: function() {
    var propNames = this._class.allProperties();
    var i = propNames.length-1;
    var properties = {};

    for (i; i >= 0; i--) {
      properties[propNames[i]] = this[propNames[i]]();
    }
    return properties;
  },

  data: function() {
    return this.properties();
  },

  save: function() {
    var success, httpMethod;
    if (this.isNew()) {
      success = this.onSave;
      httpMethod = 'post';
    } else {
      success = this.onUpdate;
      httpMethod = 'put';
      this._class.triggerUpdate(this);
    }

    this.send({
      success: success,
      type: httpMethod
    });
  },

  onSave: function(json) {
    this.id = json.id;
    var self = this;
    this._class.onUpdate( this.id, function(model) {
      self.sync(model);
    });
  },

  onUpdate: function(json) {
    // nothing doing, overwrite it for more joy
  },

  sync: function(model) {
    this.optionize(model.properties());
    return this;
  },

  reload: function() {
    if (this.isNew()) return;
    this.send({
      success: this.onReload
    });
  },

  onReload: function(json) {
    this.optionize(json);
    this.trigger('reloaded');
    this._class.triggerUpdate(this);
  },

  delete: function() {
    if (this.isNew()) return;
    this.send({
      type: 'delete'
    });
    this._class.triggerDelete(this);
  }
}, {
  attrAccessor: function(prop) {
    var propId = '_'+prop;
    this.prototype[prop] = function(value){
      if (value !== undefined) {
        if (self[propId] != value) {
          this.trigger('change');
          this.trigger('change:'+prop);
          this._dirty = true;
        }
        this[propId] = value;
      }
      return this[propId];
    };
  },

  subclass: function(name, iprops, cprops) {
    var klass = this._subclass(name, iprops, cprops);
    if (klass.properties && klass.properties.length) {
      $.each(klass.properties, function(i, prop) {
        if ( typeof klass.prototype[prop] != 'function' ) {
          klass.attrAccessor(prop);
        }
      });
    }
    return klass;
  },

  basePath: function() {
    if (this._basePath) { return this._basePath; }
    if (this.id) {
      var parts = this.id.toLowerCase().split('.');
      this._basePath = "/" + Wheel.Utils.pluralize(parts[parts.length-1]);
      return this._basePath;
    } else {
      throw "Model has no 'id' property, and a url cannot be inferred. Please add an 'id' to the class, or overwrite baseUrl to return the desired path";
    }
  },

  allProperties: function() {
    var props = (this.properties || []).slice(0);
    var superProps = (
      this.superclass && this.superclass.allProperties && this.superclass.allProperties().slice(0)
    ) || [];
    return superProps.concat(props);
  },

  create: function(opts) {
    return this.build(opts).save();
  },

  _eventKey: function(id, preface) {
    preface = preface || 'update'
    return preface + ':' + id;
  },

  onUpdate: function(id, callback) {
    this.on(this._eventKey(id), callback);
  },

  triggerUpdate: function(model) {
    this.trigger(this._eventKey(model.id), model);
  },

  triggerDelete: function(model) {
    this.trigger(this._eventKey(model.id, 'delete'));
  }
});
Wheel.Model.mixin(Wheel.Mixins.Ajax);
Wheel.Model.mashin(Wheel.Mixins.Events);
