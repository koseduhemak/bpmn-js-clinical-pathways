var is = require('bpmn-js/lib/util/ModelUtil').is;
var forEach = require('lodash/collection/forEach');

var propHelpers = require('../properties-provider/PropertyHelpers');

module.exports.getExtensionElements = function (type, businessObject) {
    if (businessObject && businessObject.get('extensionElements') && businessObject.get('extensionElements').values && businessObject.get('extensionElements').values.length > 0) {
        var extensionElements = businessObject.get('extensionElements').values;

        var resultingElements = extensionElements.filter(function (element) {
            return is(element, type);
        });

        if (resultingElements.length > 0) {
            return resultingElements;
        }
    }
    return false;
};

module.exports.getExtensionElement = function (type, businessObject) {
    var extensionElements = this.getExtensionElements(type, businessObject);

    if (extensionElements) {
        return extensionElements[0];
    }
    return false;
};

module.exports.deleteProperty = function (extensionElements, type, propertyName) {
    var keyOfExtensionElement = 0;
    forEach(extensionElements.values, function (extensionElement, key) {
        if (is(extensionElement, type)) {
            keyOfExtensionElement = key;
            delete extensionElements.values[key][propertyName];
        }
    });

    var metamodelProps = propHelpers.getProperties(type);
    var isElementEmpty = true;

    // check if extensionelements is empty / there are no other properties populated for the given element...
    forEach(metamodelProps, function (prop) {
        var suffix = (prop.name || '').replace(/^[^:]*:/g, '');
        if (typeof extensionElements.values[keyOfExtensionElement] !== "undefined" && typeof extensionElements.values[keyOfExtensionElement][suffix] !== "undefined") {
            isElementEmpty = false;
        }
    });

    if (isElementEmpty) {
        return false;
    }

    return extensionElements;
};

module.exports.getKeyByExtensionElement = function (type, businessObject) {
    var key = false;

    forEach(businessObject.extensionElements.values, function (extensionElement, currentKey) {
        if (is(extensionElement, type)) {
            key = currentKey;
        }
    });

    return key;
};

module.exports.createOrReplaceElement = function (moddle, businessObject, type, elementToAdd) {
    var extensionElements = businessObject.extensionElements;
    if (extensionElements && extensionElements.values) {
        var key = this.getKeyByExtensionElement(type, businessObject);
        if (key !== false) {
            businessObject.extensionElements.values[key] = elementToAdd;
        } else {
            extensionElements.values.push(elementToAdd);
        }
    } else {
        extensionElements = moddle.create('bpmn:ExtensionElements', {
            values: [elementToAdd]
        });
    }

    return extensionElements;

};
/*
 module.exports.createExtensionElement = function(moddle, bo, type, attrs) {
 var element = moddle.create(type, attrs);

 if (bo.get('extensionElements') && bo.get('extensionElements').values && bo.get('extensionElements').values.length > 0) {
 bo.get('extensionElements').values.push(element);
 } else {

 bo.extensionElements = moddle.create('bpmn:ExtensionElements', {
 values: [element]
 });
 }


 return bo;
 };
 */