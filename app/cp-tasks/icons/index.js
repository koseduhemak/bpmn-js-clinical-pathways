var fs = require("fs");

var iconTherapyTask = fs.readFileSync(__dirname + '/icon-therapy.png', 'base64');
var iconSupportingTask = fs.readFileSync(__dirname + '/icon-support.png', 'base64');
var iconDiagnosisTask = fs.readFileSync(__dirname + '/icon-diagnosis.png', 'base64');

module.exports.iconTherapyTask = 'data:image/png;base64,' + iconTherapyTask;
module.exports.iconSupportingTask = 'data:image/png;base64,' + iconSupportingTask;
module.exports.iconDiagnosisTask = 'data:image/png;base64,' + iconDiagnosisTask;