'use strict';

var reduce = require('lodash/collection/reduce'),
    inherits = require('inherits'),
    forEach = require('lodash/collection/forEach');

var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');
var is = require('bpmn-js/lib/util/ModelUtil').is;
var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;

var $ = require('jquery');

var evidenceLevel = require('../enums/EvidenceLevel.json');

var HIGH_PRIORITY = 1500;

/**
 * A custom rule provider that decides what elements can be
 * dropped where based on a `vendor:allowDrop` BPMN extension.
 *
 * See {@link BpmnRules} for the default implementation
 * of BPMN 2.0 modeling rules provided by bpmn-js.
 *
 * @param {EventBus} eventBus
 */
var remove = false;
function CPRules(eventBus, overlays, elementFactory) {
    RuleProvider.call(this, eventBus);
    this._eventBus = eventBus;
    this._overlays = overlays;
    this._elementFactory = elementFactory;

    this.registerEventListener();
}

inherits(CPRules, RuleProvider);

CPRules.$inject = ['eventBus', 'overlays', 'elementFactory'];

module.exports = CPRules;

CPRules.prototype.registerEventListener = function () {

    var eventBus = this._eventBus;
    var overlays = this._overlays;

    var self = this;

    eventBus.on('element.changed', HIGH_PRIORITY, function (event) {

        var element = event.element,
            bo = element.businessObject;

        if (isAny(bo, ['bpmn:Task', 'bpmn:Gateway']) && element.type != "label") {

            if (evidenceLevel.includes(bo.get('evidenceIndicator').toUpperCase())) {
                //bo.set('cp:EvidenceLevel', bo.get('evidenceIndicator').toUpperCase());


                try {
                    var overlay_id = overlays.add(element.id, {
                        position: {
                            top: -20,
                            left: element.width - 10
                        },
                        html: $('<div class="cp-evidence-marker">').text(bo.get('evidenceIndicator'))
                    });
                } catch (e) {
                    // this will break if element was removed... No one knows how to properly do that.
                }

            } else {
                overlays.remove({element: element.id});
                bo.set('evidenceIndicator', '');
            }

        }
    });


};

