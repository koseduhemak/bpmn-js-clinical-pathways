'use strict';


var inherits = require('inherits');

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
var processProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps'),
    eventProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps'),
    linkProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps'),
    documentationProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps'),
    idProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps'),
    nameProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps');


// Require your custom property entries.
var cpProps = require('./parts/CPProps');

// The general tab contains all bpmn relevant properties.
// The properties are organized in groups.
function createGeneralTabGroups(element, bpmnFactory, elementRegistry) {

    var generalGroup = {
        id: 'general',
        label: 'General',
        entries: []
    };
    idProps(generalGroup, element, elementRegistry);
    nameProps(generalGroup, element);
    processProps(generalGroup, element);

    var detailsGroup = {
        id: 'details',
        label: 'Details',
        entries: []
    };
    linkProps(detailsGroup, element);
    eventProps(detailsGroup, element, bpmnFactory, elementRegistry);

    var documentationGroup = {
        id: 'documentation',
        label: 'Documentation',
        entries: []
    };

    documentationProps(documentationGroup, element, bpmnFactory);

    return [
        generalGroup,
        detailsGroup,
        documentationGroup
    ];
}


function CPPropertiesProvider(eventBus, bpmnFactory, elementRegistry) {

    PropertiesActivator.call(this, eventBus);


    // Create the custom CP tab
    this.createCPTabGroups = function(element, elementRegistry) {

        // Create a group called "Clinical Pathways".
        var CPGroup = {
            id: 'clinical-pathways',
            label: 'Clinical Pathways',
            entries: []
        };

        // Add the cp props to the clinical-pathways group.
        cpProps(CPGroup, element);

        return [
            CPGroup
        ];
    };

    this.getTabs = function (element) {

        var generalTab = {
            id: 'general',
            label: 'General',
            groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry)
        };

        // The CP tab
        var cpTab = {
            id: 'cp',
            label: 'Clinical Pathways',
            groups: this.createCPTabGroups(element, elementRegistry)
        };

        // Show general + CP tab
        return [
            generalTab,
            cpTab
        ];
    };
}

inherits(CPPropertiesProvider, PropertiesActivator);

module.exports = CPPropertiesProvider;
