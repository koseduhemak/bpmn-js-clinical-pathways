'use strict';

var inherits = require('inherits');
var ReplaceMenuProvider = require('bpmn-js/lib/features/popup-menu/ReplaceMenuProvider');

var is = require('bpmn-js/lib/util/ModelUtil').is,
    isExpanded = require('bpmn-js/lib/util/DiUtil').isExpanded,
    isDifferentType = require('bpmn-js/lib/features/popup-menu/util/TypeUtil').isDifferentType;

var forEach = require('lodash/collection/forEach'),
    filter = require('lodash/collection/filter'),
    reject = require('lodash/collection/reject');

var replaceCPOptions = require('../replace/CPReplaceOptions');



/**
 * This module is an element agnostic replace menu provider for the popup menu.
 */
function CPReplaceMenuProvider(popupMenu, modeling, moddle, bpmnReplace, rules, translate) {
    ReplaceMenuProvider.call(this, popupMenu, modeling, moddle, bpmnReplace, rules, translate);
}

CPReplaceMenuProvider.$inject = [ 'popupMenu', 'modeling', 'moddle', 'bpmnReplace', 'rules', 'translate' ];
inherits(CPReplaceMenuProvider, ReplaceMenuProvider);
module.exports = CPReplaceMenuProvider;

/**
 * Get all entries from replaceOptions for the given element and apply filters
 * on them. Get for example only elements, which are different from the current one.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
var cachedGetEntries = ReplaceMenuProvider.prototype.getEntries;
ReplaceMenuProvider.prototype.getEntries = function(element) {
    var businessObject = element.businessObject;
    var entries;

    var differentType = isDifferentType(element);

    // TODO how to proper extend base method?

    // flow nodes
    if (is(businessObject, 'bpmn:Task')) {
        entries = filter(replaceCPOptions.TASK, differentType);

        // collapsed SubProcess can not be replaced with itself
        if (is(businessObject, 'bpmn:SubProcess') && !isExpanded(businessObject)) {
            entries = reject(entries, function(entry) {
                return entry.label === 'Sub Process (collapsed)';
            });
        }

        return this._createEntries(element, entries);
    } else if (is(businessObject, 'bpmn:Gateway')) {
        entries = filter(replaceCPOptions.GATEWAY, differentType);

        return this._createEntries(element, entries);
    }else {
        return cachedGetEntries.call(this, element);
    }

    return [];
};

