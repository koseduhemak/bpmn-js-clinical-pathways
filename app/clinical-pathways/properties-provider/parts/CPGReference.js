/**
 * Created by mfuesslin on 25.03.2017.
 */
var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny,
    is = require('bpmn-js/lib/util/ModelUtil').is;

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var extensionUtil = require('../../util/ExtensionElementUtil');
var forEach = require('lodash/collection/forEach');
var helpers = require('../PropertyHelpers');
var cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

module.exports = function (group, element, moddle) {
    if (is(element, 'bpmn:DataObject')) {
        var setValue = function(businessObject, property) {
            return function (element, values) {
                var extensionElements = [];

                if (typeof values[property] !== 'undefined' && values[property] !== '') {
                    var attrs = {};
                    attrs[property] = values[property];

                    var cpgReferenceElement = extensionUtil.getExtensionElement('cp:CPGReference', businessObject);
                    if (cpgReferenceElement) {
                        cpgReferenceElement[property] = attrs[property];
                    } else {
                        cpgReferenceElement = moddle.create('cp:CPGReference', attrs);
                    }

                    var extensionElements = extensionUtil.createOrReplaceElement(moddle, businessObject, 'cp:CPGReference', cpgReferenceElement);

                } else {
                    extensionElements = extensionUtil.deleteProperty(businessObject.extensionElements, 'cp:CPGReference', property);

                    if (extensionElements === false) {
                        delete businessObject.extensionElements;
                        return cmdHelper.updateBusinessObject(element, businessObject, {});
                    }

                }

                return cmdHelper.updateProperties(element, {'extensionElements': extensionElements});
            };
        };

        var getValue = function (businessObject, property) {
            return function (element) {
                var attrs = {};

                var cpgReference = extensionUtil.getExtensionElement('cp:CPGReference', getBusinessObject(element));
                attrs[property] = cpgReference[property];

                return attrs;
            };
        };

        group.entries.push(entryFactory.textField({
            id: 'pageFrom',
            description: 'Page From descr.',
            label: 'Page From',
            modelProperty: 'pageFrom',
            set: setValue(getBusinessObject(element), 'pageFrom'),
            get: getValue(getBusinessObject(element), 'pageFrom')
        }));

        group.entries.push(entryFactory.textField({
            id: 'pageTo',
            description: 'Page To descr.',
            label: 'Page To',
            modelProperty: 'pageTo',
            set: setValue(getBusinessObject(element), 'pageTo'),
            get: getValue(getBusinessObject(element), 'pageTo')
        }));

        group.entries.push(entryFactory.textField({
            id: 'paragraphFrom',
            description: 'paragraphFrom...',
            label: 'paragraphFrom',
            modelProperty: 'paragraphFrom',
            set: setValue(getBusinessObject(element), 'paragraphFrom'),
            get: getValue(getBusinessObject(element), 'paragraphFrom')
        }));

        group.entries.push(entryFactory.textField({
            id: 'paragraphTo',
            description: 'paragraphTo...',
            label: 'paragraphTo',
            modelProperty: 'paragraphTo',
            set: setValue(getBusinessObject(element), 'paragraphTo'),
            get: getValue(getBusinessObject(element), 'paragraphTo')
        }));

        group.entries.push(entryFactory.textField({
            id: 'url',
            description: 'url...',
            label: 'url',
            modelProperty: 'url',
            set: setValue(getBusinessObject(element), 'url'),
            get: getValue(getBusinessObject(element), 'url')
        }));

        group.entries.push(entryFactory.textField({
            id: 'cpgName',
            description: 'cpgName...',
            label: 'cpgName',
            modelProperty: 'cpgName',
            set: setValue(getBusinessObject(element), 'cpgName'),
            get: getValue(getBusinessObject(element), 'cpgName')
        }));
    }
};