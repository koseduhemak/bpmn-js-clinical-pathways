'use strict';

var Modeler = require('bpmn-js/lib/Modeler');

var assign = require('lodash/object/assign'),
    isArray = require('lodash/lang/isArray');

var inherits = require('inherits');

function CPModeler(options) {
    Modeler.call(this, options);

    this._cpElements = [];
}

inherits(CPModeler, Modeler);

/**
 * Add a single cp element to the underlying diagram
 *
 * @param {Object} cpElement
 */
CPModeler.prototype._addCPShape = function(cpElement) {

    this._cpElements.push(cpElement);

    var canvas = this.get('canvas'),
        elementFactory = this.get('elementFactory');

    var cpAttrs = assign({ businessObject: cpElement }, cpElement);

    var cpShape = elementFactory.create('shape', cpAttrs);

    return canvas.addShape(cpShape);

};

CPModeler.prototype._addCPConnection = function(cpElement) {

    this._cpElements.push(cpElement);

    var canvas = this.get('canvas'),
        elementFactory = this.get('elementFactory'),
        elementRegistry = this.get('elementRegistry');

    var cpAttrs = assign({ businessObject: cpElement }, cpElement);

    var connection = elementFactory.create('connection', assign(cpAttrs, {
            source: elementRegistry.get(cpElement.source),
            target: elementRegistry.get(cpElement.target)
        }),
        elementRegistry.get(cpElement.source).parent);

    return canvas.addConnection(connection);

};

/**
 * Add a number of cp elements and connections to the underlying diagram.
 *
 * @param {Array<Object>} cpElements
 */
CPModeler.prototype.addCPElements = function(cpElements) {

    if (!isArray(cpElements)) {
        throw new Error('argument must be an array');
    }

    var shapes = [],
        connections = [];

    cpElements.forEach(function(cpElement) {
        if (isCPConnection(cpElement)) {
            connections.push(cpElement);
        } else {
            shapes.push(cpElement);
        }
    });

    // add shapes before connections so that connections
    // can already rely on the shapes being part of the diagram
    shapes.forEach(this._addCPShape, this);

    connections.forEach(this._addCPConnection, this);
};

/**
 * Get cp elements with their current status.
 *
 * @return {Array<Object>} cp elements on the diagram
 */
CPModeler.prototype.getCPElements = function() {
    return this._cpElements;
};

module.exports = CPModeler;



function isCPConnection(element) {
    return element.type === 'cp:connection';
}
