'use strict';

var $ = require('jquery'),
    DmnModeler = require('dmn-js/lib/Modeler');

var fs = require('fs');

var dirty = false;
var originalXML = '';
var latestXML = '';

var container = $('#js-drop-zone');

var downloadLink = $('#js-download-table');

var canvas = $('#js-table');

var renderer = new DmnModeler({
    container: canvas,
    keyboard: {bindTo: document},
    table: {
        minColWidth: 200,
        tableName: 'DMN Table'
    }
});

var newTableXML = fs.readFileSync('./resources/newTable.dmn', 'utf-8');
var example = fs.readFileSync('./resources/di.dmn', 'utf-8');

var diagramName = "newDiagram.dmn";

function createNewTable() {
    openTable(newTableXML);
}
function createDemoTable() {
    openTable(exampleXML);
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

function openTable(xml) {

    renderer.importXML(xml, function (err) {

        if (err) {
            container
                .removeClass('with-table')
                .addClass('with-error');

            container.find('.error pre').text(err.message);

            console.error(err);
        } else {
            container
                .removeClass('with-error')
                .addClass('with-table');

            saveTable(function (err, xml) {
                originalXML = xml;
                setEncoded(downloadLink, 'table.dmn', err ? null : xml);
            });
        }
    });
}

function saveTable(done) {

    renderer.saveXML({format: true}, function (err, xml) {
        done(err, xml);
    });
}

function registerFileDrop(container, callback) {

    function handleFileSelect(e) {

        e.stopPropagation();
        e.preventDefault();

        if (dirty && !window.confirm('You made changes to the previous table, ' +
                'do you really want to load the new table and overwrite the changes?')) {
            return;
        }

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
    registerFileDrop(container, openTable);
}

// bootstrap table functions

$(document).ready(function () {
    // init document
    var file = getParameterByName("file");

    if (file) {
        $.get('/diagram/get/'+encodeURI(file), function(json) {
            if (json.result) {
                openTable(json.xml);
            } else {
                createNewTable();
                console.error("Could not load your DMN!");
            }
        }).fail(function() {
            console.error("Could not load your DMN!");
        });
    } else {
        createNewTable();
    }

    $('.buttons a').click(function (e) {
        if (!$(this).is('.active')) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    function checkDirty() {
        if (dirty) {
            return 'The changes you performed on the table will be lost upon navigation.';
        }
    }

    var href = window.location.href;
    if (href.indexOf('?new') !== -1) {
        createNewTable();
    } else if (href.indexOf('?example') !== -1) {
        createDemoTable();
    }

    window.onbeforeunload = checkDirty;

    var exportArtifacts = function () {
        saveTable(function (err, xml) {
            setEncoded(downloadLink, diagramName, err ? null : xml);
        });
    };

    downloadLink.click(function () {
        exportArtifacts();

        originalXML = latestXML;
        dirty = false;

        if (isWebserver()) {
            if (!file) {
                do {
                    diagramName = prompt('Where should I save your diagram? Specify a path, please! New folders will be automatically created. [Current dir: workspace]', '/my_dir/newDiagram.dmn');
                } while (!diagramName || diagramName == "");

                if (diagramName.substr(diagramName.lastIndexOf('.') + 1) !== "dmn") {
                    diagramName += ".dmn";
                }
            } else {
                diagramName = file;
            }

            $.post('/diagram/save/' + encodeURI(diagramName), {xml: latestXML}).done(function (json) {
                opener.notifyDMNSave(diagramName);
            });
            return false;
        } else {
            opener.notifyDMNSave(diagramName);
        }
    });

    renderer.on('commandStack.changed', exportArtifacts);
    renderer.table.on('commandStack.changed', exportArtifacts);
});

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function isWebserver() {
    return window.location.href.indexOf("localhost:9013") == -1;
}
