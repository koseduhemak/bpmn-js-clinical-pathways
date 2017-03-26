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
/*
var modelingModules = [

    // core
    require('bpmn-js/lib/core'),
    require('diagram-js/lib/i18n/translate'),
    require('diagram-js/lib/features/selection'),
    require('diagram-js/lib/features/overlays'),

    // modeling components
    require('diagram-js/lib/features/auto-scroll'),
    require('diagram-js/lib/features/bendpoints'),
    require('diagram-js/lib/features/move'),
    require('diagram-js/lib/features/resize'),
    require('bpmn-js/lib/features/auto-resize'),
    require('bpmn-js/lib/features/editor-actions'),
    require('bpmn-js/lib/features/context-pad'),
    require('bpmn-js/lib/features/keyboard'),
    require('bpmn-js/lib/features/label-editing'),
    require('bpmn-js/lib/features/modeling'),
    require('bpmn-js/lib/features/palette'),
    require('bpmn-js/lib/features/replace-preview'),
    require('bpmn-js/lib/features/snapping')

];

var interactionModules = [
    // non-modeling components
    require('diagram-js/lib/navigation/movecanvas'),
    require('diagram-js/lib/navigation/touch'),
    require('diagram-js/lib/navigation/zoomscroll')
];

var modules = [].concat(
    modelingModules,
    interactionModules
);*/

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
       // propertiesProviderModule,
        CliModule,
        CPpropertiesProviderModule,
        cpPaletteModule,
        cpDrawModule,

        cpPopupMenu,
        //elementFactory,
        cpAutoResize

    ],
    moddleExtensions: {
        cp: cpMetamodel
    }
});


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

            console.log(cpElements);


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
