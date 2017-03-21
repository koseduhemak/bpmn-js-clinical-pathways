var LabelUtil = require('bpmn-js/lib/util/LabelUtil');
var inherits = require('inherits');
var getExternalLabelMid = LabelUtil.getExternalLabelMid;

var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;

var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');

function CPLabelSupport(eventBus, modeling, bpmnFactory) {

    CommandInterceptor.call(this, eventBus);

    this.hasExternalLabel = hasExternalLabel = function(bo) {
        return isAny(bo, ['cp:Objective', 'cp:QualityIndicator', 'cp:CPGReference']);
    };

    this.labelCreate = function(e) {
        var context = e.context;

        var element = context.shape || context.connection,
            businessObject = element.businessObject;

        var position;

        if (hasExternalLabel(businessObject)) {
            position = getExternalLabelMid(element);
            modeling.createLabel(element, position, {
                id: businessObject.id + '_label2',
                hidden: !businessObject.name,
                businessObject: businessObject
            });
        }
    };

    ///// create external labels on shape creation

    this.postExecute(['shape.create', 'connection.create'], 5000, this.labelCreate);


}

inherits(CPLabelSupport, CommandInterceptor);

CPLabelSupport.$inject = [ 'eventBus', 'modeling', 'bpmnFactory' ];

module.exports = CPLabelSupport;