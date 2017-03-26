/**
 * Created by mfuesslin on 26.03.2017.
 */

var is = require('bpmn-js/lib/util/ModelUtil').is;
var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;
var extensionUtil = require('../../util/ExtensionElementUtil');
var forEach = require('lodash/collection/forEach');

var currentDMNElement;
var dmnWindow;

// save dmn inline
window.notifyDMNSave = function (xml) {
    var businessObject = getBusinessObject(currentDMNElement);

    var dmnElement = extensionUtil.getExtensionElement('cp:Dmn', businessObject);
    if (dmnElement) {
        dmnElement.diagram = xml;
    } else {
        dmnElement = moddle.create('cp:Dmn', {
            diagram: xml
        });
    }

    var extensionElements = extensionUtil.createOrReplaceElement(moddle, businessObject, 'cp:Dmn', dmnElement);

    modeling.updateProperties(currentDMNElement, {extensionElements: extensionElements});


    window.setTimeout(function () {
        dmnWindow.close();
    }, 3000);
};

module.exports = function (group, element, moddle, modeling) {
    // this is needed for the window.notifyDMNSave function which will be called from a popup window...
    window.modeling = modeling;
    window.moddle = moddle;

    if (is(element, 'cp:EvidenceBasedGateway')) {
      /* group.entries.push(entryFactory.textField({
            id: 'dmn',
            description: 'The decision logic can be modeled as DMN. The path should point to the corresponding DMN file.',
            label: 'Decision Logic',
            modelProperty: 'dmn'
        }));*/

        if (element.businessObject.get('extensionElements') && element.businessObject.get('extensionElements').values && element.businessObject.get('extensionElements').values.length > 0) {
            group.entries.push(entryFactory.link({
                id: 'modify-dmn',
                description: 'Modify the specified DMN diagram',
                label: 'View/Modify DMN',
                getClickableElement: function () {
                    // display DMN stuff
                    var bo = getBusinessObject(element);

                    currentDMNElement = element;
                    var dmn = extensionUtil.getExtensionElement('cp:Dmn', bo);

                    if (dmn) {
                        createDMNWindow(dmn.diagram);
                    } else {
                        alert("Error occurred: Could not extract your DMN!");
                    }
                }
            }));
        }

        group.entries.push(entryFactory.link({
            id: 'create-dmn',
            description: 'Create a DMN to model the decision logic',
            label: 'Create new DMN',
            getClickableElement: function () {
                // display DMN stuff
                //createDMN(element);

                currentDMNElement = element;
                createDMNWindow();


            }
        }));
    }
};


function createDMNWindow(file) {
    var url = "/dmn/index.html";
    if (file) {
        url += "?file=" + encodeURIComponent(file);
    }
    dmnWindow = window.open(url, "DMN");
}