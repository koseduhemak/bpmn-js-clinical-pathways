/**
 * Created by mfuesslin on 26.03.2017.
 */
var is = require('bpmn-js/lib/util/ModelUtil').is;
var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');
var helpers = require('../PropertyHelpers');

module.exports = function (group, element) {
    if (is(element, 'cp:ResourceRelation')) {
        group.entries.push(entryFactory.selectBox({
            id: 'resource-relation-type',
            description: 'Relations between CP Resources can have different types.',
            label: 'Resource Relation Type',
            modelProperty: 'resourceRelationType',
            selectOptions: helpers.getEnumValues('cp:ResourceRelationType')
        }));
    }
};