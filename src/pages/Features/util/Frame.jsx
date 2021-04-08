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

    let treelyRoot;
    let frame;
    try {
      frame = ReactDOM.findDOMNode(this);
    } catch (e) {

    }

    try {
      treelyRoot = frame.contentDocument.getElementById('treelyRoot');
    } catch (e) {
    }

    if (treelyRoot) {
      ReactDOM.render(nextProps.children, treelyRoot);
    }
  }

  componentDidMount() {
    setTimeout(this.renderFrame, 0);
  }

  componentWillUnmount() {
    try {
      ReactDOM.unmountComponentAtNode(
        ReactDOM.findDOMNode(this).contentDocument.getElementById('treelyRoot')
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
    const treelyRoot = document.createElement('div');
    removeNode(document.querySelector('#treelyRoot'));

    treelyRoot.setAttribute('id', 'treelyRoot');
    this.head = frame.contentDocument.head;
    this.body = frame.contentDocument.body;
    this.body.id = "treelyBody"
    this.body.style = "margin:0; font-family: Roboto, sans-serif; height: 100%;";

    this.body.appendChild(treelyRoot);

    this.updateStylesheets(styleSheets);
    setTimeout(() => {
      this.updateCss(css);
    }, 0);

    ReactDOM.render(this._children, treelyRoot);
  };

  render() {
    this._children = this.props.children;
    const { children, styleSheets, css, ...props } = this.props;
    return <iframe {...props} onLoad={this.renderFrame} />;
  }
}

const removeNode = (node) => {
  ////consolelog("removing");
  try {
    node && node.parentNode && node.parentNode.removeChild(node);
  } catch (e) {
    //consolelog(e);
  }
}

export default Frame;
