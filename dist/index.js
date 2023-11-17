"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Venetian = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.sort.js");
require("core-js/modules/es.object.assign.js");
var _react = require("react");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/*
 *
 */

const SlideInner = props => {
  //
  const as = props.as;
  const children = props.children;

  //
  delete props.as;
  delete props.children;

  //
  return /*#__PURE__*/(0, _react.createElement)(as ? as : 'div', props, children);
};
const SlideActive = props => /*#__PURE__*/React.createElement(SlideInner, props);
const SlideCollapsed = props => /*#__PURE__*/React.createElement(SlideInner, props);

/*
 *
 */

const SlideOuter = function SlideOuter(isActive, index, _ref) {
  let {
    children
  } = _ref;
  // 
  const [Active, Collapsed] = children.sort((child, nextChild) => ({
    [child.type === SlideActive || child.type === SlideCollapsed]: -1,
    [nextChild.type === SlideActive]: 1
  })[true]);

  //
  const Slide = isActive ? Active : Collapsed;

  //
  Object.assign(Slide.props, {
    tabindex: index,
    'aria-current': isActive,
    'aria-expanded': isActive
  });

  //
  return isActive ? Active : Collapsed;
};

/*
 *
 */

const Venetian = _ref2 => {
  let {
    staticContent,
    slides,
    slideElement: Slide
  } = _ref2;
  // Append Static Content
  const staticContentElement = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    staticContentElement.current.append(...staticContent.childNodes);
  }, [staticContentElement]);

  // Track Active Slide
  const [activeSlide, setActiveSlide] = (0, _react.useState)(0);

  // Create necessaey Unique ID's for ARIA
  const activeSlideAreaId = (0, _react.useId)();

  // Parse Children
  const children = slides.map((slide, index) => {
    //
    const key = slide.key ? slide.key : "slide_".concat(index);
    delete slide.key;

    //
    const isActive = activeSlide === index;

    //
    return /*#__PURE__*/React.createElement(Slide, _extends({}, slide, {
      //
      tabindex: index,
      "aria-current": isActive,
      "aria-expanded": isActive
      //
      ,
      ariaTarget: activeSlideAreaId
      //
      ,
      Content: SlideOuter.bind(undefined, isActive, index),
      Active: SlideActive,
      Collapsed: SlideCollapsed
      //
      ,
      setActiveSlide: setActiveSlide
      //
      ,
      index: index,
      activeSlide: activeSlide
    }));
  });

  // JSX
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "staticContent",
    ref: staticContentElement
  }), /*#__PURE__*/React.createElement("div", {
    id: activeSlideAreaId,
    className: "activeSlide"
  }, children.splice(activeSlide, 1)), /*#__PURE__*/React.createElement("div", {
    className: "collapsedSlides"
  }, children));
};
exports.Venetian = Venetian;