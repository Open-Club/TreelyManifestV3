import React, { Component } from 'react';
import ReactDOM from 'react-dom';



class Frame extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.styleSheets.join('') !== this.props.styleSheets.join('')) {
      this.updateStylesheets(nextProps.styleSheets);
    }

    if (nextProps.css !== this.props.css) {
      this.updateCss(nextProps.css);
    }

    let root;
    let frame;
    try {
      frame = ReactDOM.findDOMNode(this);
    } catch (e) {

    }

    try {
      root = frame.contentDocument.getElementById('root');
    } catch (e) {
    }

    if (root) {
      ReactDOM.render(nextProps.children, root);
    }
  }

  componentDidMount() {
    setTimeout(this.renderFrame, 0);
  }

  componentWillUnmount() {
    try {
      ReactDOM.unmountComponentAtNode(
        ReactDOM.findDOMNode(this).contentDocument.getElementById('root')
      );
    } catch (e) {
    }

  }

  updateStylesheets = styleSheets => {
    let links;
    try {
      links = this.head.querySelectorAll('link');
    } catch (e) {
    }
    if (links) {
      for (let i = 0, l = links.length; i < l; i++) {
        const link = links[i];
        link.parentNode.removeChild(link);
      }

      if (styleSheets && styleSheets.length) {
        styleSheets.forEach(href => {
          const link = document.createElement('link');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('type', 'text/css');
          link.setAttribute('href', href);
          this.head.appendChild(link);
        });
      }

    }

  };

  updateCss = css => {
    if (!this.styleEl) {
      const el = document.createElement('style');
      el.type = 'text/css';
      if (this.head) this.head.appendChild(el);
      this.styleEl = el;
    }

    const el = this.styleEl;

    if (el.styleSheet) {
      el.styleSheet.cssText = css;
    } else {
      const cssNode = document.createTextNode(css);
      if (this.cssNode) el.removeChild(this.cssNode);
      el.appendChild(cssNode);
      this.cssNode = cssNode;
    }
  };

  renderFrame = () => {
    const { styleSheets, css } = this.props;
    const frame = ReactDOM.findDOMNode(this);
    const root = document.createElement('div');

    root.setAttribute('id', 'root');
    this.head = frame.contentDocument.head;
    this.body = frame.contentDocument.body;
    this.body.style = "margin:0; font-family: Roboto, sans-serif;";

    this.body.appendChild(root);

    this.updateStylesheets(styleSheets);
    setTimeout(() => {
      this.updateCss(css);
    }, 0);

    ReactDOM.render(this._children, root);
  };

  render() {
    this._children = this.props.children;
    const { children, styleSheets, css, ...props } = this.props;
    return <iframe {...props} onLoad={this.renderFrame} />;
  }
}

export default Frame;
