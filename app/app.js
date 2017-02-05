'use strict';

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
});

modeler.importXML(pizzaDiagram, function(err) {

  if (err) {
    console.error('something went wrong:', err);
  }

  modeler.get('canvas').zoom('fit-viewport');

  modeler.addCustomElements(customElements);
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

function saveDiagramm(done) {
    modeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml);
    });
}


$(document).ready(function() {
    $('body').append('<a href="" id="btn-download">Download</a>');

    $('#btn-download').click(function(ev) {
        saveDiagramm(function(err, xml) {
            setEncoded($('#btn-download'), 'diagram.bpmn', err ? null : xml);
        });

    });
});


// expose bpmnjs to window for debugging purposes
window.bpmnjs = modeler;
