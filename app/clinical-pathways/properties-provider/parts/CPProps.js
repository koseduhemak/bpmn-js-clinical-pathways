'use strict';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var is = require('bpmn-js/lib/util/ModelUtil').is;

module.exports = function (group, element) {

    // Only return an entry, if the currently selected
    // element is a start event.

    if (is(element, 'bpmn:Task')) {
        group.entries.push(entryFactory.textField({
            id: 'evidence-level',
            description: 'Evidence Level of the task/gateway',
            label: 'Evidence Level',
            modelProperty: 'evidence-level'
        }));
    }
};