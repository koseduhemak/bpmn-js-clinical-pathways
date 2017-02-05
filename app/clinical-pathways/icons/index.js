var fs = require("fs");

var iconTherapyTask = fs.readFileSync(__dirname + '/tasks/icon-therapy.png', 'base64');
var iconSupportingTask = fs.readFileSync(__dirname + '/tasks/icon-support.png', 'base64');
var iconDiagnosisTask = fs.readFileSync(__dirname + '/tasks/icon-diagnosis.png', 'base64');

// documents
var iconPatientFile = fs.readFileSync(__dirname + '/documents/icon-patient-file.png', 'base64');

// gateways
var iconSimultanParallelGateway = fs.readFileSync(__dirname + '/gateways/simultan-parallel-gateway.png', 'base64');
var iconEvidenceGateway = fs.readFileSync(__dirname + '/gateways/evidence-gateway.png', 'base64');

module.exports.iconTherapyTask = 'data:image/png;base64,' + iconTherapyTask;
module.exports.iconSupportingTask = 'data:image/png;base64,' + iconSupportingTask;
module.exports.iconDiagnosisTask = 'data:image/png;base64,' + iconDiagnosisTask;
module.exports.iconPatientFile = 'data:image/png;base64,' +iconPatientFile;
module.exports.iconSimultanParallelGateway = 'data:image/png;base64,' +iconSimultanParallelGateway;
module.exports.iconEvidenceGateway = 'data:image/png;base64,' +iconEvidenceGateway;
