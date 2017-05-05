import {PureComponent} from 'react';
import T from 'prop-types';

import {schedule} from 'timing-functions/src';
import {DEV} from 'config';

let instanciated = false;
let manager;

const DEFAULT_MAX_DELAY = 1000;

const rootData = {
  '@context': 'http://schema.org',
  '@type': 'WebSite',
  url: 'https://www.ebi.ac.uk/interpro',
  mainEntityOfPage: '@mainEntity',
};

class Manager {
  constructor(node) {
    this._node = node;
    this._subscriptions = new Map();
    this._dataMap = new Map();
    this._plannedRender = false;
    this._planRender();
  }

  _render() {
    console.log('merging');
    const schema = {};
    for (const [key, value] of Object.entries(rootData)) {
      if (value[0] === '@') {
        const data = this._dataMap.get(value);
        if (data) {
          schema[key] = data;
        }// else don't add
      } else {
        schema[key] = value;
      }
    }
    console.log(schema);
    this._node.textContent = JSON.stringify(schema, null, DEV ? 2 : 0);
  }

  async _planRender() {
    if (this._plannedRender) return;
    this._plannedRender = true;
    await schedule(DEFAULT_MAX_DELAY);
    this._plannedRender = false;
    this._render();
  }

  async _process(subscriptionPayload) {
    await schedule(DEFAULT_MAX_DELAY);
    if (!this._subscriptions.has(subscriptionPayload.subscriber)) return;
    const {['@id']: id, ...processed} = subscriptionPayload.processData(
      subscriptionPayload.data
    );
    if (!id) throw new Error('no "@id" found');
    this._dataMap.set(id, processed);
    this._subscriptions.set(subscriptionPayload.subscriber, id);
    this._planRender();
  }

  subscribe(subscriptionPayload) {
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

export const init = () => {
  // Skip if already executed
  if (instanciated) return;
  // Skip if document not ready
  if (!(document && document.head)) return;
  // Create container script node
  const node = document.createElement('script');
  node.type = 'application/ld+json';
  // Add to the DOM
  document.head.appendChild(node);
  // Subscription manager
  new Manager(node);
  // Everything OK, so turn on the flag
  instanciated = true;
};

export default class SchemaOrgData extends PureComponent {
  static propTypes = {
    data: T.object.isRequired,
    processData: T.func.isRequired,
  };

  static defaultProps = {
    processData: d => d,
  };

  componentDidMount() {
    const {data, processData} = this.props;
    manager.subscribe({subscriber: this, data, processData});
  }

  componentWillUnmount() {
    manager.unsubscribe(this);
  }

  render() {
    return null;
  }
}
