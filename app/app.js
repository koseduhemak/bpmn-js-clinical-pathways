/*'use strict';

 // inlined diagram; load it from somewhere else if you like
 var pizzaDiagram = require('../resources/pizza-collaboration.bpmn');

 // custom elements JSON; load it from somewhere else if you like
 var customElements = require('./custom-elements.json');

 var cpMetamodel = require('./clinical-pathways/ext-metamodel/cp.json');

 var $ = require('jquery');


 // our custom modeler
 var CustomModeler = require('./custom-modeler');
 var Modeler = require('bpmn-js/M')

 var cpPaletteModule = require('./clinical-pathways/palette');
 var cpDrawModule = require('./clinical-pathways/draw');
 var modeler = new CustomModeler({ container: '#canvas', keyboard: { bindTo: document }, additionalModules: [
 cpPaletteModule,
 cpDrawModule
 ],
 moddleExtensions: {
 cp: cpMetamodel
 }
 });*/
'use strict';

var fs = require('fs');

var $ = require('jquery'),
    BpmnModeler = require('bpmn-js/lib/Modeler');

var container = $('#js-drop-zone');

var canvas = $('#js-canvas');

// helper
var forEach = require('lodash/collection/forEach');
var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;

// elfinder
var ElFinderHelper = require('./elfinder/ElFinderHelper');
var elFinderHelper = new ElFinderHelper(modeler, openDiagram);

// property panel
var propertiesPanelModule = require('bpmn-js-properties-panel');
// providing camunda executable properties, too
var propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda'),
 camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda');

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
var cpRules = require('./clinical-pathways/rules').cpRules;
var resizeRules = require('./clinical-pathways/rules');

// CP POPMENU
var cpPopupMenu = require('./clinical-pathways/popup-menu');

// CP ContextPad
var cpContextPad = require('./clinical-pathways/context-pad');

// CP CommandInterceptor
//var cpCommandInterceptor = require('./clinical-pathways/command');

// Core modules
var coreModule = require('bpmn-js/lib/core'),
    bpmnPaletteModule = require('bpmn-js/lib/features/palette'),
    modelingModule = require('bpmn-js/lib/features/modeling'),
    overlays = require('diagram-js/lib/features/overlays'),
    contextPad = require('bpmn-js/lib/features/context-pad'),
    copyPaste = require('bpmn-js/lib/features/copy-paste'),
    distributeElements = require('bpmn-js/lib/features/distribute-elements'),
    editorActions = require('bpmn-js/lib/features/editor-actions'),
    globalConnect = require('bpmn-js/lib/features/global-connect'),
    keyboard = require('bpmn-js/lib/features/keyboard'),
    labelEditing = require('bpmn-js/lib/features/label-editing'),
    ordering = require('bpmn-js/lib/features/ordering'),
    popupMenu = require('bpmn-js/lib/features/popup-menu'),
    replace = require('bpmn-js/lib/features/replace'),
    replacePreview = require('bpmn-js/lib/features/replace-preview'),
    rules = require('bpmn-js/lib/features/rules'),
    search = require('bpmn-js/lib/features/search'),
    snapping = require('bpmn-js/lib/features/snapping'),
    resize = require('diagram-js/lib/features/resize'),
    autoResize = require('bpmn-js/lib/features/auto-resize');


var modeler = new BpmnModeler({
    container: canvas, keyboard: {bindTo: document},
    cli: {bindTo: 'cli'},
    propertiesPanel: {
        parent: '#js-properties-panel'
    },
    modules: [
        // if we have custom rules, place them before core modules!
        cpRules,
        cpPopupMenu,
        //cpCommandInterceptor,

        // core modules
        coreModule,
        bpmnPaletteModule,
        modelingModule,
        overlays,
        contextPad,
        copyPaste,
        distributeElements,
        editorActions,
        globalConnect,
        keyboard,
        labelEditing,
        ordering,
        //popupMenu,
        replace,
        replacePreview,
        rules,
        search,
        snapping,
        resize,
        autoResize

    ],
    additionalModules: [
        propertiesPanelModule,
        //propertiesProviderModule,
        CliModule,
        CPpropertiesProviderModule,
        cpPaletteModule,
        cpDrawModule,
        cpContextPad,
        resizeRules

    ],
    moddleExtensions: {
        cp: cpMetamodel,
        camunda: camundaModdleDescriptor
    }
});


var newDiagramXML = fs.readFileSync(__dirname + '/../resources/newDiagram.bpmn', 'utf-8');

function createNewDiagram() {
    openDiagram(newDiagramXML);
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



            // @todo auslagern in module?
            // applys overlays to specific elements

            var alreadyProcessed = [];
            modeler.get('elementRegistry').filter(function (element) {
                console.log(element);
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

    function setEncoded(link, name, data) {
        var encodedData = encodeURIComponent(data);

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
