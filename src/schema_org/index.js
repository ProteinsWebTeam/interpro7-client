// @flow
import { PureComponent } from 'react';
import T from 'prop-types';

import { schedule } from 'timing-functions/src';

import merger from './merger';

let manager;

const DEFAULT_MAX_DELAY = 1000;

/*:: type Payload = {
  subscriber: any,
  data: any,
  processData: any => Object,
};*/

export class Manager {
  /* ::
    _node: Element
    _maxDelay: number
    _subscriptions: Map<any, boolean | string>
    _dataMap: Map<string, Object>
    _plannedRender: boolean
  */
  constructor(
    {
      maxDelay = DEFAULT_MAX_DELAY,
      dev,
      root,
    } /*: {maxDelay: number, dev: ?boolean} */ = {},
  ) {
    // Skip if no document present
    if (!document) return;
    // Create container script node
    this._node = document.createElement('script');
    this._node.type = 'application/ld+json';
    // Define instance values
    this._maxDelay = maxDelay;
    this._dev = dev;
    this._rootData = root;
    this._subscriptions = new Map();
    this._dataMap = new Map();
    this._plannedRender = false;
    // Skip if document head not present
    if (!document.head) return;
    // Kick off render
    this._planRender();
    // expose instance to React component
    // eslint-disable-next-line consistent-this
    manager = this;
  }

  disconnect() {
    this.parentNode.removeChild(this._node);
    this._node = null;
  }

  _render(mergedData) {
    if (!this._node) return;
    // const stringified = JSON.stringify(mergedData, null, this._dev ? 2 : 0);
    const stringified = JSON.stringify(mergedData, null, 2);
    this._node.textContent = stringified;
    // This should happen the first time it is rendered
    if (!this._node.parentNode && document.head) {
      // Add to the DOM
      document.head.appendChild(this._node);
    }
    return stringified;
  }

  // eslint-disable-next-line complexity, max-statements
  async _planRender() {
    if (this._plannedRender) return;
    this._plannedRender = true;
    const deadline = await schedule(this._maxDelay);
    if (this._dev) console.groupCollapsed('Schema.org rendering');
    if (this._dev) console.time('schema.org rendering took');
    if (this._dev) console.groupCollapsed('data maps');
    if (this._dev) {
      console.group('@@root');
      console.log(this._rootData);
      console.groupEnd();
      for (const [id, values] of this._dataMap) {
        console.group(id);
        for (const value of values) console.log(value);
        console.groupEnd();
      }
    }
    if (this._dev) console.groupEnd();
    if (this._dev) console.time('Schema.org merger');
    const mergedData = await merger(
      this._dataMap,
      deadline,
      this._rootData,
      this._dev,
    );
    if (this._dev) console.timeEnd('Schema.org merger');
    this._plannedRender = false;
    if (this._dev) console.time('Schema.org stringify to DOM');
    const stringified = this._render(mergedData);
    if (this._dev) console.timeEnd('Schema.org stringify to DOM');
    if (this._dev) console.group('Stringified schema');
    if (this._dev) console.log(stringified);
    if (this._dev) console.groupEnd();
    if (this._dev) console.groupEnd();
    if (this._dev) console.timeEnd('schema.org rendering took');
  }

  async _process(subscriptionPayload /*: Payload */) {
    await schedule(this._maxDelay);
    if (!this._subscriptions.has(subscriptionPayload.subscriber)) return;
    const { ['@id']: id, ...processed } = subscriptionPayload.processData(
      subscriptionPayload.data,
    );
    if (!id) throw new Error('no "@id" found');
    const dataSet = this._dataMap.get(id) || new Set();
    dataSet.add(processed);
    this._dataMap.set(id, dataSet);
    this._subscriptions.set(subscriptionPayload.subscriber, id);
    this._planRender();
  }

  subscribe(subscriptionPayload /*: Payload */) {
    this._subscriptions.set(subscriptionPayload.subscriber, true);
    this._process(subscriptionPayload);
  }

  unsubscribe(subscriber) {
    const id = this._subscriptions.get(subscriber);
    this._subscriptions.delete(subscriber);
    if (id) {
      this._dataMap.delete(id);
      this._planRender();
    }
  }
}

export default class SchemaOrgData extends PureComponent {
  static propTypes = {
    data: T.any,
    processData: T.func.isRequired,
    children: T.node,
  };

  static defaultProps = {
    processData: d => d,
  };

  componentDidMount() {
    if (!manager) return;
    const { data, processData } = this.props;
    manager.subscribe({ subscriber: this, data, processData });
  }

  componentWillUnmount() {
    if (!manager) return;
    manager.unsubscribe(this);
  }

  render() {
    const { children } = this.props;
    return children || null;
  }
}
