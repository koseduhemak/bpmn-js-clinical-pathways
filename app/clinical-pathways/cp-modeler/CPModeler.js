/**
 * Created by mfuesslin on 16.02.2017.
 */
var fs = require('fs');

var inherits = require('inherits');

var $ = require('jquery'),
    BpmnModeler = require('bpmn-js/lib/Modeler');

var container = $('#js-drop-zone');


var ElementChanged = require('../event-handler/ElementChanged');

// helper
var forEach = require('lodash/collection/forEach');
var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;

function CPModeler(options) {
    BpmnModeler.call(this, options);


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
        registerFileDrop(container, this.openDiagram);
    }


    this.openDiagram = function(xml) {

        this.importXML(xml, function (err) {

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


                // @todo auslagern in module?
                // applys overlays to specific elements
                var elementChanged = new ElementChanged(this.get('overlays'));
                var alreadyProcessed = [];
                this.get('elementRegistry').filter(function (element) {

                    if (alreadyProcessed.indexOf(element.businessObject.get('id')) == -1) {
                        console.log(alreadyProcessed);
                        alreadyProcessed.push(element.businessObject.get('id'));
                        elementChanged.processEvent(element);
                        return isAny(element, ['cp:Task', 'cp:EvidenceGateway']);
                    }
                    return false;

                });


            }


        });
    }
}

inherits(CPModeler, BpmnModeler);
module.exports = CPModeler;


var newDiagramXML = fs.readFileSync('./resources/newDiagram.bpmn', 'utf-8');

CPModeler.prototype.createNewDiagram = function () {
    this.openDiagram(newDiagramXML);
};

CPModeler.prototype.openDiagram = function (xml) {
    this.openDiagram(xml);
};


/*
 // register change events to get overlays working
 modeler.on('element.changed', function (event) {
 var element = event.element;
 var elementChanged = new ElementChanged(modeler.get('overlays'));
 elementChanged.processEvent(element);
 });




 // bootstrap diagram functions


 */