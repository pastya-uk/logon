import React from 'react';
import { BackButton } from './button';

// TODO: simplify this mess :)

export default class Header extends React.Component {
  render() {
    const { backHandler, backgroundColor, backgroundUrl, logoUrl, name, title } = this.props;

    return (
      <div className="uaa-logon-header">
        {backHandler && <BackButton onClick={backHandler} />}
        <Background imageUrl={backgroundUrl} backgroundColor={backgroundColor} grayScale={!!name} />
        <Welcome title={title} name={name} imageUrl={name ? undefined : logoUrl} />
      </div>
    );
  }
}

Header.propTypes = {
  backgroundUrl: React.PropTypes.string,
  logoUrl: React.PropTypes.string,
  name: React.PropTypes.string
};

class Welcome extends React.Component {
  render() {
    const { name, imageUrl, title } = this.props;
    const img = <img className="uaa-logon-header-logo" src={imageUrl} />;

    return (
      <div className="uaa-logon-header-welcome">
        {imageUrl && img}
        <WelcomeMessage title={title} name={name}/>
      </div>
    );
  }
}

Welcome.propTypes = {
  imageUrl: React.PropTypes.string,
  name: React.PropTypes.string
};

class WelcomeMessage extends React.Component {
  render() {
    const { name, title } = this.props;
    let className, message;

    if (name) {
      className = "uaa-logon-firstname";
      message = name;
    } else {
      className = "uaa-logon-name";
      message = title;
    }

    return <div className={className}>{message}</div>;
  }
}

WelcomeMessage.propTypes = {
  name: React.PropTypes.string
}

const cssBlurSupport = (function() {
  // Check stolen from Modernizr, see https://github.com/Modernizr/Modernizr/blob/29eab707f7a2fb261c8a9c538370e97eb1f86e25/feature-detects/css/filters.js
  const isEdge = global.navigator && !!global.navigator.userAgent.match(/Edge/i);
  if (typeof global.document === 'undefined' || isEdge) return false;

  const el = global.document.createElement('div');
  el.style.cssText = "filter: blur(2px); -webkit-filter: blur(2px)";
  return !!el.style.length && (global.document.documentMode === undefined || global.document.documentMode > 9);
})();

class Background extends React.Component {
  render() {
    const { backgroundColor, imageUrl, grayScale } = this.props;

    const props = {
      className: "uaa-logon-header-bg"
    };

    if (cssBlurSupport) {
      props.className += " uaa-logon-blur-support";
    }

    const blurProps = {
      className: 'uaa-logon-header-bg-blur',
      style: {backgroundImage: `url('${imageUrl}')`}
    };

    if (grayScale) {
      blurProps.className += ' uaa-logon-no-grayscale';
    }

    const solidProps = {
      className: "uaa-logon-header-bg-solid",
      style: {backgroundColor: backgroundColor}
    }

    return (
      <div {...props}>
        <div {...blurProps} />
        <div {...solidProps} />
      </div>
    );
  }
}

Background.propTypes = {
  backgorundColor: React.PropTypes.string,
  grayScale: React.PropTypes.bool,
  imageUrl: React.PropTypes.string
}
