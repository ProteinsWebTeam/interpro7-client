// @flow
import React, { Component } from 'react';
import T from 'prop-types';

import skylign from 'skylign';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import styles from './logo.css';
import loadable from 'higherOrder/loadable';

const f = foundationPartial(ebiGlobalStyles, styles);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = (data) => {
  return {
    '@id': '@additionalProperty',
    '@type': 'PropertyValue',
    name: 'hasSignature',
    value: [
      {
        '@type': 'CreativeWork',
        additionalType: ['bio:DataRecord', 'AlignmentLogo'],
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'maxHeight',
            value: data.max_height,
          },
          {
            '@type': 'PropertyValue',
            name: 'processing',
            value: data.processing,
          },
          {
            '@type': 'PropertyValue',
            name: 'alphabet',
            value: data.alphabet,
          },
          {
            '@type': 'PropertyValue',
            name: 'minHeightObserved',
            value: data.min_height_obs,
          },
        ],
      },
    ],
  };
};
/*:: type Props = {
  data: {}
}; */
class LogoSection extends Component /*:: <Props> */ {
  /* ::
    _ref: { current: null | React$ElementRef<'div'> };
  */
  static propTypes = {
    data: T.object,
  };

  constructor(props /*: Props */) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    /*
    hmmLogo(this._ref.current, {
      column_info: true,
      data: this.props.data,
      height_toggle: true,
    });
    */
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    // TODO: check how to do the clean-up
    // this.ec.destructor();
  }

  render() {
    return <div className={f('logo')} ref={this._ref} />;
  }
}

const HmmModelSection = ({ logo } /*: {logo: {}} */) => (
  <div className={f('row')}>
    <div className={f('columns')}>
      <div className={f('logo_wrapper')}>
        <SchemaOrgData
          data={JSON.stringify(logo)}
          processData={schemaProcessData}
        />
        <skylign-component logo={JSON.stringify(logo)} />
      </div>
    </div>
  </div>
);
HmmModelSection.propTypes = {
  logo: T.object.isRequired,
};

export default HmmModelSection;
