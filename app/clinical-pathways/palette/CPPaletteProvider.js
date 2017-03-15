var Icons = require('../icons/index');
var assign = require('lodash/object/assign');

/**
 * A provider for quick service task production
 */
function CPPaletteProvider(palette, create, elementFactory) {

    this._create = create;
    this._elementFactory = elementFactory;

    palette.registerProvider(this);
}

CPPaletteProvider.prototype.getPaletteEntries = function () {

    var elementFactory = this._elementFactory,
        create = this._create,
        actions = {};

    function createAction(type, group, imageUrl, title, options) {

        function createListener(event) {
            var shape = elementFactory.createShape(assign({type: type}, options));

            if (options) {
                shape.businessObject.di.isExpanded = options.isExpanded;
            }

            create.start(event, shape);
        }

        var shortType = type.replace(/^cp\:/, '');

        return {
            group: group,
            title: title || 'Create ' + shortType,
            imageUrl: imageUrl,
            action: {
                dragstart: createListener,
                click: createListener
            }
        };
    }

    assign(actions, {
        'create-document': createAction(
            'cp:ClinicalDocument', 'cp', Icons.iconDocument
        ),
        'create-resource': createAction(
            'cp:CPResource', 'cp', Icons.iconResource
        )
    });

    return actions;
};

module.exports = CPPaletteProvider;