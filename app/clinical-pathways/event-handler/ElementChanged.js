var $ = require('jquery');

var evidenceLevel = require('../enums/EvidenceLevel.json');
var is = require('bpmn-js/lib/util/ModelUtil').is;

var isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny;

function ElementChanged(eventBus, overlays) {
    this._eventBus = eventBus;
    this._overlays = overlays;

    console.log(eventBus);

    this._init();
}

ElementChanged.prototype._init = function() {

    var eventBus = this._eventBus;
    var overlays = this._overlays;

    var self = this;

    eventBus.on('element.changed', function (event) {
        var element = event.element,
            current = self._current;

        if (isAny(element.businessObject, ['cp:Task', 'cp:EvidenceGateway'])) {
            if (evidenceLevel.includes(element.businessObject.get('evidence-level').toUpperCase())) {
                element.businessObject.set('evidence-level', element.businessObject.get('evidence-level').toUpperCase());

                console.log(overlays.get({element: element}));
                if (overlays.get({element: element}).length < 1) {
                    overlays.add(element, {
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
                overlays.remove({element: element});
                element.businessObject.set('evidence-level', '');
            }
        }
    });

};

ElementChanged.$inject = [ 'eventBus', 'overlays' ];

module.exports = ElementChanged;