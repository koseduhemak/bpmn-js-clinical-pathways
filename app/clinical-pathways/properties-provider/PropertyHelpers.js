
var metamodel = require('../ext-metamodel/CPMetamodel.json');
var forEach = require('lodash/collection/forEach');

// helpers
module.exports.getEnumValues = function(enumType) {
    var type = getTypeWithoutNS(enumType);

    var enums = metamodel.enumerations.filter(function(enumElement) {
        console.log(enumElement);
        return enumElement.name === type;
    });

    if (enums.length > 0) {
       return enums[0].literalValues;
    }
};

module.exports.getProperties = function(elementType) {
    var props = false;
    if (metamodel.types) {
        var elementSuffix = getTypeWithoutNS(elementType);
        forEach(metamodel.types, function(type) {
            if (type.name === elementSuffix) {
                props = type["properties"];
            }
        });

    }

    return props;
};

function getTypeWithoutNS(elementType) {
    return (elementType || '').replace(/^[^:]*:/g, '');
}