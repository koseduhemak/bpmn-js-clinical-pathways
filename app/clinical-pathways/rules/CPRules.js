'use strict';

var reduce = require('lodash/collection/reduce'),
    inherits = require('inherits'),
    forEach = require('lodash/collection/forEach');

var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');
var is = require('bpmn-js/lib/util/ModelUtil').is;
var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;

var $ = require('jquery');

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
function CPRules(eventBus, overlays, elementFactory, modeling) {
    RuleProvider.call(this, eventBus);
    this._eventBus = eventBus;
    this._overlays = overlays;
    this._elementFactory = elementFactory;
    this._modeling = modeling;

    this.registerEventListener();
}

inherits(CPRules, RuleProvider);

CPRules.$inject = ['eventBus', 'overlays', 'elementFactory', 'modeling'];

module.exports = CPRules;

CPRules.prototype.registerEventListener = function () {

    var eventBus = this._eventBus;
    var overlays = this._overlays;

    var self = this;

    eventBus.on('element.changed', HIGH_PRIORITY, function (event) {

        var element = event.element,
            bo = element.businessObject;

        // process only Task and Gateway, no overlay for processes!
        if (isAny(bo, ['bpmn:Task', 'bpmn:Gateway']) && element.type != "label") {

            var evidenceIndicator = bo.evidenceIndicator;

            if (evidenceIndicator && evidenceIndicator.evidenceLevel && evidenceIndicator.evidenceLevel.toUpperCase()) {

                try {
                    var overlay_id = overlays.add(element.id, {
                        position: {
                            top: -20,
                            left: element.width - 10
                        },
                        html: $('<div class="cp-evidence-marker">').text(evidenceIndicator.evidenceLevel)
                    });
                } catch (e) {
                    // this will break if element was removed... No one knows how to properly do that.
                }

            } else {
                overlays.remove({element: element.id});
            }

        }
    });


};
/**
 * This method initializes some modeling rules. For this to work, it hooks into events and executes the needed logic.
 */
CPRules.prototype.init = function () {
    /**
     * This function determines if a shape can be created within target.
     * @param shape
     * @param target
     * @returns {*}
     */
    function canCreate(shape, target) {
        // only judge about custom elements
        if (!isCPElement(shape)) {
            return;
        }

        if (is(shape, 'cp:CPResource')) {
            return is(target, 'bpmn:Process') || is(target, 'bpmn:Participant') || is(target, 'bpmn:SubProcess') || is(target, 'cp:ResourceBundle');
        }

        if (is(shape, 'cp:Segment')) {
            return is(target, 'cp:StructuredDocument') || is(target, 'cp:Segment');
        }

        if (is(shape, 'cp:ClinicalStatement')) {
            return is(target, 'cp:Segment') || is(target, 'cp:Organizer');
        }

        if (is(shape, 'cp:Organizer')) {
            return is(target, 'cp:Segment');
        }

        if (is(shape, 'cp:ClinicalDocument')) {
            return is(target, 'bpmn:Process') || is(target, 'bpmn:Participant') || is(target, 'bpmn:SubProcess') || is(target, 'cp:CaseChart');
        }


        return is(target, 'bpmn:Process') || is(target, 'bpmn:Participant') || is(target, 'bpmn:SubProcess') && !is(target, 'cp:AbstractContainerElement');
    }

    /**
     * This function returns the correct connection based on source's and target's type.
     * @param source
     * @param target
     * @returns {*}
     */
    function getConnection(source, target) {
        if (source == target) {
            return false;
        }

        if (is(source, 'cp:CPResource')) {
            if (isAny(target, ['bpmn:Activity', 'bpmn:Gateway']) && !is(target, 'cp:AbstractContainerElement')) {
                return {type: 'cp:ResourceAssociation'};
            } else if (is(target, 'cp:CPResource')) {
                return {type: 'cp:ResourceRelation'}
            } else {
                return false;
            }
        } else if (is(source, 'cp:ResourceBundle')) {
            if (isAny(target, ['bpmn:Activity', 'bpmn:Gateway']) && !is(target, 'cp:AbstractContainerElement')) {
                return {type: 'cp:ResourceAssociation'};
            }
            return false;
        } else if (is(source, 'cp:ClinicalStatement')) {
            if (is(target, 'cp:ClinicalStatement')) {
                return {type: 'cp:StatementRelation'};
            } else {
                return false;
            }
        } else if (is(source, 'cp:CaseChart')) {
            if (isAny(target, ['bpmn:Activity', 'bpmn:Gateway']) && !is(target, 'cp:AbstractContainerElement')) {
                return {type: 'cp:CaseChartAssociation'};
            }
        } else if (is(source, 'cp:ClinicalDocument')) {
            if (isAny(target, ['bpmn:Activity', 'bpmn:Gateway']) && !is(target, 'cp:AbstractContainerElement')) {
                return {type: 'cp:DocumentAssociation'};
            }
        } else if (is(source, 'cp:QualityIndicator')) {
            if (isAny(target, ['bpmn:Activity', 'bpmn:Gateway', 'bpmn:Process']) && !is(target, 'cp:AbstractContainerElement')) {
                return {type: 'cp:QualityIndicatorAssociation'};
            }
        } else if (is(source, 'cp:Objective')) {
            if (isAny(target, ['bpmn:Activity', 'bpmn:Gateway', 'bpmn:Process']) && !is(target, 'cp:AbstractContainerElement')) {
                return {type: 'cp:ObjectiveAssociation'};
            }
        }
        return false;
    }

    /**
     * Can source and target be connected?
     */
    function canConnect(source, target) {
        var cpElementsWithCustomConnections = ['cp:CPResource', 'cp:ClinicalStatement', 'cp:CaseChart', 'cp:ResourceBundle', 'cp:ClinicalDocument', 'cp:Indicator'];

        // first two statements check only bi-directional connections!
        // last n statements check uni-directional connections!
        if (isAny(source, cpElementsWithCustomConnections)) {
            return getConnection(source, target);
        } else if (isAny(target, cpElementsWithCustomConnections)) {
            return getConnection(target, source);
        } else if (isAny(source, ['cp:Document'])) {
            if (isAny(target, ['bpmn:Activity', 'bpmn:ThrowEvent'])) {
                return {type: 'bpmn:DataInputAssociation'};
            }
            return false;
        } else if (isAny(target, ['cp:Document'])) {
            if (isAny(source, ['bpmn:Activity', 'bpmn:CatchEvent'])) {
                return {type: 'bpmn:DataOutputAssociation'};
            }
            return false;
        }

        return;
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

        // ContainerElements should be expanded
        if (is(shape, 'bpmn:FlowElementsContainer')) {
            shape.isExpanded = true;
            shape.businessObject.di.isExpanded = true;
        }

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
    this.addRule('shape.resize', 1500, function (context) {

        var element = context.shape,
            bo = element.businessObject;

        if (isAny(bo, ['bpmn:Task', 'bpmn:DataObject', 'bpmn:DataObjectReference', 'cp:AbstractContainerElement', 'cp:CPResource'])) {
            return true;
        }
    });

};

function isCPElement(element) {
    return element && /^cp\:/.test(element.type);
}