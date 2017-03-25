
var metamodel = require('../../ext-metamodel/CPMetamodel.json');
var forEach = require('lodash/collection/forEach');

// helpers
module.exports.getEnumValues = function(enumType) {

    var enums = metamodel.enumerations.filter(function(enumElement) {
        console.log(enumElement);
        return enumElement.name == enumType
    });

    if (enums.length > 0) {
       return enums[0].literalValues;
    }
};