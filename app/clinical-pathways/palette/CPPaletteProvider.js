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
        'create-therapy-task': createAction(
            'cp:TherapyTask', 'cp', Icons.iconTherapyTask
        ),
        'create-diagnosis-task': createAction(
            'cp:DiagnosisTask', 'cp', Icons.iconDiagnosisTask
        ),
        'create-supporting-task': createAction(
            'cp:SupportingTask', 'cp', Icons.iconSupportingTask
        ),
        'create-document': createAction(
            'cp:Document', 'cp', Icons.iconDocument
        ),
        'create-simultan-parallel-gateway': createAction(
            'cp:SimultanParallelGateway', 'cp', Icons.iconSimultanParallelGateway
        ),
        'create-evidence-gateway': createAction(
            'cp:EvidenceGateway', 'cp', Icons.iconEvidenceGateway
        ),
        'create-resource': createAction(
            'cp:CPResource', 'cp', Icons.iconResource
        )
    });

    return actions;
};

module.exports = CPPaletteProvider;