var Cat = require('../cat/index');


/**
 * A provider for quick service task production
 */
function NyanPaletteProvider(palette, create, elementFactory) {

  this._create = create;
  this._elementFactory = elementFactory;

  palette.registerProvider(this);
}

NyanPaletteProvider.prototype.getPaletteEntries = function() {

  var elementFactory = this._elementFactory,
      create = this._create;

  function startCreate(event) {
    var serviceTaskShape = elementFactory.create('shape', { type: 'bpmn:ServiceTask' });
    create.start(event, serviceTaskShape);
  }

  return {
    'create-service-task': {
      group: 'activity',
      title: 'Create a new Therapy Task',
      imageUrl: Cat.imageTaskTherapy,
      action: {
        dragstart: startCreate,
        click: startCreate
      }
    }
  };
};

module.exports = NyanPaletteProvider;