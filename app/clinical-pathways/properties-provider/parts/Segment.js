/**
 * Created by mfuesslin on 26.03.2017.
 */
var is = require('bpmn-js/lib/util/ModelUtil').is;
var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

module.exports = function (group, element) {
    if (is(element, 'cp:Segment')) {
        group.entries.push(entryFactory.textField({
            id: 'code',
            label: 'Code',
            modelProperty: 'code'
        }));

        group.entries.push(entryFactory.textField({
            id: 'text',
            label: 'Text',
            modelProperty: 'text'
        }));
    }
};