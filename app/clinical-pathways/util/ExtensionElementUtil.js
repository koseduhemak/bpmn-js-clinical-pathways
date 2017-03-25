var is = require('bpmn-js/lib/util/ModelUtil').is;


module.exports.getExtensionElements = function(needle, businessObject) {
    if (businessObject && businessObject.get('extensionElements') && businessObject.get('extensionElements').values && businessObject.get('extensionElements').values.length > 0) {
        var extensionElements = businessObject.get('extensionElements').values;

        var resultingElements = extensionElements.filter(function (element) {
            return is(element, needle);
        });

        if (resultingElements.length > 0) {
            return resultingElements;
        }
    }
    return false;
};

module.exports.getExtensionElement = function(needle, haystack) {
    var extensionElements = this.getExtensionElements(needle, haystack);

    if (extensionElements) {
        return extensionElements[0];
    }
    return false;
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