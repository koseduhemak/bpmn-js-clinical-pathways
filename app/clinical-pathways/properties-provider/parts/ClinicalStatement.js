/**
 * Created by mfuesslin on 26.03.2017.
 */
var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var is = require('bpmn-js/lib/util/ModelUtil').is;
module.exports = function (group, element) {
    if (is(element, 'cp:ClinicalStatement')) {
        group.entries.push(entryFactory.textBox({
            id: 'statementContent',
            label: 'Content',
            modelProperty: 'statementContent'
        }));
    }
};