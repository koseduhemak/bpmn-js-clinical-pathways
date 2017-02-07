var $ = require('jquery');

var evidenceLevel = require('../enums/EvidenceLevel.json');
var is = require('bpmn-js/lib/util/ModelUtil').is;

var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;

function ElementChanged(overlays) {
    this.overlays = overlays;
}


ElementChanged.prototype.processEvent = function(element) {
    // hooks to be able to react to element changes
    if (isAny(element.businessObject, ['cp:Task', 'cp:EvidenceGateway'])) {
        if (evidenceLevel.includes(element.businessObject.get('evidence-level').toUpperCase())) {
            element.businessObject.set('evidence-level', element.businessObject.get('evidence-level').toUpperCase());

            console.log(this.overlays.get({element: element}));
            if (this.overlays.get(element).length < 1) {
                this.overlays.add(element, {
                    position: {
                        top: -20,
                        left: element.width - 10,
                    },
                    html: $('<div class="cp-evidence-marker">').text(element.businessObject.get('evidence-level'))
                });
            }
            //modeling.appendShape(element, {type: 'cp:EvidenceMarker'}, {x: 150, y: 150});
            //window.cli.appendShape(element, 'cp:EvidenceMarker', '150,0');
        } else {
            this.overlays.remove({element: element});
            element.businessObject.set('evidence-level', '');
        }
    }
};

module.exports = ElementChanged;