/* eslint no-param-reassign: 0 */
import {findDOMNode} from 'react-dom';
import React, {Component} from 'react';

import Listener from 'utils/eventListener';

const listener = new Listener('resize');

const setAttributes = (acc, attr) => {
  acc[attr] = null;
  return acc;
};

const _DOMAttributeChecker = (...attributes) => Content => (
  class DOMAttributeCheckerLoader extends Component {
    static displayName = (
      `DOMAttributeChecker(${Content.displayName || Content.name})`
    );

    state = attributes.reduce(setAttributes, {});

    componentDidMount() {
      this.element = findDOMNode(this);
      this.retrieveAttributeValues();
      this.unsubscribe = listener.subscribe(this.retrieveAttributeValues);
    }

    componentDidUpdate(prevProps) {
      if (this.props !== prevProps) {
        this.retrieveAttributeValues();
      }
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    retrieveAttributeValues = () => {
      const atts = {};

      for (const att of Object.keys(this.state)) {
        atts[att] = this.element[att];
      }
      this.setState({...atts});
    }

    render() {
      return (
        <Content
          {...this.props}
          {...this.state}
          refreshDOMAttributes={this.retrieveAttributeValues}
        />
      );
    }
  }
);

export default _DOMAttributeChecker;
