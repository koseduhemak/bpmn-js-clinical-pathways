/**
 * Created by mfuesslin on 26.03.2017.
 */
var is = require('bpmn-js/lib/util/ModelUtil').is;
var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');
var helpers = require('../PropertyHelpers');

module.exports = function (group, element) {
    if (is(element, 'cp:Document')) {
        group.entries.push(entryFactory.selectBox({
            id: 'document-type',
            description: 'Document Type.',
            label: 'Document Type',
            modelProperty: 'type',
            selectOptions: helpers.getEnumValues('cp:DocumentType')
        }));
    }
};