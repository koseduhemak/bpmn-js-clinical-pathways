/**
 * Created by mfuesslin on 25.03.2017.
 */
var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny,
    is = require('bpmn-js/lib/util/ModelUtil').is;

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var helpers = require('../PropertyHelpers');
var cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

module.exports = function (group, element, moddle) {

    if (isAny(element, ['bpmn:Activity', 'bpmn:Gateway', 'bpmn:Process']) && !is(element, 'cp:AbstractContainerElement')) {

        var setValue = function (businessObject) {
            return function (element, values) {
                var extensionElements = [];

                if (typeof values.evidenceIndicator !== 'undefined' && values.evidenceIndicator !== '') {
                    //var evidenceIndicator = moddle.create('cp:EvidenceIndicator', { evidenceLevel: values.evidenceIndicator});
                    extensionElements = moddle.create('cp:EvidenceIndicator', {
                        evidenceLevel: values.evidenceIndicator
                    });

                } else {
                    delete businessObject.evidenceIndicator;
                    return cmdHelper.updateBusinessObject(element, businessObject, {});
                }

                return cmdHelper.updateProperties(element, {'evidenceIndicator': extensionElements});
            };
        };

        var getValue = function (businessObject) {
            return function (element) {
                return {evidenceIndicator: businessObject.evidenceIndicator ? businessObject.evidenceIndicator.evidenceLevel : ''};
            };
        };

        group.entries.push(entryFactory.selectBox({
            id: 'evidenceIndicatorProperty',
            description: 'Evidence Level of the task/gateway',
            label: 'Evidence Level',
            modelProperty: 'evidenceIndicator',
            selectOptions: helpers.getEnumValues('cp:EvidenceLevel'),
            set: setValue(getBusinessObject(element)),
            get: getValue(getBusinessObject(element))
        }));
    }
};