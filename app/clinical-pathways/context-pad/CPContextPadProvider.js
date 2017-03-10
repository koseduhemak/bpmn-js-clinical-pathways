'use strict';

var inherits = require('inherits');

var ContextPadProvider = require('bpmn-js/lib/features/context-pad/ContextPadProvider');

var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;

var assign = require('lodash/object/assign'),
    bind = require('lodash/function/bind');

function CustomContextPadProvider(eventBus, contextPad, modeling, elementFactory, connect,
                                  create, popupMenu, canvas, rules, translate) {

    ContextPadProvider.call(this, eventBus, contextPad, modeling, elementFactory, connect, create,
        popupMenu, canvas, rules, translate);

    var cached = bind(this.getContextPadEntries, this);

    this.getContextPadEntries = function(element) {
        console.log(element.type);
        var actions = cached(element);

        var businessObject = element.businessObject;

        function startConnect(event, element, autoActivate) {
            connect.start(event, element, autoActivate);
        }

        // todo add new elements to ContextPad here...
        /*if (isAny(businessObject, [ 'custom:triangle', 'custom:circle'])) {
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
        }*/

        return actions;
    };
}

inherits(CustomContextPadProvider, ContextPadProvider);

CustomContextPadProvider.$inject = [
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

module.exports = CustomContextPadProvider;