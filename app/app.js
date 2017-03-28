'use strict';

var fs = require('fs');

var $ = require('jquery'),
    BpmnModeler = require('bpmn-js/lib/Modeler');

var container = $('#js-drop-zone');

var canvas = $('#js-canvas');

var swal = require('sweetalert');

// helper
var forEach = require('lodash/collection/forEach');
var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;

// elfinder
var ElFinderHelper = require('./elfinder/ElFinderHelper');
var elFinderHelper = new ElFinderHelper(modeler, openDiagram);

// property panel
var propertiesPanelModule = require('bpmn-js-properties-panel');

// CLI Module
// @TODO implement window.cli.undo() and window.cli.redo() -> Buttons
var CliModule = require('bpmn-js-cli');

// CP properties
var CPpropertiesProviderModule = require('./clinical-pathways/properties-provider');

// CP DEPENDENCIES
var cpPaletteModule = require('./clinical-pathways/palette');
var cpDrawModule = require('./clinical-pathways/draw');

// CP Metamodel
var cpMetamodel = require('./clinical-pathways/ext-metamodel/CPMetamodel.json');

// CP Rules
var cpRules = require('./clinical-pathways/rules');

// CP POPMENU
var cpPopupMenu = require('./clinical-pathways/popup-menu');

// CP ContextPad
var cpContextPad = require('./clinical-pathways/context-pad');

// CP Auto-Resize
var cpAutoResize = require('./clinical-pathways/auto-resize');

// CP Label
var cpBehavior = require('./clinical-pathways/modeling/behavior');

// CP Importer
var cpImporter = require('./clinical-pathways/import');

var modeler = new BpmnModeler({
    container: canvas, keyboard: {bindTo: document},
    cli: {bindTo: 'cli'},
    propertiesPanel: {
        parent: '#js-properties-panel'
    },

    additionalModules: [
        cpImporter,
        cpBehavior,
        cpRules,
        cpContextPad,
        propertiesPanelModule,
        CliModule,
        CPpropertiesProviderModule,
        cpPaletteModule,
        cpDrawModule,

        cpPopupMenu,
        cpAutoResize

    ],
    moddleExtensions: {
        cp: cpMetamodel
    }
});

var latestXML, diagramName;
var newDiagramXML = fs.readFileSync(__dirname + '/../resources/newDiagram.bpmn', 'utf-8');

function createNewDiagram() {
    openDiagram(newDiagramXML);
}

function isCP(element) {
    return element && /cp\:/.test(element.type);
}

function openDiagram(xml) {

    modeler.importXML(xml, function (err) {

        if (err) {
            container
                .removeClass('with-diagram')
                .addClass('with-error');

            container.find('.error pre').text(err.message);

            console.error(err);
        } else {
            container
                .removeClass('with-error')
                .addClass('with-diagram');

            var eventBus = modeler.get('eventBus');

            var cpElements = modeler.get('elementRegistry').filter(function (element) {
                if (isCP(element)) {
                    return true;
                }
            });

            // @todo auslagern in module?
            // applys overlays to specific elements

            var alreadyProcessed = [];
            modeler.get('elementRegistry').filter(function (element) {

                eventBus.fire({type: 'element.changed'}, {element: element});
                if (alreadyProcessed.indexOf(element.businessObject.get('id')) == -1) {
                    alreadyProcessed.push(element.businessObject.get('id'));


                }
                return false;

            });


        }


    });
}

function saveSVG(done) {
    modeler.saveSVG(done);
}

function saveDiagram(done) {

    modeler.saveXML({format: true}, function (err, xml) {
        done(err, xml);
    });
}

function registerFileDrop(container, callback) {

    function handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();

        var files = e.dataTransfer.files;

        var file = files[0];

        var reader = new FileReader();

        reader.onload = function (e) {

            var xml = e.target.result;

            diagramName = file.name;

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
    registerFileDrop(container, openDiagram);
}

// bootstrap diagram functions

$(document).ready(function () {

    $('#js-create-diagram').click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        createNewDiagram();
    });

    // open files via elfinder
    $('#js-open-diagram').click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        elFinderHelper.open();
    });

    var downloadLink = $('#js-download-diagram');
    var downloadSvgLink = $('#js-download-svg');

    $('.buttons a').click(function (e) {
        if (!$(this).is('.active')) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    downloadLink.click(function (e) {
        if (isWebserver()) {
            if (typeof diagramName === "undefined" || diagramName === "") {
                swal({
                        title: "Where should I save your diagram?",
                        text: "Specify a path, please! New folders will be automatically created [Current dir: workspace].",
                        type: "input",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: "slide-from-top",
                        inputPlaceholder: "newBPMN.bpmn"
                    },
                    function (inputValue) {
                        if (inputValue === false) return false;

                        if (inputValue === "") {
                            return true;
                        }

                        diagramName = inputValue;

                        if (diagramName.substr(diagramName.lastIndexOf('.') + 1) !== "bpmn") {
                            diagramName += ".bpmn";
                        }

                        saveDiagramToDisk(diagramName, latestXML);
                    });

                return false;
            } else {
                saveDiagramToDisk(diagramName, latestXML);
                return false;
            }
        }

        return true;
    });

    function setEncoded(link, name, data) {
        var encodedData = encodeURIComponent(data);

        latestXML = data;

        if (data) {
            link.addClass('active').attr({
                'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
                'download': name
            });
        } else {
            link.removeClass('active');
        }
    }

    var _ = require('lodash');

    var exportArtifacts = _.debounce(function () {

        saveSVG(function (err, svg) {
            setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
        });

        saveDiagram(function (err, xml) {
            setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        });
    }, 500);

    modeler.on('commandStack.changed', exportArtifacts);
});

function saveDiagramToDisk(fileName, latestXML) {
    $.post('/diagram/save/' + encodeURI(fileName), {xml: latestXML}).done(function (json) {
        if (json.result) {
            swal({
                title: "BPMN model saved!",
                text: "Your BPMN model was saved.",
                type: "success",
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            swal({
                title: "BPMN not saved!",
                text: "Your BPMN model was NOT saved. Something is wrong. Please check your POST data via browsers console window!",
                type: "error",
                showConfirmButton: false
            });
        }
    }).fail(function () {
        swal({
            title: "BPMN not saved!",
            text: "Your BPMN model was NOT saved. Something is wrong. Please check your POST data via browsers console window!",
            type: "error",
            showConfirmButton: false
        });
    });
}

function isWebserver() {
    return window.location.href.indexOf("localhost:9013") === -1;
}