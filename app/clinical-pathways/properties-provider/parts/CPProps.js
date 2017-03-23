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

var ElFinderHelper = require('../../../elfinder/ElFinderHelper');

//var newDMNXML = require('../../../../resources/newDMN.dmn');


var currentDMNElement;
var dmnWindow;
window.notifyDMNSave = function(diagramName) {
    currentDMNElement.businessObject.set('dmn', diagramName);

    window.setTimeout(function(){
        dmnWindow.close();
    }, 3000);
};


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

                    currentDMNElement = element;
                    createDMNWindow(bo.get('dmn'));
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

function createDMNWindow(file) {
    var url = "/dmn/index.html";
    if (file) {
        url += "?file="+encodeURIComponent(file);
    }
    dmnWindow = window.open(url, "DMN");
}

function createDMN(element, file) {
    var dirty = false;
    var originalXML = '';
    var latestXML = '';
    var diagramName = 'newDMN.dmn';

    var isWebserver = window.location.href.indexOf("localhost:9013") == -1;

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
        table: {
            minColWidth: 200,
            tableName: 'DMN Table'
        }
    });

    // @todo do something about file variable: integrate ElFinder...
    var xml = getNewXML();

    openDiagram(xml);

    if (file) {
        $.get('/diagram/get/'+encodeURI(file), function(json) {
            if (json.result) {
                openDiagram(json.xml);
            }
        });
    }

    function openDiagram(xml) {
        dmnModeler.importXML(xml, function (err) {

            if (err) {
                console.log('error rendering', err);
            } else {
                console.log('dmn rendered');
            }
        });
    }

    downloadLink.on('click', function () {

        if (!file && isWebserver) {
            do {
                diagramName = prompt('Where should I save your diagram? Specify a path, please! New folders will be automatically created. [Current dir: workspace]', '/my_dir/newDiagram.dmn');
            } while (!diagramName || diagramName == "");

            if (diagramName.substr(diagramName.lastIndexOf('.') + 1) !== "dmn") {
                diagramName += ".dmn";
            }
        } else {
            diagramName = file;
        }

        exportArtifacts();

        originalXML = latestXML;
        dirty = false;

        $.post('/diagram/save/'+encodeURI(diagramName), {xml: latestXML}).done(function(json) {
            console.log(json);
        });

        element.businessObject.set('dmn', diagramName);
        dmnContainer.remove();

        // if running on webserver prevent download, else download diagram
        return !isWebserver;
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

    function registerFileDrop(container, callback) {

        function handleFileSelect(e) {
            e.stopPropagation();
            e.preventDefault();

            var files = e.dataTransfer.files;

            var file = files[0];

            var reader = new FileReader();

            reader.onload = function (e) {

                var xml = e.target.result;

                callback(xml);
            };

            reader.readAsText(file);
        }

        function handleDragOver(e) {
            e.stopPropagation();
            e.preventDefault();

            e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }

        container.get(0).addEventListener('dragover', handleDragOver, false);
        container.get(0).addEventListener('drop', handleFileSelect, false);
    }


////// file drag / drop ///////////////////////

// check file api availability
    if (!window.FileList || !window.FileReader) {
        window.alert(
            'Looks like you use an older browser that does not support drag and drop. ' +
            'Try using Chrome, Firefox or the Internet Explorer > 10.');
    } else {
        registerFileDrop(dmnContainer, openDiagram);
    }

}

// helpers
function readEnumAndGenerateSelectOptions(array) {
    var arr = [{name: '', value: ''}];
    forEach(array, function (value) {
        arr.push({name: value, value: value});
    });

    return arr;
}