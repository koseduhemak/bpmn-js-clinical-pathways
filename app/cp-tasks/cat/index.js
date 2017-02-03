var fs = require('fs');

var imageTaskSupport = fs.readFileSync(__dirname + '/task-support.png', 'base64');
var imageTaskTherapy = fs.readFileSync(__dirname + '/task-therapy.png', 'base64');
var imageTaskDiagnosis = fs.readFileSync(__dirname + '/task-diagnosis.png', 'base64');

var imageMarkerTherapy = fs.readFileSync(__dirname + '/marker-therapy.png', 'base64');

module.exports.imageTaskSupport = 'data:image/png;base64,' + imageTaskSupport;
module.exports.imageTaskTherapy = 'data:image/png;base64,' + imageTaskTherapy;
module.exports.imageTaskDiagnosis = 'data:image/png;base64,' + imageTaskDiagnosis;

module.exports.imageMarkerTherapy = 'data:image/png;base64,' + imageMarkerTherapy;