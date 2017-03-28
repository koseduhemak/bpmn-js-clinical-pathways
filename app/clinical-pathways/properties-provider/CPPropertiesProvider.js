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
var evidenceIndiactorProps = require('./parts/EvidenceIndicator'),
    cpgReferenceProps = require('./parts/CPGReference'),
    clinicalStatementProps = require('./parts/ClinicalStatement'),
    dmnProps = require('./parts/DMNProps'),
    documentProps = require('./parts/Document'),
    segmentProps = require('./parts/Segment'),
    resourceRelationProps = require('./parts/ResourceRelation');

//var cpDmnHelper = require('../helper');

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


function CPPropertiesProvider(eventBus, bpmnFactory, elementRegistry, modeling, moddle) {
    PropertiesActivator.call(this, eventBus);


    // Create the custom CP tab
    this.createCPTabGroups = function (element, elementRegistry) {

        var clinicalStatementGroup = {
            id: 'clinical-statement-group',
            label: 'Clinical Statement',
            entries: []
        };

        var dmnGroup = {
            id: 'dmn-group',
            label: 'DMN',
            entries: []
        };

        var segmentGroup = {
            id: 'segment-group',
            label: 'Segment Attributes',
            entries: []
        };

        var documentGroup = {
            id: 'document-group',
            label: 'Document Attributes',
            entries: []
        };

        var resourceRelationGroup = {
            id: 'resource-relation-group',
            label: 'Resource Relation',
            entries: []
        };

        var evidenceIndicatorGroup = {
            id: 'evidence-indicator-group',
            label: 'Evidence Indicator',
            entries: []
        };


        var cpgReferenceGroup = {
            id: 'cpgReference-group',
            label: 'CPG Reference',
            entries: []
        };

        // Add the cp props to their respective group.
        evidenceIndiactorProps(evidenceIndicatorGroup, element, moddle);
        cpgReferenceProps(cpgReferenceGroup, element, moddle);
        clinicalStatementProps(clinicalStatementGroup, element, moddle);
        dmnProps(dmnGroup, element, moddle, modeling);
        segmentProps(segmentGroup, element, moddle);
        documentProps(documentGroup, element, moddle);
        resourceRelationProps(resourceRelationGroup, element, moddle);

        return [
            clinicalStatementGroup,
            dmnGroup,
            segmentGroup,
            documentGroup,
            resourceRelationGroup,
            evidenceIndicatorGroup,
            cpgReferenceGroup
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
