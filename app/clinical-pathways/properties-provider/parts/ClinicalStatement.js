/**
 * Created by mfuesslin on 26.03.2017.
 */
var is = require('bpmn-js/lib/util/ModelUtil').is;
module.exports = function (group, element) {
    if (is(element, 'cp:ClinicalStatement')) {
        group.entries.push(entryFactory.textField({
            id: 'statementContent',
            label: 'Content',
            modelProperty: 'statementContent'
        }));
    }
};