CPRules.prototype.init = function () {


    function canCreate(shape, target) {
        // only judge about custom elements
        if (!isCPElement(shape)) {
            return;
        }

        if (is(shape, 'cp:CPResource')) {
            return is(target, 'bpmn:Process') || is(target, 'bpmn:Participant') || is(target, 'bpmn:Collaboration') || is(target, 'cp:ResourceBundle');
        }

        if (is(shape, 'cp:Segment')) {
            return is(target, 'cp:StructuredDocument') || is(target, 'cp:Segment');
        }

        if (is(shape, 'cp:ClinicalStatement')) {
            return is(target, 'cp:Segment') || is(target, 'cp:Organizer') || is(target, 'cp:StructuredDocument');
        }

        if (is(shape, 'cp:Organizer')) {
            return is(target, 'cp:Segment');
        }

        if (is(shape, 'cp:StructuredDocument')) {
            return is(target, 'bpmn:Process') || is(target, 'bpmn:Participant') || is(target, 'cp:CaseChart');
        }


        return is(target, 'bpmn:Process') || is(target, 'bpmn:Participant') || is(target, 'bpmn:Collaboration');
    }

    function getConnection(source, target) {
        if (source == target) {
            return false;
        }

        if (is(source, 'cp:CPResource')) {
            if (isAny(target, ['bpmn:Activity', 'bpmn:Gateway'])) {
                return {type: 'cp:ResourceAssociation'};
            } else if (is(target, 'cp:CPResource')) {
                return {type: 'cp:ResourceRelation'}
            } else {
                return false;
            }
        } else if (is(source, 'cp:ClinicalStatement')) {
            if (is(target, 'cp:ClinicalStatement')) {
                return {type: 'cp:StatementRelation'};
            } else {
                return false;
            }
        } else if (is(source, 'cp:CaseChart')) {

            if (isAny(target, ['bpmn:Activity', 'bpmn:Gateway'])) {
                return {type: 'cp:CaseChartAssociation'};
            }
        }
        return false;
    }

    /**
     * Can source and target be connected?
     */
    function canConnect(source, target) {

        if (isAny(source, ['cp:CPResource', 'cp:ClinicalStatement', 'cp:CaseChart'])) {
            return getConnection(source, target);
        } else if (isAny(target, ['cp:CPResource', 'cp:ClinicalStatement', 'cp:CaseChart'])) {
            return getConnection(target, source);
        } else {
            return;
        }
    }

    this.addRule('elements.move', HIGH_PRIORITY, function (context) {
        var target = context.target,
            shapes = context.shapes;

        var type;

        // do not allow mixed movements of custom / BPMN shapes
        // if any shape cannot be moved, the group cannot be moved, too
        var allowed = reduce(shapes, function (result, s) {
            if (type === undefined) {
                type = isCPElement(s);
            }

            if (type !== isCPElement(s) || result === false) {
                return false;
            }

            return canCreate(s, target);
        }, undefined);

        // reject, if we have at least one
        // custom element that cannot be moved
        return allowed;
    });

    this.addRule('shape.create', HIGH_PRIORITY, function (context) {
        var target = context.target,
            shape = context.shape;

        return canCreate(shape, target);
    });


    this.addRule('connection.create', HIGH_PRIORITY, function (context) {
        var source = context.source,
            target = context.target;

        return canConnect(source, target);
    });

    this.addRule('connection.reconnectStart', HIGH_PRIORITY, function (context) {
        var connection = context.connection,
            source = context.hover || context.source,
            target = connection.target;

        return canConnect(source, target, connection);
    });

    this.addRule('connection.reconnectEnd', HIGH_PRIORITY, function (context) {
        var connection = context.connection,
            source = connection.source,
            target = context.hover || context.target;

        return canConnect(source, target, connection);
    });

    // enable resizing
    this.addRule('shape.resize', 1500, function () {
        return true;
    });

};

function isCPElement(element) {
    return element && /^cp\:/.test(element.type);
}
/*
 CPRules.prototype.init = function() {

 function canDecisionLogicConnect(source, target) {
 // only judge about custom elements
 if (isAny(source, ['cp:DecisionLogic', 'cp:EvidenceBasedGateway']) && isAny(target, ['cp:DecisionLogic', 'cp:EvidenceBasedGateway']) && (source.type != target.type)) {
 return {type: 'cp:Connection'};
 } else {
 return;
 }
 }

 function canInsertElement(context) {
 var shape = context.shape,
 target = context.target;

 // only check conditions if CP-Element
 if (!isCP(shape)) {
 return;
 }

 // we check for a custom vendor:allowDrop attribute
 // to be present on the BPMN 2.0 xml of the target
 // node
 //
 // we could practically check for other things too,
 // such as incoming / outgoing connections, element
 // types, ...
 var shapeBo = shape.businessObject,
 targetBo = target.businessObject;

 return isAny(target, ['bpmn:Process', 'bpmn:Participant', 'bpmn:Collaboration']);

 // not returning anything means other rule
 // providers can still do their work
 //
 // this allows us to reuse the existing BPMN rules
 }

 // there exist a number of modeling actions
 // that are identified by a unique ID. We
 // can hook into each one of them and make sure
 // they are only allowed if we say so
 this.addRule('shape.create', function(context) {
 return canInsertElement(context);
 });

 this.addRule('elements.move', function(context) {
 return true;
 });

 this.addRule('connection.create', function(context) {
 var source = context.source,
 target = context.target;

 return canDecisionLogicConnect(source, target);
 });

 this.addRule('connection.reconnectStart', function(context) {
 var connection = context.connection,
 source = context.hover || context.source,
 target = connection.target;

 return canDecisionLogicConnect(source, target, connection);
 });

 this.addRule('connection.reconnectEnd', function(context) {
 var connection = context.connection,
 source = connection.source,
 target = context.hover || context.target;

 return canDecisionLogicConnect(source, target, connection);
 });
 };

 */