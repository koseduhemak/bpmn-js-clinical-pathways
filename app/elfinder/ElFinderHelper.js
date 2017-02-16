/**
 * Created by mfuesslin on 16.02.2017.
 */
var $ = require('jquery');

function ElFinderHelper(modeler, openDiagramFunc) {
    console.log(modeler);

    window.elFinderFileSelected = function(filePath) {


        $.get(filePath, function (xml) {
            console.log(modeler);
            openDiagramFunc(xml);
        });

    };
}

ElFinderHelper.prototype.open = function (url) {
    window.open(
        url ? url : '/elfinder',
        'test-window',
        'resizable=yes,location=no,menubar=no,scrollbars=yes,status=no,toolbar=no,fullscreen=no,dependent=no,width=800,height=600,status'
    );
};

module.exports = ElFinderHelper;