'use strict';
var inherits = require('inherits');

var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny,
    bind = require('lodash/function/bind');

var BpmnImporter = require('bpmn-js/lib/import/BpmnImporter');

function CPImporter(eventBus, canvas, elementFactory, elementRegistry, translate, labelBehavior) {
    BpmnImporter.call(eventBus, canvas, elementFactory, elementRegistry, translate);

    var cached = bind(this.add, this);

    this._eventBus = eventBus;
    this._canvas = canvas;

    this._elementFactory = elementFactory;
    this._elementRegistry = elementRegistry;
    this._translate = translate;

    this.add = function(semantic, parentElement) {
        var element = cached(semantic, parentElement);

        // render external labels
        if (labelBehavior.hasExternalLabel(semantic)) {
            this.addLabel(semantic, element);
        }

        return element;
    };


}

inherits(CPImporter, BpmnImporter);

CPImporter.$inject = [ 'eventBus', 'canvas', 'elementFactory', 'elementRegistry', 'translate', 'labelBehavior' ];

module.exports = CPImporter;