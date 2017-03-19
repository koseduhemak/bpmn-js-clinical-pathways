
module.exports.TASK = [
    {
        label: 'Task',
        actionName: 'replace-with-task',
        className: 'bpmn-icon-task',
        target: {
            type: 'bpmn:Task'
        }
    },
    {
        label: 'Send Task',
        actionName: 'replace-with-send-task',
        className: 'bpmn-icon-send',
        target: {
            type: 'bpmn:SendTask'
        }
    },
    {
        label: 'Receive Task',
        actionName: 'replace-with-receive-task',
        className: 'bpmn-icon-receive',
        target: {
            type: 'bpmn:ReceiveTask'
        }
    },
    {
        label: 'User Task',
        actionName: 'replace-with-user-task',
        className: 'bpmn-icon-user',
        target: {
            type: 'bpmn:UserTask'
        }
    },
    {
        label: 'Manual Task',
        actionName: 'replace-with-manual-task',
        className: 'bpmn-icon-manual',
        target: {
            type: 'bpmn:ManualTask'
        }
    },
    {
        label: 'Business Rule Task',
        actionName: 'replace-with-rule-task',
        className: 'bpmn-icon-business-rule',
        target: {
            type: 'bpmn:BusinessRuleTask'
        }
    },
    {
        label: 'Service Task',
        actionName: 'replace-with-service-task',
        className: 'bpmn-icon-service',
        target: {
            type: 'bpmn:ServiceTask'
        }
    },
    {
        label: 'Script Task',
        actionName: 'replace-with-script-task',
        className: 'bpmn-icon-script',
        target: {
            type: 'bpmn:ScriptTask'
        }
    },
    {
        label: 'Call Activity',
        actionName: 'replace-with-call-activity',
        className: 'bpmn-icon-call-activity',
        target: {
            type: 'bpmn:CallActivity'
        }
    },
    {
        label: 'Sub Process (collapsed)',
        actionName: 'replace-with-collapsed-subprocess',
        className: 'bpmn-icon-subprocess-collapsed',
        target: {
            type: 'bpmn:SubProcess',
            isExpanded: false
        }
    },
    {
        label: 'Sub Process (expanded)',
        actionName: 'replace-with-expanded-subprocess',
        className: 'bpmn-icon-subprocess-expanded',
        target: {
            type: 'bpmn:SubProcess',
            isExpanded: true
        }
    },
    // Clinical Pathway Tasks
    {
        label: 'Therapy Task',
        actionName: 'replace-with-therapy-task',
        className: 'cp-icon-therapy-task',
        target: {
            type: 'cp:TherapyTask'
        }
    },
    {
        label: 'Diagnosis Task',
        actionName: 'replace-with-diagnosis-task',
        className: 'cp-icon-diagnosis-task',
        target: {
            type: 'cp:DiagnosisTask'
        }
    },
    {
        label: 'Supporting Task',
        actionName: 'replace-with-supporting-task',
        className: 'cp-icon-supporting-task',
        target: {
            type: 'cp:SupportingTask'
        }
    },
    {
        label: 'Education Task',
        actionName: 'replace-with-education-task',
        className: 'cp-icon-education-task',
        target: {
            type: 'cp:EducationTask'
        }
    },
    {
        label: 'Home Visit Task',
        actionName: 'replace-with-home-visit-task',
        className: 'cp-icon-home-visit-task',
        target: {
            type: 'cp:HomeVisitTask'
        }
    },
    {
        label: 'Monitoring Task',
        actionName: 'replace-with-monitoring-task',
        className: 'cp-icon-monitoring-task',
        target: {
            type: 'cp:MonitoringTask'
        }
    },
    {
        label: 'Phone Contact Task',
        actionName: 'replace-with-phone-contact-task',
        className: 'cp-icon-phone-contact-task',
        target: {
            type: 'cp:PhoneContactTask'
        }
    }
];

module.exports.GATEWAY = [
    {
        label: 'Exclusive Gateway',
        actionName: 'replace-with-exclusive-gateway',
        className: 'bpmn-icon-gateway-xor',
        target: {
            type: 'bpmn:ExclusiveGateway'
        }
    },
    {
        label: 'Parallel Gateway',
        actionName: 'replace-with-parallel-gateway',
        className: 'bpmn-icon-gateway-parallel',
        target: {
            type: 'bpmn:ParallelGateway'
        }
    },
    {
        label: 'Inclusive Gateway',
        actionName: 'replace-with-inclusive-gateway',
        className: 'bpmn-icon-gateway-or',
        target: {
            type: 'bpmn:InclusiveGateway'
        }
    },
    {
        label: 'Complex Gateway',
        actionName: 'replace-with-complex-gateway',
        className: 'bpmn-icon-gateway-complex',
        target: {
            type: 'bpmn:ComplexGateway'
        }
    },
    {
        label: 'Event based Gateway',
        actionName: 'replace-with-event-based-gateway',
        className: 'bpmn-icon-gateway-eventbased',
        target: {
            type: 'bpmn:EventBasedGateway',
            instantiate: false,
            eventGatewayType: 'Exclusive'
        }
    },
    // Gateways deactivated until https://github.com/bpmn-io/bpmn-js/issues/194
    // {
    //   label: 'Event based instantiating Gateway',
    //   actionName: 'replace-with-exclusive-event-based-gateway',
    //   className: 'bpmn-icon-exclusive-event-based',
    //   target: {
    //     type: 'bpmn:EventBasedGateway'
    //   },
    //   options: {
    //     businessObject: { instantiate: true, eventGatewayType: 'Exclusive' }
    //   }
    // },
    // {
    //   label: 'Parallel Event based instantiating Gateway',
    //   actionName: 'replace-with-parallel-event-based-instantiate-gateway',
    //   className: 'bpmn-icon-parallel-event-based-instantiate-gateway',
    //   target: {
    //     type: 'bpmn:EventBasedGateway'
    //   },
    //   options: {
    //     businessObject: { instantiate: true, eventGatewayType: 'Parallel' }
    //   }
    // }

    // Clinical Pathway Gateways
    {
        label: 'Simultan Parallel Gateway',
        actionName: 'replace-with-simultan-parallel-gateway',
        className: 'cp-icon-simultan-parallel-gateway',
        target: {
            type: 'cp:SimultanParallelGateway'
        }
    },
    {
        label: 'Evidence Gateway',
        actionName: 'replace-with-evidence-gateway',
        className: 'cp-icon-evidence-gateway',
        target: {
            type: 'cp:EvidenceBasedGateway'
        }
    }
];

