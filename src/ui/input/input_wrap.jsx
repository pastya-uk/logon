import React from 'react';


export default class InputWrap extends React.Component {
  render() {
    const { before, focused, invalidHint, isValid, name, icon } = this.props;
    let blockClassName = `uaa-logon-input-block uaa-logon-input-${name}`;
    if (!isValid) {
      blockClassName += " uaa-logon-error";
    }

    let wrapClassName = "uaa-logon-input-wrap";
    if (focused && isValid) {
      wrapClassName += " uaa-logon-focused";
    }

    // NOTE: Ugly hack until we upgrade to React 15 which has better
    // support for SVG.
    let iconElement = null;

    if (typeof icon === "string") {
      iconElement = <span dangerouslySetInnerHTML={{__html: icon}} />;
    } else if (icon) {
      iconElement = icon;
    }

    if (iconElement) {
      wrapClassName += " uaa-logon-input-wrap-with-icon";
    }

    const errorTooltip = !isValid && invalidHint
      ? <div className="uaa-logon-error-msg"><span>{invalidHint}</span></div>
      : null;

    return (
      <div className={blockClassName}>
        {before}
        <div className={wrapClassName}>
          {iconElement}
          {this.props.children}
        </div>
        {errorTooltip}
      </div>
    );
  }
}

InputWrap.propTypes = {
  before: React.PropTypes.element,
  children: React.PropTypes.oneOfType([
    React.PropTypes.element.isRequired,
    React.PropTypes.arrayOf(React.PropTypes.element).isRequired
  ]),
  focused: React.PropTypes.bool,
  invalidHint: React.PropTypes.string,
  isValid: React.PropTypes.bool.isRequired,
  name: React.PropTypes.string.isRequired,
  svg: React.PropTypes.string
};
