'use strict';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var is = require('bpmn-js/lib/util/ModelUtil').is;

var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;

var $ = require('jquery');

var DmnModeler = require('dmn-js/lib/table/Modeler');

var fs = require('fs');
var forEach = require('lodash/collection/forEach');

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

//var newDMNXML = require('../../../../resources/newDMN.dmn');


module.exports = function (group, element) {

    // Only return an entry, if the currently selected
    // element is a start event.

    if (isAny(element, ['bpmn:Activity', 'bpmn:Gateway', 'bpmn:Process']) && !is(element, 'cp:AbstractContainerElement')) {
        group.entries.push(entryFactory.selectBox({
            id: 'evidenceIndicator',
            description: 'Evidence Level of the task/gateway',
            label: 'Evidence Level',
            modelProperty: 'evidenceIndicator',
            selectOptions: readEnumAndGenerateSelectOptions(require('../../enums/EvidenceLevel.json'))
        }));


    }

    if (is(element, 'cp:EvidenceBasedGateway')) {
        group.entries.push(entryFactory.textField({
            id: 'dmn',
            description: 'The decision logic can be modeled as DMN. The path should point to the corresponding DMN file.',
            label: 'Decision Logic',
            modelProperty: 'dmn'
        }));

        if (element.businessObject.get('dmn').length > 0) {
            group.entries.push(entryFactory.link({
                id: 'modify-dmn',
                description: 'Modify the specified DMN diagram',
                label: 'Modify DMN',
                getClickableElement: function () {
                    // display DMN stuff
                    var bo = getBusinessObject(element);
                    createDMN(element, bo.get('dmn'));
                }
            }));
        }

        group.entries.push(entryFactory.link({
            id: 'create-dmn',
            description: 'Create a DMN to model the decision logic',
            label: 'Create new DMN',
            getClickableElement: function () {
                // display DMN stuff
                createDMN(element);
            }
        }));
    }

    if (is(element, 'cp:CPGReference')) {
        group.entries.push(entryFactory.textField({
            id: 'document',
            description: 'Document',
            label: 'Document',
            modelProperty: 'document'
        }));
    }

    if (is(element, 'cp:ClinicalStatement')) {
        group.entries.push(entryFactory.textField({
            id: 'statementContent',
            label: 'Content',
            modelProperty: 'statementContent'
        }));
    }

    if (is(element, 'cp:Segment')) {
        group.entries.push(entryFactory.textField({
            id: 'code',
            label: 'Code',
            modelProperty: 'code'
        }));

        group.entries.push(entryFactory.textField({
            id: 'text',
            label: 'Text',
            modelProperty: 'text'
        }));
    }

    if (is(element, 'cp:Document')) {
        group.entries.push(entryFactory.selectBox({
            id: 'dmn',
            description: 'Document Type.',
            label: 'Document Type',
            modelProperty: 'type',
            selectOptions: readEnumAndGenerateSelectOptions(require('../../enums/DocumentTypes.json'))
        }));
    }
};

function createDMN(element, file) {
    var dirty = false;
    var originalXML = '';
    var latestXML = '';
    var diagramName = 'newDMN.dmn';


    $("body").append($('<div id="dmn-container">'));

    var dmnContainer = $('#dmn-container');

    var btn_html = '<ul class="buttons">';
    btn_html += '<li>';
    btn_html += '<a id="js-download-table" href title="save DMN table">';
    btn_html += 'Save';
    btn_html += '</a>';
    btn_html += '</li>';
    btn_html += '<li>';
    btn_html += '<a id="js-cancel" href title="Cancel">';
    btn_html += 'Cancel';
    btn_html += '</a>';
    btn_html += '</li>';
    btn_html += '</ul>';

    dmnContainer.append(btn_html);

    var downloadLink = $('#js-download-table');
    var cancelLink = $('#js-cancel');

    var dmnModeler = new DmnModeler({
        container: dmnContainer,
        keyboard: {bindTo: document},
        minColWidth: 200,
        tableName: 'DMN Table'
    });

    // @todo do something about file variable: integrate ElFinder...
    var xml = getNewXML();


    dmnModeler.importXML(xml, function (err) {

        if (err) {
            console.log('error rendering', err);
        } else {
            console.log('rendered');
        }
    });


    downloadLink.on('click', function () {
        originalXML = latestXML;
        dirty = false;

        do {
            diagramName = prompt('Specify name');
        } while (!diagramName || diagramName == "");

        if (diagramName.substr(diagramName.lastIndexOf('.') + 1) !== "dmn") {
            diagramName += ".dmn";
        }

        exportArtifacts();

        element.businessObject.set('dmn', diagramName);
        dmnContainer.remove();
    });

    cancelLink.on('click', function (ev) {
        ev.preventDefault();
        dmnContainer.remove();

    });

    function getNewXML(file) {
        return fs.readFileSync('./resources/newDMN.dmn', 'utf-8');
    }

    function setEncoded(link, name, data) {
        var encodedData = encodeURIComponent(data);

        dirty = data !== originalXML;
        latestXML = data;

        if (data) {
            link.addClass('active').attr({
                'href': 'data:application/xml;charset=UTF-8,' + encodedData,
                'download': name
            });
        } else {
            link.removeClass('active');
        }
    }

    function saveTable(done) {

        dmnModeler.saveXML({format: true}, function (err, xml) {
            done(err, xml);
        });
    }

    var exportArtifacts = function () {
        saveTable(function (err, xml) {
            setEncoded(downloadLink, diagramName, err ? null : xml);
        });
    };

    dmnModeler.on('commandStack.changed', exportArtifacts);

}

// helpers
function readEnumAndGenerateSelectOptions(array) {
    var arr = [{name: '', value: ''}];
    forEach(array, function (value) {
        arr.push({name: value, value: value});
    });

    return arr;
}