module.exports.CPRESOURCES = [
    {
        label: 'CP Resource',
        actionName: 'replace-with-resource',
        className: 'cp-icon-resource',
        target: {
            type: 'cp:CPResource'
        }
    },
    {
        label: 'Consumption Resource',
        actionName: 'replace-with-consumption-resource',
        className: 'cp-icon-consumption-resource',
        target: {
            type: 'cp:ConsumptionResource'
        }
    },
    {
        label: 'Equipment',
        actionName: 'replace-with-Equipment',
        className: 'cp-icon-Equipment',
        target: {
            type: 'cp:Equipment'
        }
    },
    {
        label: 'Medicine',
        actionName: 'replace-with-medicine',
        className: 'cp-icon-medicine',
        target: {
            type: 'cp:Medicine'
        }
    },
    {
        label: 'Transportation Equipment',
        actionName: 'replace-with-transportation-equipment',
        className: 'cp-icon-transportation-equipment',
        target: {
            type: 'cp:TransportationEquipment'
        }
    },
    {
        label: 'Room',
        actionName: 'replace-with-room',
        className: 'cp-icon-room',
        target: {
            type: 'cp:Room'
        }
    },
    {
        label: 'Auxiliaries',
        actionName: 'replace-with-auxiliaries',
        className: 'cp-icon-auxiliaries',
        target: {
            type: 'cp:Auxiliaries'
        }
    },
    {
        label: 'Human Resource',
        actionName: 'replace-with-human-resource',
        className: 'cp-icon-human-resource',
        target: {
            type: 'cp:HumanResource'
        }
    }
];

module.exports.CLINICALSTATEMENTS = [
    {
        label: 'Observation',
        actionName: 'replace-with-observation',
        className: 'cp-icon-observation',
        target: {
            type: 'cp:Observation'
        }
    },
    {
        label: 'Action',
        actionName: 'replace-with-action',
        className: 'cp-icon-action',
        target: {
            type: 'cp:Action'
        }
    },
    {
        label: 'Medication',
        actionName: 'replace-with-medication',
        className: 'cp-icon-medication',
        target: {
            type: 'cp:Medication'
        }
    },
    {
        label: 'Multimedia Object',
        actionName: 'replace-with-multimedia-object',
        className: 'cp-icon-multimedia-object',
        target: {
            type: 'cp:MultimediaObject'
        }
    },
    {
        label: 'Care',
        actionName: 'replace-with-care',
        className: 'cp-icon-care',
        target: {
            type: 'cp:Care'
        }
    },
    {
        label: 'Meeting',
        actionName: 'replace-with-meeting',
        className: 'cp-icon-meeting',
        target: {
            type: 'cp:Meeting'
        }
    },
    {
        label: 'Procedure',
        actionName: 'replace-with-procedure',
        className: 'cp-icon-procedure',
        target: {
            type: 'cp:Procedure'
        }
    },
    {
        label: 'Objective Area',
        actionName: 'replace-with-objective-area',
        className: 'cp-icon-objective-area',
        target: {
            type: 'cp:ObjectiveArea'
        }
    }
];

module.exports.UNSTRUCTUREDDOCUMENTS = [
    {
        label: 'Video Document',
        actionName: 'replace-with-video-document',
        className: 'cp-icon-video-document',
        target: {
            type: 'cp:VideoDocument'
        }
    },
    {
        label: 'Singaling Document',
        actionName: 'replace-with-signaling-document',
        className: 'cp-icon-signaling-document',
        target: {
            type: 'cp:SignalingDocument'
        }
    },
    {
        label: 'Text Document',
        actionName: 'replace-with-text-document',
        className: 'cp-icon-text-document',
        target: {
            type: 'cp:TextDocument'
        }
    },
    {
        label: 'Image Document',
        actionName: 'replace-with-image-document',
        className: 'cp-icon-image-document',
        target: {
            type: 'cp:ImageDocument'
        }
    }
];