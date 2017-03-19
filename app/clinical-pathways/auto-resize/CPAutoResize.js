var BpmnResize = require('bpmn-js/lib/features/auto-resize/BpmnAutoResize');

var inherits = require('inherits');

var is = require('bpmn-js/lib/util/ModelUtil').is;

/**
 * Sub class of the AutoResize module which implements a BPMN
 * specific resize function.
 */
function CPAutoResize(eventBus, elementRegistry, modeling, rules) {
    BpmnResize.call(this, eventBus, elementRegistry, modeling, rules);
}

CPAutoResize.$inject = [ 'eventBus', 'elementRegistry', 'modeling', 'rules' ];

inherits(CPAutoResize, BpmnResize);

module.exports = CPAutoResize;


/**
 * Resize shapes and lanes
 *
 * @param  {djs.model.Shape} target
 * @param  {Object} newBounds
 */
CPAutoResize.prototype.resize = function(target, newBounds) {
    if (is(target, 'bpmn:Participant')) {
        this._modeling.resizeLane(target, newBounds);
    } else if (is(target, 'cp:AbstractContainerElement')) {
        // do nothing, AbstractContainerElements should not be resized automatically because it breaks the layout: Too much space around the elements...
    } else {
        this._modeling.resizeShape(target, newBounds);
    }
};