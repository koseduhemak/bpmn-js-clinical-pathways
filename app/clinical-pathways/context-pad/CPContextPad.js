'use strict';

var inherits = require('inherits');

var ContextPadProvider = require('bpmn-js/lib/features/context-pad/ContextPadProvider');

var is = require('bpmn-js/lib/util/ModelUtil').is;

var assign = require('lodash/object/assign'),
    bind = require('lodash/function/bind');

function CPContextPad(eventBus, contextPad, modeling, elementFactory, connect,
                                  create, popupMenu, canvas, rules, translate) {

  ContextPadProvider.call(this, eventBus, contextPad, modeling, elementFactory, connect, create,
                    popupMenu, canvas, rules, translate);

  var cached = bind(this.getContextPadEntries, this);

  this.getContextPadEntries = function(element) {
    var actions = cached(element);

    var businessObject = element.businessObject;

    function startConnect(event, element, autoActivate) {
      connect.start(event, element, autoActivate);
    }

    if (is(businessObject, 'bpmn:task')) {
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

inherits(CPContextPad, ContextPadProvider);

CPContextPad.$inject = [
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

module.exports = CPContextPad;