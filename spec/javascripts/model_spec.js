describe('Wheel.Model', function() {
  var task, Task;
  beforeEach(function() {
    Task = Wheel.Model.subclass({
      properties: ['name', 'due_at', 'state']
    });
  });

  describe('state', function() {
    describe('isNew', function() {
      it('is false if the object has an id', function() {
        task = Task.create();
        expect(task.isNew()).toBe(false);
      });

      it('is true if the object has an id', function() {
        task = Task.create({id: 1});
        expect(task.isNew()).toBe(true);
      });
    });

    xdescribe('isChanged', function() {
      it('', function() {
        
      });
    });
  });

  xdescribe('properties', function() {
    beforeEach(function() {
      task = Task.create({
        name: 'Do some meta',
        state: 0,
        due_at: null
      });
    });

    it('builds a reader for the attribute', function() {
      expect(task.name()).toBe('Do some meta');
    });
  });

  describe('_attrAccessor(propName)', function() {
    var owner;
    beforeEach(function() {
      task = Task.create({
        name: 'Do some meta',
        state: 0,
        due_at: null
      });
      owner = {name: "Kane"};

      task._attrAccessor('owner');
    });

    it('creates a prototype function with that name', function() {
      expect(typeof Task.prototype.owner == 'function').toBe(true)
    });

    it('created function reads the underscore prefaced property', function() {
      task._owner = owner;
      expect(task.owner()).toBe(owner);
    });

    describe('when given an argument', function() {
      it('it writes to the underscore prefaced property', function() {
        task.owner(owner);
        expect(task._owner).toBe(owner);
      });

      it('returns the value', function() {
        expect(task.owner(owner)).toBe(owner);
      });

      describe('value has changed', function() {
        beforeEach(function() {
          spyOn(task, 'trigger');
          task.owner(owner);
        });

        it('triggers a "change" event', function() {
          expect(task.trigger).toHaveBeenCalled();
        });

        it('triggers an event related to the property changed', function() {
          expect(task.trigger).toHaveBeenCalled();
          expect(task.trigger.mostRecentCall.args[0]).toBe('change:owner');
        });

        it('marks the object as dirty', function() {
          expect(task._dirty).toBe(true);
        });
      });

      describe('value is the same', function() {
        it('does not trigger any events', function() {
          spyOn(task, 'trigger');
          task.owner(task._owner);
          expect(task.trigger).not.toHaveBeenCalled();
        });
      });
    });

    it('can handle multiple declarations in the same class', function() {
      task._attrAccessor('tags');
      var tags = ['neato', 'jazzy']
      task.tags(tags);
      task.owner(owner);
      expect(task.tags()).toBe(tags);
      expect(task.owner()).toBe(owner);
    });
  });

  xdescribe('save', function() {
    describe('object has not been saved', function() {
      it('sends a post request', function() {
        
      });
    });
  });
});
