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

/**
 * This function fills the modeling palette.
 * @returns {{}}
 */
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
        'resources-separator': {
            group: 'cpResources',
            separator: true
        },
        'create-resource-bundle': createAction(
            'cp:ResourceBundle', 'cpResources', Icons.iconResourceBundle, 'Create Resource Bundle'
        ),
        'create-resource': createAction(
            'cp:CPResource', 'cpResources', Icons.iconResource, 'Create CP Resource'
        ),
        'documents-separator': {
            group: 'cpResources',
            separator: true
        },

        'create-document': createAction(
            'cp:Document', 'cpDocuments', Icons.iconDocument, 'Create an Document'
        ),
        'create-unstructured-document': createAction(
            'cp:VideoDocument', 'cpDocuments', Icons.iconUnstructuredDocument, 'Create an Unstructured Document'
        ),

        'create-structured-document': createAction(
            'cp:StructuredDocument', 'cpDocuments', Icons.iconStructuredDocument, 'Create a Structured Document'
        ),

        'create-structured-document-reference': createAction(
            'cp:StructuredDocumentReference', 'cpDocuments', Icons.iconStructuredDocumentReference, 'Create a Reference of an Structured Document'
        ),
        'create-case-chart': createAction(
            'cp:CaseChart', 'cpDocuments', Icons.iconCaseChart, 'Create Case Chart'
        ),
        'create-segment': createAction(
            'cp:Segment', 'cpDocuments', Icons.iconSegment, 'Create Segment'
        ),
        'create-organizer': createAction(
            'cp:Organizer', 'cpDocuments', Icons.iconOrganizer, 'Create Organizer'
        ),
        'create-clinical-statement': createAction(
            'cp:Observation', 'cpDocuments', Icons.iconClinicalStatement, 'Create Statement'
        ),
        'create-objective': createAction(
            'cp:Objective', 'cpDocuments', Icons.iconObjective, 'Create Objective'
        ),
        'create-quality-indicator': createAction(
            'cp:QualityIndicator', 'cpDocuments', Icons.iconQualityIndicator, 'Create Quality Indicator'
        )
    });

    return actions;
};

module.exports = CPPaletteProvider;