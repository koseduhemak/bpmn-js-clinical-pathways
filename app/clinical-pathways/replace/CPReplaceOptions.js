
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
        label: 'SimultanParallelGateway',
        actionName: 'replace-with-simultan-parallel-gateway',
        className: 'cp-icon-simultan-parallel-gateway',
        target: {
            type: 'cp:SimultanParallelGateway'
        }
    },
];