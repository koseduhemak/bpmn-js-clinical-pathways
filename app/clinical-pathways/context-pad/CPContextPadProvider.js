'use strict';

var inherits = require('inherits');

var ContextPadProvider = require('bpmn-js/lib/features/context-pad/ContextPadProvider');

var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;

var assign = require('lodash/object/assign'),
    bind = require('lodash/function/bind');

function CPContextPadProvider(eventBus, contextPad, modeling, elementFactory, connect,
                              create, popupMenu, canvas, rules, translate) {

    ContextPadProvider.call(this, eventBus, contextPad, modeling, elementFactory, connect, create,
        popupMenu, canvas, rules, translate);

    var cached = bind(this.getContextPadEntries, this);

    this.getContextPadEntries = function (element) {

        var businessObject = element.businessObject;
        var actions = cached(element);
        var newActions = {};

        function startConnect(event, element, autoActivate) {
            connect.start(event, element, autoActivate);
        }

        // we only want the delete action for custom FlowNode elements
        if (isAny(businessObject, ['cp:CPResource', 'cp:ClinicalStatement', 'cp:CaseChart', 'cp:ResourceBundle', 'cp:AbstractContainerElement', 'cp:Document', 'cp:StructuredDocumentReference'])) {
            var cachedActions = actions;
            newActions = {
                delete: cachedActions.delete
            };

            if (isAny(businessObject, ['cp:UnstructuredDocument', 'cp:CPResource', 'cp:ClinicalStatement'])) {
                newActions.replace = cachedActions.replace
            }

            actions = newActions;
        }

        // if we have custom elements that should connect to other elements they have to be listed here
        if (isAny(businessObject, ['cp:CPResource', 'cp:ClinicalStatement', 'cp:CaseChart', 'cp:ResourceBundle', 'cp:ClinicalDocument', 'cp:Document'])) {

            assign(actions, {
                'connect': {
                    group: 'connect',
                    className: 'bpmn-icon-connection-multi',
                    title: translate('Connect using custom connection'),
                    action: {
                        click: startConnect,
                        dragstart: startConnect
                    }
                }
            });
        }

        return actions;
    };
}

inherits(CPContextPadProvider, ContextPadProvider);

CPContextPadProvider.$inject = [
    'eventBus',
    'contextPad',
    'modeling',
    'elementFactory',
    'connect',
    'create',
    'popupMenu',
    'canvas',
    'rules',
    'translate'
];

module.exports = CPContextPadProvider;