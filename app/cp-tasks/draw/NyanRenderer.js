var inherits = require('inherits'),
    isObject = require('lodash/lang/isObject'),
    assign = require('lodash/object/assign'),
    forEach = require('lodash/collection/forEach'),
    every = require('lodash/collection/every'),
    includes = require('lodash/collection/includes'),
    some = require('lodash/collection/some');

var BaseRenderer = require('diagram-js/lib/draw/BaseRenderer'),
    TextUtil = require('diagram-js/lib/util/Text');

var is = require('bpmn-js/lib/util/ModelUtil').is;

var Icons = require('../icons/index');

var svgAppend = require('tiny-svg/lib/append'),
    svgAttr = require('tiny-svg/lib/attr'),
    svgCreate = require('tiny-svg/lib/create'),
    svgClasses = require('tiny-svg/lib/classes');

var LABEL_STYLE = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 12
};
var TASK_BORDER_RADIUS = 10;
var INNER_OUTER_DIST = 3;

function CPRender(eventBus, styles, pathMap) {
    BaseRenderer.call(this, eventBus, 1500);

    var textUtil = new TextUtil({
        style: LABEL_STYLE,
        size: {width: 100}
    });

    var computeStyle = styles.computeStyle;

    // add rendering of new elements here
    var handlers = this.handlers = {
        'bpmn:Activity': function(parentGfx, element, attrs) {
            return drawRect(parentGfx, element.width, element.height, TASK_BORDER_RADIUS, attrs);
        },

        'bpmn:Task': function(parentGfx, element, attrs) {
            var rect = renderer('bpmn:Activity')(parentGfx, element, attrs);
            renderEmbeddedLabel(parentGfx, element, 'center-middle');
            return rect;
        },
        'cp:TherapyTask': function (parent, element) {
            var task = renderer('bpmn:Task')(parent, element);
            var url = Icons.iconTherapyTask;

            var shapeGfx = svgCreate('image', {
                x: 3,
                y: 3,
                width: 20,
                href: url
            });

            svgAppend(parent, shapeGfx);

            return task;
        },
        'cp:DiagnosisTask': function (parent, element) {
            var task = renderer('bpmn:Task')(parent, element);
            var url = Icons.iconDiagnosisTask;

            var shapeGfx = svgCreate('image', {
                x: 3,
                y: 3,
                width: 15,
                href: url
            });

            svgAppend(parent, shapeGfx);

            return task;
        },
        'cp:SupportingTask': function (parent, element) {
            var task = renderer('bpmn:Task')(parent, element);
            var url = Icons.iconSupportingTask;

            var shapeGfx = svgCreate('image', {
                x: 3,
                y: 3,
                width: 20,
                href: url
            });

            svgAppend(parent, shapeGfx);

            return task;
        },
    };

    function renderer(type) {
        return handlers[type];
    }


    function drawRect(parentGfx, width, height, r, offset, attrs) {

        if (isObject(offset)) {
            attrs = offset;
            offset = 0;
        }

        offset = offset || 0;

        attrs = computeStyle(attrs, {
            stroke: 'black',
            strokeWidth: 2,
            fill: 'white'
        });

        var rect = svgCreate('rect');
        svgAttr(rect, {
            x: offset,
            y: offset,
            width: width - offset * 2,
            height: height - offset * 2,
            rx: r,
            ry: r
        });
        svgAttr(rect, attrs);

        svgAppend(parentGfx, rect);

        return rect;
    }

    function renderLabel(parentGfx, label, options) {
        var text = textUtil.createText(parentGfx, label || '', options);
        svgClasses(text).add('djs-label');

        return text;
    }

    function renderEmbeddedLabel(parentGfx, element, align) {
        var semantic = getSemantic(element);
        return renderLabel(parentGfx, semantic.name, {box: element, align: align, padding: 5});
    }


    this.canRender = function (element) {
        return is(element, 'cp:TherapyTask') || is(element, 'cp:DiagnosisTask') || is(element, 'cp:SupportingTask');
    };

    this.drawShape = function (parent, element) {
        console.log(element);
        console.log(getSemantic(element));

        var handler = this.handlers[element.type];
        return handler(parent, element);
    };
}

inherits(CPRender, BaseRenderer);

module.exports = CPRender;

function getSemantic(element) {
    return element.businessObject;
}