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
        'create-resource-bundle': createAction(
            'cp:ResourceBundle', 'cp', Icons.iconResourceBundle
        ),
        'create-resource': createAction(
            'cp:CPResource', 'cp', Icons.iconResource
        ),
        'create-document': createAction(
            'cp:Document', 'cp', Icons.iconDocument
        ),
        'create-case-chart': createAction(
            'cp:CaseChart', 'cp', Icons.iconCaseChart
        ),
        'create-structured-document': createAction(
            'cp:StructuredDocument', 'cp-Documents', Icons.iconStructuredDocument
        ),
        'create-segment': createAction(
            'cp:Segment', 'cp-Documents', Icons.iconSegment
        ),
        'create-organizer': createAction(
            'cp:Organizer', 'cp-Documents', Icons.iconOrganizer
        ),
        'create-clinical-statement': createAction(
            'cp:Observation', 'cp-Documents', Icons.iconClinicalStatement
        )
    });

    return actions;
};

module.exports = CPPaletteProvider;